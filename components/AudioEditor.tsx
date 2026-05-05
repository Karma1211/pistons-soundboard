'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  soundId: string;
  soundLabel: string;
  srcUrl: string;
  onSave: (id: string, label: string, startMs: number, endMs: number) => void;
  onClose: () => void;
}

export function AudioEditor({ soundId, soundLabel, srcUrl, onSave, onClose }: Props) {
  const [duration, setDuration] = useState(0);
  const [startPct, setStartPct] = useState(0);
  const [endPct, setEndPct] = useState(100);
  const [label, setLabel] = useState(soundLabel);
  const [previewing, setPreviewing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      setLoaded(true);
    };
    audio.onerror = () => setLoaded(true);
    audio.src = srcUrl;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  }, [srcUrl]);

  const startSec = (startPct / 100) * duration;
  const endSec = (endPct / 100) * duration;
  const trimmedSec = endSec - startSec;

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toFixed(1).padStart(4, '0');
    return `${m}:${sec}`;
  }

  function stopPreview() {
    audioRef.current?.pause();
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    setPreviewing(false);
  }

  function preview() {
    const audio = audioRef.current;
    if (!audio || !loaded || duration === 0) return;
    if (previewing) { stopPreview(); return; }

    audio.currentTime = startSec;
    audio.play().then(() => {
      setPreviewing(true);
      stopTimerRef.current = setTimeout(() => {
        audio.pause();
        setPreviewing(false);
      }, trimmedSec * 1000);
    }).catch(() => {});
  }

  function save() {
    stopPreview();
    onSave(soundId, label, Math.round(startSec * 1000), Math.round(endSec * 1000));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm px-4 pb-4">
      <div className="w-full max-w-sm bg-[#141414] rounded-2xl border border-[#2a2a2a] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <span className="text-xs font-black tracking-widest text-[#888] uppercase">Edit Sound</span>
          <button onClick={onClose} className="text-[#666] hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Label */}
          <div>
            <p className="text-[10px] font-black tracking-widest text-[#666] uppercase mb-2">Button Label</p>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value.toUpperCase().slice(0, 20))}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm font-black tracking-widest text-white uppercase focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          {/* Trim */}
          <div>
            <p className="text-[10px] font-black tracking-widest text-[#666] uppercase mb-3">Trim Audio</p>

            {!loaded ? (
              <div className="h-12 rounded-lg bg-[#1e1e1e] flex items-center justify-center">
                <span className="text-[11px] text-[#555]">Loading…</span>
              </div>
            ) : duration === 0 ? (
              <div className="h-12 rounded-lg bg-[#1e1e1e] flex items-center justify-center">
                <span className="text-[11px] text-[#888]">Could not load audio</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual bar */}
                <div className="relative h-8 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-black/70" style={{ width: `${startPct}%` }} />
                  <div className="absolute inset-y-0 right-0 bg-black/70" style={{ width: `${100 - endPct}%` }} />
                  <div
                    className="absolute inset-y-0 bg-[#C8102E]/30 border-x-2 border-[#C8102E]"
                    style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
                  />
                </div>

                {/* Start */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#555] mb-1">
                    <span>START</span><span className="text-[#888]">{fmt(startSec)}</span>
                  </div>
                  <input type="range" min="0" max="100" step="0.1" value={startPct}
                    onChange={(e) => setStartPct(Math.min(Number(e.target.value), endPct - 1))}
                    className="w-full accent-[#C8102E]" />
                </div>

                {/* End */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#555] mb-1">
                    <span>END</span><span className="text-[#888]">{fmt(endSec)}</span>
                  </div>
                  <input type="range" min="0" max="100" step="0.1" value={endPct}
                    onChange={(e) => setEndPct(Math.max(Number(e.target.value), startPct + 1))}
                    className="w-full accent-[#C8102E]" />
                </div>

                <p className="text-center text-[11px] text-[#888] font-mono">{fmt(trimmedSec)} selected</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={preview}
              disabled={!loaded || duration === 0}
              className={[
                'flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all disabled:opacity-40',
                previewing ? 'bg-[#006BB6] text-white' : 'bg-[#1e1e1e] text-[#888]',
              ].join(' ')}
            >
              {previewing ? '■ STOP' : '▶ PREVIEW'}
            </button>
            <button
              onClick={save}
              disabled={!loaded}
              className="flex-1 py-3 rounded-xl bg-[#C8102E] text-white text-xs font-black tracking-widest uppercase disabled:opacity-40 active:scale-95 transition-all"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
