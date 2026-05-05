'use client';

import { useState } from 'react';

interface Props {
  onJoin: (code: string) => void;
  onClose: () => void;
}

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function LiveSyncModal({ onJoin, onClose }: Props) {
  const [generated, setGenerated] = useState('');
  const [joinVal, setJoinVal] = useState('');
  const [err, setErr] = useState(false);

  function host() {
    const code = randomCode();
    setGenerated(code);
    onJoin(code);
  }

  function join() {
    const code = joinVal.trim().toUpperCase();
    if (code.length < 4) { setErr(true); return; }
    onJoin(code);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm px-4 pb-4">
      <div className="w-full max-w-sm bg-[#141414] rounded-2xl border border-[#2a2a2a] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <span className="text-xs font-black tracking-widest text-[#888] uppercase">Live Sync</span>
          <button onClick={onClose} className="text-[#666] hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Host */}
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-widest text-[#666] uppercase">Start a session</p>
            <p className="text-[11px] text-[#555] leading-relaxed">
              Generate a code on this device, then join with the same code on your other device. Sounds you play will fire on both simultaneously.
            </p>
            {generated ? (
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-4 text-center">
                <p className="text-[10px] text-[#555] tracking-widest uppercase mb-1">Session Code</p>
                <p className="text-3xl font-black tracking-[0.3em] text-white">{generated}</p>
                <p className="text-[10px] text-[#444] mt-2">Enter this code on your other device</p>
              </div>
            ) : (
              <button
                onClick={host}
                className="w-full py-3 rounded-xl bg-[#C8102E] text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
              >
                GENERATE CODE
              </button>
            )}
            {generated && (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#006BB6] text-white text-xs font-black tracking-widest uppercase active:scale-95 transition-all"
              >
                DONE — SESSION ACTIVE
              </button>
            )}
          </div>

          <div className="border-t border-[#2a2a2a]" />

          {/* Join */}
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-widest text-[#666] uppercase">Join a session</p>
            <p className="text-[11px] text-[#555]">Enter the code from your other device.</p>
            <input
              value={joinVal}
              onChange={(e) => { setJoinVal(e.target.value.toUpperCase()); setErr(false); }}
              placeholder="e.g. ABC123"
              maxLength={8}
              className={[
                'w-full bg-[#0a0a0a] border rounded-lg px-3 py-2.5 text-[14px] text-white font-mono tracking-widest text-center uppercase focus:outline-none',
                err ? 'border-[#C8102E]' : 'border-[#2a2a2a] focus:border-[#006BB6]',
              ].join(' ')}
            />
            {err && <p className="text-[10px] text-[#C8102E]">Enter at least 4 characters.</p>}
            <button
              onClick={join}
              disabled={!joinVal.trim()}
              className="w-full py-3 rounded-xl bg-[#1e1e1e] text-white text-xs font-black tracking-widest uppercase disabled:opacity-40 active:scale-95 transition-all"
            >
              JOIN SESSION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
