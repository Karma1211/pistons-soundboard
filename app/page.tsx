'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SOUNDS, CATEGORIES, Category, Sound } from '@/lib/sounds';
import { SoundButton } from '@/components/SoundButton';
import { CategoryTabs } from '@/components/CategoryTabs';
import { UploadCard } from '@/components/UploadCard';
import { AudioEditor } from '@/components/AudioEditor';
import { SyncModal } from '@/components/SyncModal';
import { LiveSyncModal } from '@/components/LiveSyncModal';
import { useAudio } from '@/hooks/useAudio';
import { useLiveSync } from '@/hooks/useLiveSync';
import { encodeSync, decodeSync } from '@/lib/syncUrl';
import { SYNC_DELAY_MS } from '@/hooks/useLiveSync';
import type { SoundOverride, CustomSound } from '@/lib/types';

interface EditTarget {
  id: string;
  label: string;
  srcUrl: string;
}

const CUSTOM_KEY = 'pistons-custom-sounds-v2';
const OVERRIDES_KEY = 'pistons-overrides';
const FAVORITES_KEY = 'pistons-favorites';

function getOrigin() {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

export default function SoundboardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('hype');
  const [customSounds, setCustomSounds] = useState<CustomSound[]>([]);
  const [overrides, setOverrides] = useState<Record<string, SoundOverride>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [showSync, setShowSync] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [muteLocal, setMuteLocal] = useState(false);
  const { states, play, stop, toggle, stopAll, preload } = useAudio();
  const syncLink = useRef('');

  // Pre-fetch all sounds when joining a live session to minimize sync latency
  useEffect(() => {
    if (sessionId) {
      preload(SOUNDS.map((s) => s.file));
    }
  }, [sessionId, preload]);

  // Load from localStorage + check ?s= URL param on mount
  useEffect(() => {
    try {
      const c = localStorage.getItem(CUSTOM_KEY);
      if (c) setCustomSounds(JSON.parse(c));
      const o = localStorage.getItem(OVERRIDES_KEY);
      if (o) setOverrides(JSON.parse(o));
      const f = localStorage.getItem(FAVORITES_KEY);
      if (f) setFavorites(JSON.parse(f));
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    if (s) {
      const data = decodeSync(s);
      if (data) {
        setFavorites(data.favorites);
        setOverrides(data.overrides);
      }
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(customSounds)); } catch {}
  }, [customSounds]);

  useEffect(() => {
    try { localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides)); } catch {}
  }, [overrides]);

  useEffect(() => {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  // Live sync — remote events trigger audio directly (no re-broadcast)
  const onRemoteEvent = useCallback((e: { action: string; soundId?: string; file?: string; startMs?: number; endMs?: number; playAt?: number }) => {
    if (e.action === 'stopAll') { stopAll(); return; }
    if (e.action === 'stop' && e.soundId) { stop(e.soundId); return; }
    if (e.action === 'play' && e.soundId && e.file) {
      // Calculate how many ms remain until the scheduled fire time.
      // If the event arrived late (playAt already passed), play immediately.
      const playAfterMs = e.playAt ? Math.max(0, e.playAt - Date.now()) : 0;
      play(e.soundId, e.file, { startMs: e.startMs, endMs: e.endMs, playAfterMs });
    }
  }, [play, stop, stopAll]);

  const { broadcastEvent } = useLiveSync(sessionId, onRemoteEvent);

  const handleUpload = useCallback((label: string, dataUrl: string) => {
    setCustomSounds((prev) => [...prev, { id: `custom-${Date.now()}`, label, dataUrl }]);
  }, []);

  const handleEditorSave = useCallback((id: string, label: string, startMs: number, endMs: number) => {
    if (id.startsWith('custom-')) {
      setCustomSounds((prev) =>
        prev.map((s) => s.id === id ? { ...s, label, startMs, endMs } : s)
      );
    } else {
      setOverrides((prev) => ({ ...prev, [id]: { label, startMs, endMs } }));
    }
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const handleImport = useCallback((encoded: string) => {
    const data = decodeSync(encoded);
    if (!data) return;
    setFavorites(data.favorites);
    setOverrides(data.overrides);
  }, []);

  function openSync() {
    syncLink.current = `${getOrigin()}/?s=${encodeSync(favorites, overrides)}`;
    setShowSync(true);
  }

  const allSounds: Sound[] = [
    ...SOUNDS,
    ...customSounds.map((c): Sound => ({
      id: c.id, label: c.label, file: c.dataUrl, category: 'mine', color: 'gold', subtitle: 'Custom',
    })),
  ];

  function getDisplaySound(sound: Sound): Sound & { startMs?: number; endMs?: number } {
    if (sound.id.startsWith('custom-')) {
      const cs = customSounds.find((c) => c.id === sound.id);
      const ov = overrides[sound.id];
      return { ...sound, label: ov?.label ?? sound.label, startMs: cs?.startMs, endMs: cs?.endMs };
    }
    const ov = overrides[sound.id];
    return { ...sound, label: ov?.label ?? sound.label, startMs: ov?.startMs, endMs: ov?.endMs };
  }

  function openEditor(sound: Sound) {
    const ov = overrides[sound.id];
    const srcUrl = sound.id.startsWith('custom-') ? sound.file : `/sounds/${sound.file}`;
    setEditTarget({ id: sound.id, label: ov?.label ?? sound.label, srcUrl });
  }

  function renderButton(sound: Sound) {
    const ds = getDisplaySound(sound);
    const isFav = favorites.includes(sound.id);
    return (
      <div key={sound.id} className="relative">
        <SoundButton
          sound={{ ...sound, label: ds.label }}
          state={states[sound.id] ?? 'idle'}
          onPress={() => {
            const isPlaying = states[sound.id] === 'playing';
            if (sessionId) {
              if (isPlaying) {
                stop(sound.id);
                broadcastEvent({ action: 'stop', soundId: sound.id });
              } else {
                broadcastEvent({
                  action: 'play',
                  soundId: sound.id,
                  file: sound.file,
                  startMs: ds.startMs,
                  endMs: ds.endMs,
                });
                if (!muteLocal) {
                  // Delay local play by the same window so sender fires at the same
                  // wall-clock moment as the receiver.
                  play(sound.id, sound.file, { startMs: ds.startMs, endMs: ds.endMs, playAfterMs: SYNC_DELAY_MS });
                }
              }
            } else {
              toggle(sound.id, sound.file, { startMs: ds.startMs, endMs: ds.endMs });
            }
          }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); openEditor(sound); }}
          className="absolute top-1.5 left-1.5 w-7 h-7 rounded-md bg-black/70 flex items-center justify-center text-white/70 active:bg-black text-[13px] z-10"
        >
          ✎
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(sound.id); }}
          className={[
            'absolute top-1.5 right-1.5 w-7 h-7 rounded-md flex items-center justify-center text-[13px] z-10',
            isFav ? 'bg-[#BFA054]/30 text-[#BFA054]' : 'bg-black/70 text-white/30',
          ].join(' ')}
        >
          ★
        </button>
      </div>
    );
  }

  const favoriteSounds = allSounds.filter((s) => favorites.includes(s.id));
  const builtInFiltered = SOUNDS.filter((s) => s.category === activeCategory);
  const customAsSound = customSounds.map((c): Sound => ({
    id: c.id, label: c.label, file: c.dataUrl, category: 'mine', color: 'gold', subtitle: 'Custom',
  }));

  const anyPlaying = Object.values(states).some((s) => s === 'playing' || s === 'loading');
  const playingCount = Object.values(states).filter((s) => s === 'playing').length;

  function renderGrid() {
    if (activeCategory === 'favorites') {
      if (!favoriteSounds.length) return (
        <div className="col-span-2 flex flex-col items-center justify-center py-16 gap-3 text-center">
          <span className="text-4xl">⭐</span>
          <p className="text-[#555] text-xs font-black tracking-widest uppercase">No favorites yet</p>
          <p className="text-[#444] text-[10px]">Tap ★ on any sound to add it here</p>
        </div>
      );
      return favoriteSounds.map(renderButton);
    }
    if (activeCategory === 'mine') {
      return (
        <>
          <UploadCard onUpload={handleUpload} />
          {[...builtInFiltered, ...customAsSound].map(renderButton)}
        </>
      );
    }
    return builtInFiltered.map(renderButton);
  }

  return (
    <div className="flex flex-col h-dvh bg-[#0a0a0a] overflow-hidden">
      <header className="flex-shrink-0 px-4 pt-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-0.5 items-end">
              <span className="block w-2 h-8 bg-[#C8102E] rounded-sm" />
              <span className="block w-2 h-6 bg-[#006BB6] rounded-sm" />
              <span className="block w-2 h-8 bg-[#C8102E] rounded-sm" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-[0.2em] uppercase leading-none text-white">PISTONS</h1>
              <p className="text-[9px] tracking-[0.25em] text-[#666] uppercase leading-none mt-1">
                SOUNDBOARD · CYBERTRUCK EDITION
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {anyPlaying && (
              <div className="flex items-center gap-1.5 bg-[#C8102E]/20 px-3 py-1.5 rounded-full">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse" />
                <span className="text-[10px] text-[#C8102E] font-black tracking-widest">LIVE</span>
              </div>
            )}
            {sessionId ? (
              <button
                onClick={() => { setSessionId(null); setMuteLocal(false); }}
                className="flex items-center gap-1.5 bg-[#006BB6]/20 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-[#006BB6] uppercase"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006BB6] animate-pulse" />
                {muteLocal ? 'REMOTE' : sessionId}
              </button>
            ) : (
              <button
                onClick={() => setShowLive(true)}
                className="flex items-center gap-1 bg-[#1e1e1e] px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-[#888] uppercase hover:text-white transition-colors"
              >
                ⟳ LIVE
              </button>
            )}
            <button
              onClick={openSync}
              className="flex items-center gap-1 bg-[#1e1e1e] px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-[#888] uppercase hover:text-white transition-colors"
            >
              ⇄ SYNC
            </button>
          </div>
        </div>
      </header>

      <div className="flex-shrink-0 px-4 py-3 border-b border-[#1e1e1e]">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3 pb-24">
          {renderGrid()}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur border-t border-[#1e1e1e] px-4 py-3">
        <div className="flex items-center gap-3 max-w-sm mx-auto">
          <button
            onClick={() => {
              if (!muteLocal) stopAll();
              if (sessionId) broadcastEvent({ action: 'stopAll' });
            }}
            disabled={!anyPlaying}
            className={[
              'flex-1 py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all duration-150',
              anyPlaying
                ? 'bg-[#C8102E] text-white shadow-[0_4px_24px_rgba(200,16,46,0.5)] active:scale-95'
                : 'bg-[#1e1e1e] text-[#444] cursor-not-allowed',
            ].join(' ')}
          >
            ■ STOP ALL
          </button>
          <div className="w-16 text-center">
            <p className="text-[10px] text-[#555] tracking-widest uppercase font-black">
              {playingCount > 0 ? `${playingCount} ON` : 'READY'}
            </p>
          </div>
        </div>
      </div>

      {editTarget && (
        <AudioEditor
          soundId={editTarget.id}
          soundLabel={editTarget.label}
          srcUrl={editTarget.srcUrl}
          onSave={handleEditorSave}
          onClose={() => setEditTarget(null)}
        />
      )}

      {showSync && (
        <SyncModal
          syncLink={syncLink.current}
          onImport={handleImport}
          onClose={() => setShowSync(false)}
        />
      )}

      {showLive && (
        <LiveSyncModal
          onJoin={(code, mute) => { setSessionId(code); setMuteLocal(mute); }}
          onClose={() => setShowLive(false)}
        />
      )}
    </div>
  );
}
