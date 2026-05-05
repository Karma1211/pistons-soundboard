export interface SoundOverride {
  label?: string;
  startMs?: number;
  endMs?: number;
}

export interface CustomSound {
  id: string;
  label: string;
  dataUrl: string;
  startMs?: number;
  endMs?: number;
}
