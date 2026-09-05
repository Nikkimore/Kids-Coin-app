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
      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
    >
      {isPending ? 'Connecting...' : isInstalled ? 'Connect Wallet' : 'Guest Pilot 🎈'}
    </button>
  );
};
