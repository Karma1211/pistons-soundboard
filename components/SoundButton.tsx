'use client';

import { Sound } from '@/lib/sounds';

interface Props {
  sound: Sound;
  state: 'idle' | 'loading' | 'playing' | 'error';
  onPress: () => void;
}

const COLOR_MAP = {
  red: {
    base: 'bg-[#C8102E] hover:bg-[#e01535] active:bg-[#a00d24] border-[#C8102E]',
    playing: 'playing-red bg-[#e01535]',
    shadow: 'shadow-[0_4px_20px_rgba(200,16,46,0.4)]',
    loading: 'bg-[#8a0b1f]',
  },
  blue: {
    base: 'bg-[#006BB6] hover:bg-[#0080d8] active:bg-[#005691] border-[#006BB6]',
    playing: 'playing-blue bg-[#0080d8]',
    shadow: 'shadow-[0_4px_20px_rgba(0,107,182,0.4)]',
    loading: 'bg-[#004a7f]',
  },
  gold: {
    base: 'bg-[#BFA054] hover:bg-[#d4b265] active:bg-[#9e8540] border-[#BFA054]',
    playing: 'playing-red bg-[#d4b265]',
    shadow: 'shadow-[0_4px_20px_rgba(191,160,84,0.4)]',
    loading: 'bg-[#8a7038]',
  },
};

export function SoundButton({ sound, state, onPress }: Props) {
  const colors = COLOR_MAP[sound.color];
  const isPlaying = state === 'playing';
  const isLoading = state === 'loading';
  const isError = state === 'error';

  return (
    <button
      onClick={onPress}
      disabled={isLoading}
      className={[
        'relative flex flex-col items-center justify-center gap-1',
        'w-full min-h-[90px] rounded-xl border-2 border-transparent',
        'font-black text-white uppercase tracking-wider',
        'transition-all duration-150 select-none',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        isPlaying
          ? `${colors.playing} ${colors.shadow} scale-[0.97]`
          : isLoading
          ? colors.loading
          : isError
          ? 'bg-[#333] border-red-500'
          : colors.base,
        isPlaying ? colors.shadow : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Playing indicator */}
      {isPlaying && (
        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <span className="absolute top-2 right-2">
          <svg className="animate-spin h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </span>
      )}

      <span className="text-[11px] leading-tight font-black tracking-widest text-center px-2">
        {isError ? '⚠ FILE MISSING' : sound.label}
      </span>

      {sound.subtitle && !isError && (
        <span className="text-[9px] font-normal opacity-70 tracking-wide">{sound.subtitle}</span>
      )}

      {/* Stop icon overlay when playing */}
      {isPlaying && (
        <span className="text-[9px] opacity-80 tracking-widest mt-0.5">■ TAP TO STOP</span>
      )}
    </button>
  );
}
