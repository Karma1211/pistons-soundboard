'use client';

import { useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface AudioState {
  [id: string]: 'idle' | 'loading' | 'playing' | 'error';
}

export interface PlayOptions {
  startMs?: number;
  endMs?: number;
}

export function useAudio() {
  const howls = useRef<{ [id: string]: Howl }>({});
  const [states, setStates] = useState<AudioState>({});

  const setState = useCallback((id: string, state: AudioState[string]) => {
    setStates((prev) => ({ ...prev, [id]: state }));
  }, []);

  const play = useCallback(
    (id: string, file: string, opts?: PlayOptions) => {
      if (howls.current[id]) {
        howls.current[id].stop();
        howls.current[id].unload();
        delete howls.current[id];
      }

      setState(id, 'loading');

      const src = file.startsWith('blob:') || file.startsWith('data:') ? file : `/sounds/${file}`;
      const hasSprite = opts?.startMs !== undefined && opts?.endMs !== undefined;
      const spriteDuration = hasSprite ? opts!.endMs! - opts!.startMs! : undefined;

      const howl = new Howl({
        src: [src],
        html5: true,
        ...(hasSprite ? { sprite: { clip: [opts!.startMs!, spriteDuration!] } } : {}),
        onload: () => {
          hasSprite ? howl.play('clip') : howl.play();
          setState(id, 'playing');
        },
        onend: () => setState(id, 'idle'),
        onstop: () => setState(id, 'idle'),
        onloaderror: () => setState(id, 'error'),
        onplayerror: () => setState(id, 'error'),
      });

      howls.current[id] = howl;
    },
    [setState]
  );

  const stop = useCallback(
    (id: string) => {
      if (howls.current[id]) howls.current[id].stop();
      setState(id, 'idle');
    },
    [setState]
  );

  const stopAll = useCallback(() => {
    Object.values(howls.current).forEach((h) => h.stop());
    setStates({});
  }, []);

  const toggle = useCallback(
    (id: string, file: string, opts?: PlayOptions) => {
      if (states[id] === 'playing') stop(id);
      else play(id, file, opts);
    },
    [states, play, stop]
  );

  return { states, play, stop, stopAll, toggle };
}
