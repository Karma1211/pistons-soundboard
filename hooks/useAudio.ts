'use client';

import { useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface AudioState {
  [id: string]: 'idle' | 'loading' | 'playing' | 'error';
}

export function useAudio() {
  const howls = useRef<{ [id: string]: Howl }>({});
  const [states, setStates] = useState<AudioState>({});

  const setState = useCallback((id: string, state: AudioState[string]) => {
    setStates((prev) => ({ ...prev, [id]: state }));
  }, []);

  const play = useCallback(
    (id: string, file: string) => {
      // Stop currently playing instance of this sound
      if (howls.current[id]) {
        howls.current[id].stop();
        howls.current[id].unload();
        delete howls.current[id];
      }

      setState(id, 'loading');

      const howl = new Howl({
        src: [`/sounds/${file}`],
        html5: true,
        onload: () => {
          howl.play();
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
      if (howls.current[id]) {
        howls.current[id].stop();
      }
      setState(id, 'idle');
    },
    [setState]
  );

  const stopAll = useCallback(() => {
    Object.values(howls.current).forEach((h) => h.stop());
    setStates({});
  }, []);

  const toggle = useCallback(
    (id: string, file: string) => {
      if (states[id] === 'playing') {
        stop(id);
      } else {
        play(id, file);
      }
    },
    [states, play, stop]
  );

  return { states, play, stop, stopAll, toggle };
}
