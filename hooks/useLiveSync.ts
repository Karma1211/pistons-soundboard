'use client';

import { useEffect, useRef, useCallback } from 'react';

// How far ahead to schedule playback. Must be > max poll interval + network RTT.
// Poll is every 300ms, RTT ~100ms, so 700ms gives comfortable margin.
export const SYNC_DELAY_MS = 700;

export interface LiveEvent {
  action: 'play' | 'stop' | 'stopAll';
  soundId?: string;
  file?: string;
  startMs?: number;
  endMs?: number;
  playAt?: number;
  _clientId?: string;
}

// Stable per-tab ID so each device ignores its own events
const CLIENT_ID = Math.random().toString(36).slice(2, 10);

export function useLiveSync(
  sessionId: string | null,
  onRemoteEvent: (e: LiveEvent) => void
) {
  const onRemoteRef = useRef(onRemoteEvent);
  const lastSeenRef = useRef(Date.now());
  const sessionRef = useRef(sessionId);
  onRemoteRef.current = onRemoteEvent;
  sessionRef.current = sessionId;

  useEffect(() => {
    if (!sessionId) return;

    // Only care about events that happen from this moment forward
    lastSeenRef.current = Date.now();

    const poll = async () => {
      const sid = sessionRef.current;
      if (!sid) return;
      try {
        const res = await fetch(
          `/api/session/${sid}/poll?since=${lastSeenRef.current}`,
          { cache: 'no-store' }
        );
        if (!res.ok) return;
        const events: { data: string; ts: number }[] = await res.json();
        for (const { data, ts } of events) {
          // Advance the cursor so we don't re-process old events
          if (ts > lastSeenRef.current) lastSeenRef.current = ts;
          try {
            const parsed: LiveEvent = JSON.parse(data);
            if (parsed._clientId === CLIENT_ID) continue;
            onRemoteRef.current(parsed);
          } catch { /* ignore malformed */ }
        }
      } catch { /* ignore network errors — next poll will retry */ }
    };

    const interval = setInterval(poll, 300);
    return () => clearInterval(interval);
  }, [sessionId]);

  const broadcastEvent = useCallback(async (event: LiveEvent) => {
    const sid = sessionRef.current;
    if (!sid) return;
    try {
      const payload = event.action === 'play'
        ? { ...event, _clientId: CLIENT_ID, playAt: Date.now() + SYNC_DELAY_MS }
        : { ...event, _clientId: CLIENT_ID };
      await fetch(`/api/session/${sid}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch { /* ignore */ }
  }, []);

  return { broadcastEvent };
}
