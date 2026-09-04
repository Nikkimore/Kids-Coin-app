'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 480;
const CATCHER_WIDTH = 72;
const CATCHER_HEIGHT = 16;
const CATCHER_Y = CANVAS_HEIGHT - 40;
const HEART_SIZE = 28;
const HEARTS_PER_COIN = 3;
const SPAWN_INTERVAL_MS = 700;

type Heart = {
  id: number;
  x: number;
  y: number;
  speed: number;
};

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

  const [isPlaying, setIsPlaying] = useState(false);
  const [heartsCaught, setHeartsCaught] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const stored = Number(localStorage.getItem(balanceKey(walletAddress)) ?? 0);
    setBalance(Number.isFinite(stored) ? stored : 0);
  }, [walletAddress]);

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

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between px-1 text-sm font-medium text-gray-600">
        <span>Hearts: {heartsCaught}</span>
        <span>🪙 {balance} Kiss Coins</span>
      </div>
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
