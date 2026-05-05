'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface LiveEvent {
  action: 'play' | 'stop' | 'stopAll';
  soundId?: string;
  file?: string;
  startMs?: number;
  endMs?: number;
  _clientId?: string;
}

// Stable per-tab ID so each device can ignore its own echoed events
const CLIENT_ID = Math.random().toString(36).slice(2, 10);

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
      try {
        const parsed: LiveEvent = JSON.parse(e.data);
        // Skip events we sent ourselves
        if (parsed._clientId === CLIENT_ID) return;
        onRemoteRef.current(parsed);
      } catch { /* ignore */ }
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
        body: JSON.stringify({ ...event, _clientId: CLIENT_ID }),
      });
    } catch { /* ignore — best-effort */ }
  }, [sessionId]);

  return { broadcastEvent };
}
