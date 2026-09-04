import { Redis } from '@upstash/redis';

const BEST_SCORE_KEY = 'kiss-coin:best-score';
const MESSAGE_KEY = 'kiss-coin:message';
const PENDING_PAYMENT_PREFIX = 'kiss-coin:pending-payment:';
const PENDING_PAYMENT_TTL_SECONDS = 60 * 15;

export type BestScoreRecord = {
  walletAddress: string;
  username: string;
  heartsCaught: number;
  updatedAt: string;
};

export type ScreenMessageRecord = {
  walletAddress: string;
  username: string;
  message: string;
  source: 'score' | 'payment';
  updatedAt: string;
};

export type PendingPayment = {
  reference: string;
  walletAddress: string;
  username: string;
  message: string;
  createdAt: string;
};

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// Local play-testing without an Upstash account: process-lifetime only,
// and only ever consulted when NODE_ENV is development.
const devMemoryStore: {
  bestScore: BestScoreRecord | null;
  message: ScreenMessageRecord | null;
  pendingPayments: Map<string, PendingPayment>;
} = { bestScore: null, message: null, pendingPayments: new Map() };

function devMemoryStoreEnabled() {
  return process.env.NODE_ENV === 'development';
}

export class LeaderboardUnavailableError extends Error {}

export async function getBestScore(): Promise<BestScoreRecord | null> {
  const redis = getRedis();
  if (redis) return (await redis.get<BestScoreRecord>(BEST_SCORE_KEY)) ?? null;
  if (devMemoryStoreEnabled()) return devMemoryStore.bestScore;
  return null;
}

export async function getScreenMessage(): Promise<ScreenMessageRecord | null> {
  const redis = getRedis();
  if (redis) return (await redis.get<ScreenMessageRecord>(MESSAGE_KEY)) ?? null;
  if (devMemoryStoreEnabled()) return devMemoryStore.message;
  return null;
}

/**
 * Free path: replaces both the best-score record and the on-screen message
 * if the candidate's score beats the current best. There's a small race
 * window between the read and the write (two players claiming at nearly
 * the same instant), an accepted trade-off for a small fun leaderboard
 * rather than a scored competition.
 */
export async function claimByScore(candidate: {
  walletAddress: string;
  username: string;
  heartsCaught: number;
  message: string;
}): Promise<{
  bestScore: BestScoreRecord;
  message: ScreenMessageRecord | null;
  accepted: boolean;
}> {
  const redis = getRedis();
  if (!redis && !devMemoryStoreEnabled()) {
    throw new LeaderboardUnavailableError('Leaderboard is not set up yet.');
  }

  const current = await getBestScore();
  if (current && candidate.heartsCaught <= current.heartsCaught) {
    return { bestScore: current, message: await getScreenMessage(), accepted: false };
  }

  const updatedAt = new Date().toISOString();
  const bestScore: BestScoreRecord = {
    walletAddress: candidate.walletAddress,
    username: candidate.username,
    heartsCaught: candidate.heartsCaught,
    updatedAt,
  };
  const message: ScreenMessageRecord = {
    walletAddress: candidate.walletAddress,
    username: candidate.username,
    message: candidate.message,
    source: 'score',
    updatedAt,
  };

  if (redis) {
    await redis.set(BEST_SCORE_KEY, bestScore);
    await redis.set(MESSAGE_KEY, message);
  } else {
    devMemoryStore.bestScore = bestScore;
    devMemoryStore.message = message;
  }

  return { bestScore, message, accepted: true };
}

/**
 * Paid path: unconditionally overwrites the on-screen message. Never
 * touches the best-score record. Callers must have already verified a real
 * completed payment before calling this.
 */
export async function setMessageByPayment(candidate: {
  walletAddress: string;
  username: string;
  message: string;
}): Promise<ScreenMessageRecord> {
  const redis = getRedis();
  if (!redis && !devMemoryStoreEnabled()) {
    throw new LeaderboardUnavailableError('Leaderboard is not set up yet.');
  }

  const message: ScreenMessageRecord = {
    walletAddress: candidate.walletAddress,
    username: candidate.username,
    message: candidate.message,
    source: 'payment',
    updatedAt: new Date().toISOString(),
  };

  if (redis) {
    await redis.set(MESSAGE_KEY, message);
  } else {
    devMemoryStore.message = message;
  }

  return message;
}

export async function createPendingPayment(pending: PendingPayment): Promise<void> {
  const redis = getRedis();
  if (!redis && !devMemoryStoreEnabled()) {
    throw new LeaderboardUnavailableError('Payments are not set up yet.');
  }

  if (redis) {
    await redis.set(`${PENDING_PAYMENT_PREFIX}${pending.reference}`, pending, {
      ex: PENDING_PAYMENT_TTL_SECONDS,
    });
  } else {
    devMemoryStore.pendingPayments.set(pending.reference, pending);
  }
}

export async function getPendingPayment(
  reference: string,
): Promise<PendingPayment | null> {
  const redis = getRedis();
  if (redis) {
    return (
      (await redis.get<PendingPayment>(`${PENDING_PAYMENT_PREFIX}${reference}`)) ??
      null
    );
  }
  if (devMemoryStoreEnabled()) {
    return devMemoryStore.pendingPayments.get(reference) ?? null;
  }
  return null;
}

export async function deletePendingPayment(reference: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(`${PENDING_PAYMENT_PREFIX}${reference}`);
  } else if (devMemoryStoreEnabled()) {
    devMemoryStore.pendingPayments.delete(reference);
  }
}
