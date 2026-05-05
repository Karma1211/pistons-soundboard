// Server-only: in-memory pub/sub for live sync SSE connections

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store = new Map<string, Set<any>>();

export function addListener(id: string, ctrl: ReadableStreamDefaultController<Uint8Array>) {
  if (!store.has(id)) store.set(id, new Set());
  store.get(id)!.add(ctrl);
}

export function removeListener(id: string, ctrl: ReadableStreamDefaultController<Uint8Array>) {
  const set = store.get(id);
  if (!set) return;
  set.delete(ctrl);
  if (set.size === 0) store.delete(id);
}

export function broadcast(id: string, data: string) {
  const msg = new TextEncoder().encode(`data: ${data}\n\n`);
  store.get(id)?.forEach((ctrl) => {
    try { ctrl.enqueue(msg); } catch { /* client disconnected */ }
  });
}
