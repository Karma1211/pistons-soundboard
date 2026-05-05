'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface LiveEvent {
  action: 'play' | 'stop' | 'stopAll';
  soundId?: string;
  file?: string;
  startMs?: number;
  endMs?: number;
}

export function useLiveSync(
  sessionId: string | null,
  onRemoteEvent: (e: LiveEvent) => void
) {
  const esRef = useRef<EventSource | null>(null);
  const onRemoteRef = useRef(onRemoteEvent);
  onRemoteRef.current = onRemoteEvent;

  useEffect(() => {
    if (!sessionId) {
      esRef.current?.close();
      esRef.current = null;
      return;
    }

    const es = new EventSource(`/api/session/${sessionId}/events`);
    es.onmessage = (e) => {
      try { onRemoteRef.current(JSON.parse(e.data)); } catch { /* ignore */ }
    };
    esRef.current = es;
    return () => es.close();
  }, [sessionId]);

  const broadcastEvent = useCallback(async (event: LiveEvent) => {
    if (!sessionId) return;
    try {
      await fetch(`/api/session/${sessionId}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch { /* ignore — best-effort */ }
  }, [sessionId]);

  return { broadcastEvent };
}
