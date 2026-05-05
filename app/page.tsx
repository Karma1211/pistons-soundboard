'use client';

import { useState } from 'react';
import { SOUNDS, CATEGORIES, Category } from '@/lib/sounds';
import { SoundButton } from '@/components/SoundButton';
import { CategoryTabs } from '@/components/CategoryTabs';
import { useAudio } from '@/hooks/useAudio';

export default function SoundboardPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('hype');
  const { states, toggle, stopAll } = useAudio();

  const filtered = SOUNDS.filter((s) => s.category === activeCategory);
  const anyPlaying = Object.values(states).some((s) => s === 'playing' || s === 'loading');
  const playingCount = Object.values(states).filter((s) => s === 'playing').length;

  return (
    <div className="flex flex-col h-dvh bg-[#0a0a0a] overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 pt-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2.5">
            {/* Color bars — Pistons stripe */}
            <div className="flex gap-0.5 items-end">
              <span className="block w-2 h-8 bg-[#C8102E] rounded-sm" />
              <span className="block w-2 h-6 bg-[#006BB6] rounded-sm" />
              <span className="block w-2 h-8 bg-[#C8102E] rounded-sm" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-[0.2em] uppercase leading-none text-white">
                PISTONS
              </h1>
              <p className="text-[9px] tracking-[0.25em] text-[#666] uppercase leading-none mt-1">
                SOUNDBOARD · CYBERTRUCK EDITION
              </p>
            </div>
          </div>

          {anyPlaying && (
            <div className="flex items-center gap-1.5 bg-[#C8102E]/20 px-3 py-1.5 rounded-full">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse" />
              <span className="text-[10px] text-[#C8102E] font-black tracking-widest">LIVE</span>
            </div>
          )}
        </div>
      </header>

      {/* Category tabs */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[#1e1e1e]">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Sound grid */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3 pb-24">
          {filtered.map((sound) => (
            <SoundButton
              key={sound.id}
              sound={sound}
              state={states[sound.id] ?? 'idle'}
              onPress={() => toggle(sound.id, sound.file)}
            />
          ))}
        </div>
      </main>

      {/* Fixed bottom STOP bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur border-t border-[#1e1e1e] px-4 py-3">
        <div className="flex items-center gap-3 max-w-sm mx-auto">
          <button
            onClick={stopAll}
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
    </div>
  );
}
