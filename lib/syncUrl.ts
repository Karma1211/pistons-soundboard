import type { SoundOverride } from './types';

interface SyncPayload {
  v: 1;
  f: string[];
  o: Record<string, { l?: string; s?: number; e?: number }>;
}

export function encodeSync(favorites: string[], overrides: Record<string, SoundOverride>): string {
  const payload: SyncPayload = {
    v: 1,
    f: favorites,
    o: Object.fromEntries(
      Object.entries(overrides).map(([id, ov]) => [
        id,
        {
          ...(ov.label ? { l: ov.label } : {}),
          ...(ov.startMs !== undefined ? { s: ov.startMs } : {}),
          ...(ov.endMs !== undefined ? { e: ov.endMs } : {}),
        },
      ])
    ),
  };
  return btoa(JSON.stringify(payload));
}

export function decodeSync(encoded: string): { favorites: string[]; overrides: Record<string, SoundOverride> } | null {
  try {
    const payload = JSON.parse(atob(encoded)) as SyncPayload;
    if (payload.v !== 1) return null;
    return {
      favorites: payload.f ?? [],
      overrides: Object.fromEntries(
        Object.entries(payload.o ?? {}).map(([id, v]) => [
          id,
          { label: v.l, startMs: v.s, endMs: v.e },
        ])
      ),
    };
  } catch {
    return null;
  }
}
