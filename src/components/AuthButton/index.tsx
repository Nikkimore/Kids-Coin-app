'use client';
import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { walletAuth } from '@/auth/wallet';

export const AuthButton = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsInstalled(MiniKit.isInstalled());
  }, []);

  const onClick = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }
    if (isPending) return;
    setIsPending(true);
    try {
      await walletAuth();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-black rounded-xl border border-zinc-700/80 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white whitespace-nowrap transition-all shadow-[0_2px_10px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer flex items-center gap-1.5"
    >
      <span className="text-xs">🌐</span>
      <span>{isPending ? 'Connecting...' : isInstalled ? 'Connect Wallet' : 'Guest Pilot 🎈'}</span>
    </button>
  );
};
