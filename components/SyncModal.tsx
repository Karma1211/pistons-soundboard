'use client';

import { useState, useRef } from 'react';

interface Props {
  syncLink: string;
  onImport: (encoded: string) => void;
  onClose: () => void;
}

export function SyncModal({ syncLink, onImport, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [pasteVal, setPasteVal] = useState('');
  const [importErr, setImportErr] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(syncLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      inputRef.current?.select();
    }
  }

  function handleImport() {
    setImportErr(false);
    try {
      const url = new URL(pasteVal.trim());
      const s = url.searchParams.get('s');
      if (s) { onImport(s); onClose(); return; }
    } catch {}
    // Maybe they pasted just the code
    const raw = pasteVal.trim();
    if (raw.length > 10) {
      onImport(raw);
      onClose();
      return;
    }
    setImportErr(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm px-4 pb-4">
      <div className="w-full max-w-sm bg-[#141414] rounded-2xl border border-[#2a2a2a] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <span className="text-xs font-black tracking-widest text-[#888] uppercase">Sync Devices</span>
          <button onClick={onClose} className="text-[#666] hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Export */}
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-widest text-[#666] uppercase">Share to another device</p>
            <p className="text-[11px] text-[#555] leading-relaxed">
              Copy this link and open it on your other device. Your favorites and trim settings will load instantly.
            </p>
            <input
              ref={inputRef}
              readOnly
              value={syncLink}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[10px] text-[#666] font-mono break-all focus:outline-none"
            />
            <button
              onClick={copyLink}
              className={[
                'w-full py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all',
                copied
                  ? 'bg-green-700 text-white'
                  : 'bg-[#C8102E] text-white active:scale-95',
              ].join(' ')}
            >
              {copied ? '✓ COPIED!' : 'COPY LINK'}
            </button>
          </div>

          <div className="border-t border-[#2a2a2a]" />

          {/* Import */}
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-widest text-[#666] uppercase">Import from another device</p>
            <p className="text-[11px] text-[#555]">Paste the sync link from your other device below.</p>
            <input
              value={pasteVal}
              onChange={(e) => { setPasteVal(e.target.value); setImportErr(false); }}
              placeholder="Paste link here..."
              className={[
                'w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-[11px] text-white font-mono focus:outline-none',
                importErr ? 'border-[#C8102E]' : 'border-[#2a2a2a] focus:border-[#006BB6]',
              ].join(' ')}
            />
            {importErr && (
              <p className="text-[10px] text-[#C8102E]">Invalid link — copy the full URL from your other device.</p>
            )}
            <button
              onClick={handleImport}
              disabled={!pasteVal.trim()}
              className="w-full py-3 rounded-xl bg-[#006BB6] text-white text-xs font-black tracking-widest uppercase disabled:opacity-40 active:scale-95 transition-all"
            >
              IMPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
