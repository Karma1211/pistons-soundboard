'use client';

import { useEffect, useRef, useCallback } from 'react';

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

const CLIENT_ID = Math.random().toString(36).slice(2, 10);

export function useLiveSync(
  sessionId: string | null,
  onRemoteEvent: (e: LiveEvent) => void
) {
  const esRef = useRef<EventSource | null>(null);
  const onRemoteRef = useRef(onRemoteEvent);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelay = useRef(1000);
  const sessionRef = useRef(sessionId);
  onRemoteRef.current = onRemoteEvent;
  sessionRef.current = sessionId;

  const connect = useCallback(() => {
    const sid = sessionRef.current;
    if (!sid) return;

    // Clean up any existing connection
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const es = new EventSource(`/api/session/${sid}/events`);

    es.onmessage = (e) => {
      retryDelay.current = 1000; // reset backoff on successful message
      try {
        const parsed: LiveEvent = JSON.parse(e.data);
        if (parsed._clientId === CLIENT_ID) return;
        onRemoteRef.current(parsed);
      } catch { /* ignore */ }
    };

    es.onopen = () => {
      retryDelay.current = 1000;
    };

    es.onerror = () => {
      es.close();
      esRef.current = null;
      if (!sessionRef.current) return;
      // Reconnect with exponential backoff, capped at 8s
      const delay = retryDelay.current;
      retryDelay.current = Math.min(retryDelay.current * 2, 8000);
      retryTimer.current = setTimeout(connect, delay);
    };

    esRef.current = es;
  }, []);

  useEffect(() => {
    if (!sessionId) {
      esRef.current?.close();
      esRef.current = null;
      if (retryTimer.current) clearTimeout(retryTimer.current);
      retryDelay.current = 1000;
      return;
    }

    connect();

    // Reconnect when phone comes back to foreground (iOS Safari kills background SSE)
    const onVisible = () => {
      if (document.visibilityState === 'visible' && sessionRef.current) {
        if (retryTimer.current) clearTimeout(retryTimer.current);
        connect();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      esRef.current?.close();
      esRef.current = null;
      if (retryTimer.current) clearTimeout(retryTimer.current);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [sessionId, connect]);

  const broadcastEvent = useCallback(async (event: LiveEvent) => {
    if (!sessionRef.current) return;
    try {
      const payload = event.action === 'play'
        ? { ...event, _clientId: CLIENT_ID, playAt: Date.now() + SYNC_DELAY_MS }
        : { ...event, _clientId: CLIENT_ID };
      await fetch(`/api/session/${sessionRef.current}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch { /* ignore — best-effort */ }
  }, []);

  return { broadcastEvent };
}
