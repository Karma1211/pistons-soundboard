'use client';

import { useRef } from 'react';

interface Props {
  onUpload: (label: string, dataUrl: string) => void;
}

export function UploadCard({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const label = file.name.replace(/\.[^.]+$/, '').toUpperCase().slice(0, 20);
      onUpload(label, dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className={[
          'relative flex flex-col items-center justify-center gap-2',
          'w-full min-h-[90px] rounded-xl border-2 border-dashed border-[#444]',
          'font-black text-[#666] uppercase tracking-wider',
          'transition-all duration-150 select-none',
          'hover:border-[#C8102E] hover:text-[#C8102E] active:scale-95',
          'bg-[#141414]',
        ].join(' ')}
      >
        <span className="text-2xl leading-none">+</span>
        <span className="text-[10px] tracking-widest">ADD SOUND</span>
      </button>
    </>
  );
}
