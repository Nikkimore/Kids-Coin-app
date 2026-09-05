'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { MiniKit } from '@worldcoin/minikit-js';
import { walletAuth } from '@/auth/wallet';
import { Marble } from '@worldcoin/mini-apps-ui-kit-react';

interface WalletVerificationProps {
  mode?: 'card' | 'compact';
  onVerified?: () => void;
}

export const WalletVerification = ({ mode = 'card', onVerified }: WalletVerificationProps) => {
  const { data: session, status } = useSession();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsInstalled(MiniKit.isInstalled());
  }, []);

  const handleConnect = async () => {
    if (isPending) return;
    setErrorMessage(null);
    setIsPending(true);

    try {
      if (!MiniKit.isInstalled()) {
        // Outside World App (e.g. testing in browser preview)
        setErrorMessage('Open inside World App to complete World ID verification.');
        setIsPending(false);
        return;
      }

      await walletAuth();
      if (onVerified) onVerified();
    } catch (err: unknown) {
      console.error('Wallet verification failed:', err);
      const msg = err instanceof Error ? err.message : 'Verification canceled.';
      setErrorMessage(msg);
    } finally {
      setIsPending(false);
    }
  };

  const user = session?.user;
  const isAuthenticated = status === 'authenticated' && !!user;

  // COMPACT HEADER MODE
  if (mode === 'compact') {
    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 rounded-full py-1 px-2.5 shadow-sm">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-white max-w-[85px] truncate">
              {user.username ? `@${user.username}` : `${user.walletAddress?.slice(0, 6)}...${user.walletAddress?.slice(-4)}`}
            </span>
            <span className="text-[9px] font-semibold text-emerald-400 leading-none">
              Verified ✓
            </span>
          </div>
          <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
            <Marble src={user.profilePictureUrl} className="w-full h-full" />
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleConnect}
        disabled={isPending}
        className="px-3 py-1.5 text-xs font-black rounded-xl border border-rose-500/50 bg-gradient-to-r from-rose-950/80 to-pink-950/80 hover:from-rose-900/80 hover:to-pink-900/80 text-rose-200 whitespace-nowrap transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)] active:scale-95 cursor-pointer flex items-center gap-1.5"
      >
        <span className="text-xs">🌐</span>
        <span>{isPending ? 'Verifying...' : isInstalled ? 'Verify Wallet' : 'Connect Wallet'}</span>
      </button>
    );
  }

  // CARD MODE (Start Screen / Welcome / Game Over)
  if (isAuthenticated) {
    return (
      <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-inner text-left mb-3 animate-fade-in">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-[0_0_14px_rgba(16,185,129,0.5)] shrink-0">
            <Marble src={user.profilePictureUrl} className="w-full h-full" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">
                {user.username ? `@${user.username}` : `${user.walletAddress?.slice(0, 6)}...${user.walletAddress?.slice(-4)}`}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full px-1.5 py-0.2 font-black">
                Verified
              </span>
            </div>
            <span className="text-[10px] font-semibold text-zinc-400">
              World ID Pilot • High Scores Synced
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ redirect: false })}
          className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 py-1 px-2 rounded-lg hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
          title="Sign out of wallet"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 flex flex-col items-center gap-2 text-center mb-3 shadow-inner animate-fade-in">
      <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-extrabold">
        <span className="text-sm">🛡️</span>
        <span>World ID Wallet Verification</span>
      </div>

      <button
        type="button"
        onClick={handleConnect}
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-zinc-800 via-zinc-850 to-zinc-800 hover:from-zinc-700 hover:to-zinc-750 border border-zinc-600/80 hover:border-rose-500/60 text-white font-black text-xs rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.6)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span className="text-sm">🌐</span>
        <span>{isPending ? 'Verifying with World App...' : 'Sign In with World ID'}</span>
      </button>

      {errorMessage && (
        <div className="text-[10px] text-rose-400 font-semibold leading-tight px-1">
          {errorMessage}
        </div>
      )}

      <div className="text-[9.5px] font-medium text-zinc-500 flex items-center justify-center gap-2">
        <span>✓ 100 Free Kiss Coins</span>
        <span>•</span>
        <span>✓ World Chain High Scores</span>
      </div>
    </div>
  );
};
