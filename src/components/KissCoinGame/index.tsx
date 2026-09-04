'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { MAX_MESSAGE_LENGTH } from '@/lib/sanitize';
import type { ChampionRecord } from '@/lib/leaderboard';

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 480;
const CATCHER_WIDTH = 72;
const CATCHER_HEIGHT = 16;
const CATCHER_Y = CANVAS_HEIGHT - 40;
const HEART_SIZE = 28;
const HEARTS_PER_COIN = 3;
const SPAWN_INTERVAL_MS = 700;
const LEADERBOARD_POLL_MS = 5000;

type Heart = {
  id: number;
  x: number;
  y: number;
  speed: number;
};

type ClaimStatus = 'idle' | 'saving' | 'error';

function balanceKey(walletAddress?: string) {
  return `kiss-coin-balance:${walletAddress ?? 'guest'}`;
}

export function KissCoinGame({ walletAddress }: { walletAddress?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const catcherXRef = useRef(CANVAS_WIDTH / 2);
  const heartsRef = useRef<Heart[]>([]);
  const nextHeartIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const animationRef = useRef(0);
  const heartsCaughtThisRunRef = useRef(0);
  const claimOfferedForRunRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [heartsCaught, setHeartsCaught] = useState(0);
  const [balance, setBalance] = useState(0);

  const [champion, setChampion] = useState<ChampionRecord | null>(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>('idle');
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(balanceKey(walletAddress)) ?? 0);
    setBalance(Number.isFinite(stored) ? stored : 0);
  }, [walletAddress]);

  useEffect(() => {
    let cancelled = false;
    const fetchChampion = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) return;
        const data = (await res.json()) as { champion: ChampionRecord | null };
        if (!cancelled) setChampion(data.champion);
      } catch {
        // Leaderboard is best-effort; ignore transient network errors.
      }
    };
    fetchChampion();
    const interval = setInterval(fetchChampion, LEADERBOARD_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Offer the claim form once per run, right when a run beating the current
  // champion's score ends (i.e. the player pauses).
  useEffect(() => {
    if (isPlaying) {
      claimOfferedForRunRef.current = false;
      return;
    }
    if (
      !claimOfferedForRunRef.current &&
      heartsCaughtThisRunRef.current > 0 &&
      heartsCaughtThisRunRef.current > (champion?.heartsCaught ?? 0)
    ) {
      claimOfferedForRunRef.current = true;
      setClaimOpen(true);
    }
  }, [isPlaying, champion]);

  const addCoins = useCallback(
    (amount: number) => {
      setBalance((prev) => {
        const next = prev + amount;
        localStorage.setItem(balanceKey(walletAddress), String(next));
        return next;
      });
    },
    [walletAddress],
  );

  const updateCatcherFromClientX = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS_WIDTH / rect.width;
    const x = (clientX - rect.left) * scale;
    catcherXRef.current = Math.min(
      Math.max(x, CATCHER_WIDTH / 2),
      CANVAS_WIDTH - CATCHER_WIDTH / 2,
    );
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    lastSpawnRef.current = performance.now();

    const tick = (time: number) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#fff0f5';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (time - lastSpawnRef.current > SPAWN_INTERVAL_MS) {
        lastSpawnRef.current = time;
        heartsRef.current.push({
          id: nextHeartIdRef.current++,
          x: Math.random() * (CANVAS_WIDTH - HEART_SIZE) + HEART_SIZE / 2,
          y: -HEART_SIZE,
          speed: 1.5 + Math.random() * 2,
        });
      }

      const remaining: Heart[] = [];
      for (const heart of heartsRef.current) {
        const y = heart.y + heart.speed;
        const withinCatcherBand = y >= CATCHER_Y - HEART_SIZE / 2 && y <= CATCHER_Y + CATCHER_HEIGHT;
        const withinCatcherReach =
          Math.abs(heart.x - catcherXRef.current) < CATCHER_WIDTH / 2 + HEART_SIZE / 3;

        if (withinCatcherBand && withinCatcherReach) {
          heartsCaughtThisRunRef.current += 1;
          setHeartsCaught(heartsCaughtThisRunRef.current);
          if (heartsCaughtThisRunRef.current % HEARTS_PER_COIN === 0) {
            addCoins(1);
          }
          continue;
        }

        if (y > CANVAS_HEIGHT + HEART_SIZE) continue;

        ctx.font = `${HEART_SIZE}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💗', heart.x, y);
        remaining.push({ ...heart, y });
      }
      heartsRef.current = remaining;

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.roundRect(
        catcherXRef.current - CATCHER_WIDTH / 2,
        CATCHER_Y,
        CATCHER_WIDTH,
        CATCHER_HEIGHT,
        8,
      );
      ctx.fill();

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, addCoins]);

  const startGame = () => {
    heartsRef.current = [];
    heartsCaughtThisRunRef.current = 0;
    setHeartsCaught(0);
    setIsPlaying(true);
  };

  const stopGame = () => setIsPlaying(false);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimStatus('saving');
    setClaimError(null);
    try {
      const res = await fetch('/api/leaderboard/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heartsCaught: heartsCaughtThisRunRef.current,
          message: messageInput,
        }),
      });
      const data = (await res.json()) as {
        champion?: ChampionRecord;
        error?: string;
      };
      if (data.champion) setChampion(data.champion);
      if (!res.ok) throw new Error(data.error ?? 'Could not post your message.');
      setClaimOpen(false);
      setMessageInput('');
      setClaimStatus('idle');
    } catch (err) {
      setClaimStatus('error');
      setClaimError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between px-1 text-sm font-medium text-gray-600">
        <span>Hearts: {heartsCaught}</span>
        <span>🏆 Best: {champion?.heartsCaught ?? 0}</span>
        <span>🪙 {balance} Kiss Coins</span>
      </div>
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full touch-none rounded-2xl border border-pink-100 shadow-sm"
          style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
          onMouseMove={(e) => updateCatcherFromClientX(e.clientX)}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (touch) updateCatcherFromClientX(touch.clientX);
          }}
        />
        {champion && (
          <div className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-xl bg-white/90 p-3 text-center shadow-md">
            <p className="text-xs font-semibold text-pink-500">
              🏆 {champion.username} — {champion.heartsCaught} hearts
            </p>
            <p className="mt-1 text-sm font-medium text-gray-700">
              &ldquo;{champion.message}&rdquo;
            </p>
          </div>
        )}
      </div>
      {claimOpen && (
        <form
          onSubmit={handleClaimSubmit}
          className="flex w-full flex-col items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 p-3"
        >
          <p className="text-center text-sm font-semibold text-pink-600">
            New high score — {heartsCaughtThisRunRef.current} hearts! Leave a
            message for everyone to see:
          </p>
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Say something nice!"
            className="w-full rounded-full border border-pink-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={claimStatus === 'saving' || !messageInput.trim()}
              className="rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {claimStatus === 'saving' ? 'Saving…' : 'Post message'}
            </button>
            <button
              type="button"
              onClick={() => setClaimOpen(false)}
              className="rounded-full bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700"
            >
              Skip
            </button>
          </div>
          {claimStatus === 'error' && claimError && (
            <p className="text-xs text-red-500">{claimError}</p>
          )}
        </form>
      )}
      {isPlaying ? (
        <button
          type="button"
          onClick={stopGame}
          className="rounded-full bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700"
        >
          Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white"
        >
          {heartsCaught > 0 ? 'Play Again' : 'Start Game'}
        </button>
      )}
      <p className="px-4 text-center text-xs text-gray-400">
        Kiss Coins are just for fun and have no real-world value.
      </p>
    </div>
  );
}
