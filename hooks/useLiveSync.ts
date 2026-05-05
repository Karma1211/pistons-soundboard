'use client';

import { useEffect, useRef, useCallback } from 'react';

// Both devices schedule playback this many ms in the future.
// Gives enough time for SSE delivery + buffering before the fire moment.
export const SYNC_DELAY_MS = 400;

export interface LiveEvent {
  action: 'play' | 'stop' | 'stopAll';
  soundId?: string;
  file?: string;
  startMs?: number;
  endMs?: number;
  playAt?: number;
  _clientId?: string;
}

// Stable per-tab ID so each device ignores its own echoed SSE events
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
      // Stamp play events with a future timestamp so the receiver can
      // calculate exactly how long to wait before firing.
      const payload = event.action === 'play'
        ? { ...event, _clientId: CLIENT_ID, playAt: Date.now() + SYNC_DELAY_MS }
        : { ...event, _clientId: CLIENT_ID };
      await fetch(`/api/session/${sessionId}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch { /* ignore — best-effort */ }
  }, [sessionId]);

  return { broadcastEvent };
}
