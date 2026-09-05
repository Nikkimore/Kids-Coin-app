'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { MiniKit } from '@worldcoin/minikit-js';
import { walletAuth } from '@/auth/wallet';
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';

interface WalletVerificationProps {
  mode?: 'card' | 'compact';
  onVerified?: () => void;
}

export const WalletVerification = ({ mode = 'compact', onVerified }: WalletVerificationProps) => {
  const { data: session, status } = useSession();
  const [isPending, setIsPending] = useState(false);
  const autoPromptedRef = useRef(false);

  const handleConnect = useCallback(async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      if (!MiniKit.isInstalled()) {
        return;
      }

      await walletAuth();
      if (onVerified) onVerified();
    } catch (err: unknown) {
      console.log('World App auto-verification dismissed or deferred:', err);
    } finally {
      setIsPending(false);
    }
  }, [isPending, onVerified]);

  // AUTOMATIC POPUP INSIDE WORLD APP TO VERIFY THEY ARE HUMAN
  useEffect(() => {
    if (status === 'authenticated' || autoPromptedRef.current) return;

    let attempts = 0;
    const maxAttempts = 15;

    const timer = setInterval(() => {
      attempts++;
      if (MiniKit.isInstalled()) {
        clearInterval(timer);
        if (!autoPromptedRef.current) {
          autoPromptedRef.current = true;
          handleConnect();
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [status, handleConnect]);

  const user = session?.user;
  const isAuthenticated = status === 'authenticated' && !!user;

  // The connect wallet is NOT a link/button on the game screen!
  // If not authenticated, do not show any link or button on screen.
  if (!isAuthenticated) {
    return null;
  }

  // COMPACT HEADER MODE (Only displayed once successfully verified)
  if (mode === 'compact') {
    return (
      <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-700/80 rounded-full py-0.5 px-2 shadow-xs animate-fade-in" title="Verified Human Pilot">
        <div className="w-5 h-5 rounded-full overflow-hidden border border-emerald-500/60 shadow-[0_0_6px_rgba(16,185,129,0.5)] shrink-0">
          <Marble src={user.profilePictureUrl} className="w-full h-full" />
        </div>
        <span className="text-[10px] font-bold text-white max-w-[75px] truncate">
          {user.username ? `@${user.username}` : `${user.walletAddress?.slice(0, 4)}...${user.walletAddress?.slice(-3)}`}
        </span>
        <span className="text-[9px] font-black text-emerald-400">✓</span>
      </div>
    );
  }

  // CARD MODE
  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-2.5 flex items-center justify-between gap-2.5 shadow-inner text-left mb-3 animate-fade-in">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.5)] shrink-0">
          <Marble src={user.profilePictureUrl} className="w-full h-full" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black text-white truncate">
              {user.username ? `@${user.username}` : `${user.walletAddress?.slice(0, 6)}...${user.walletAddress?.slice(-4)}`}
            </span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full px-1.5 font-bold">
              Verified ✓
            </span>
          </div>
          <span className="text-[9px] font-semibold text-zinc-400">
            Verified Human Pilot
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signOut({ redirect: false })}
        className="text-[9px] font-bold text-zinc-500 hover:text-zinc-300 py-1 px-2 rounded-lg hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
        title="Sign out"
      >
        Change
      </button>
    </div>
  );
};
