'use client';

import { useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface AudioState {
  [id: string]: 'idle' | 'loading' | 'playing' | 'error';
}

export interface PlayOptions {
  startMs?: number;
  endMs?: number;
  playAfterMs?: number;
}

export function useAudio() {
  const howls = useRef<{ [id: string]: Howl }>({});
  const timers = useRef<{ [id: string]: ReturnType<typeof setTimeout> }>({});
  const preloaded = useRef<{ [src: string]: Howl }>({});
  const [states, setStates] = useState<AudioState>({});

  const setState = useCallback((id: string, state: AudioState[string]) => {
    setStates((prev) => ({ ...prev, [id]: state }));
  }, []);

  const play = useCallback(
    (id: string, file: string, opts?: PlayOptions) => {
      if (timers.current[id]) {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
      }
      if (howls.current[id]) {
        howls.current[id].stop();
        howls.current[id].unload();
        delete howls.current[id];
      }

      setState(id, 'loading');

      const src = file.startsWith('blob:') || file.startsWith('data:') ? file : `/sounds/${file}`;
      const hasSprite = opts?.startMs !== undefined && opts?.endMs !== undefined;
      const spriteDuration = hasSprite ? opts!.endMs! - opts!.startMs! : undefined;

      // Create Howl immediately so it starts buffering during the delay window
      const howl = new Howl({
        src: [src],
        html5: true,
        ...(hasSprite ? { sprite: { clip: [opts!.startMs!, spriteDuration!] } } : {}),
        onplay: () => setState(id, 'playing'),
        onend: () => setState(id, 'idle'),
        onstop: () => setState(id, 'idle'),
        onloaderror: () => setState(id, 'error'),
        onplayerror: () => setState(id, 'error'),
      });
      howls.current[id] = howl;

      const startPlay = () => {
        delete timers.current[id];
        hasSprite ? howl.play('clip') : howl.play();
      };

      if (opts?.playAfterMs && opts.playAfterMs > 0) {
        // Delay actual play() so both devices fire at the same wall-clock time.
        // Howl is already buffering above, so the file should be ready by then.
        timers.current[id] = setTimeout(startPlay, opts.playAfterMs);
      } else {
        // Call play() synchronously while still in the user-gesture stack.
        // HTML5 audio queues it until the file is ready — iOS won't block it.
        startPlay();
      }
    },
    [setState]
  );

  const stop = useCallback(
    (id: string) => {
      if (timers.current[id]) {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
      }
      if (howls.current[id]) howls.current[id].stop();
      setState(id, 'idle');
    },
    [setState]
  );

  const stopAll = useCallback(() => {
    Object.keys(timers.current).forEach((id) => {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    });
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

  const preload = useCallback((files: string[]) => {
    files.forEach((file) => {
      const src = file.startsWith('blob:') || file.startsWith('data:') ? file : `/sounds/${file}`;
      if (preloaded.current[src]) return;
      const h = new Howl({ src: [src], html5: true, preload: true });
      preloaded.current[src] = h;
    });
  }, []);

  return { states, play, stop, stopAll, toggle, preload };
}
