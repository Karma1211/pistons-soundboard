// Server-only: stores recent events per session for polling clients.
// Events expire after 5 seconds — clients only need recent events.

interface StoredEvent {
  data: string;
  ts: number;
}

const sessions = new Map<string, StoredEvent[]>();

export function storeEvent(id: string, data: string) {
  const now = Date.now();
  const events = (sessions.get(id) ?? []).filter((e) => now - e.ts < 5000);
  events.push({ data, ts: now });
  sessions.set(id, events);
}

export function getEventsSince(id: string, since: number): StoredEvent[] {
  return (sessions.get(id) ?? []).filter((e) => e.ts > since);
}
