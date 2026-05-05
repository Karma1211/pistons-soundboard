// Server-only in-memory session store for live sync SSE
type Ctrl = ReadableStreamDefaultController<Uint8Array>;

declare global {
  // eslint-disable-next-line no-var
  var _pistonsSessions: Map<string, Set<Ctrl>> | undefined;
}

const store: Map<string, Set<Ctrl>> =
  globalThis._pistonsSessions ?? (globalThis._pistonsSessions = new Map());

export function addListener(id: string, ctrl: Ctrl) {
  if (!store.has(id)) store.set(id, new Set());
  store.get(id)!.add(ctrl);
}

export function removeListener(id: string, ctrl: Ctrl) {
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
