import { Redis } from '@upstash/redis';

const CHAMPION_KEY = 'kiss-coin:champion';

export type ChampionRecord = {
  walletAddress: string;
  username: string;
  heartsCaught: number;
  message: string;
  updatedAt: string;
};

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// Local play-testing without an Upstash account: process-lifetime only,
// and only ever consulted when NODE_ENV is development.
const devMemoryStore: { champion: ChampionRecord | null } = { champion: null };
function devMemoryStoreEnabled() {
  return process.env.NODE_ENV === 'development';
}

export async function getChampion(): Promise<ChampionRecord | null> {
  const redis = getRedis();
  if (redis) return (await redis.get<ChampionRecord>(CHAMPION_KEY)) ?? null;
  if (devMemoryStoreEnabled()) return devMemoryStore.champion;
  return null;
}

export class LeaderboardUnavailableError extends Error {}

/**
 * Replaces the champion record if the candidate's score beats the current
 * one. There's a small race window between the read and the write (two
 * players claiming at nearly the same instant), which is an accepted
 * trade-off for a small fun leaderboard rather than a scored competition.
 */
export async function claimChampion(candidate: {
  walletAddress: string;
  username: string;
  heartsCaught: number;
  message: string;
}): Promise<{ champion: ChampionRecord; accepted: boolean }> {
  const redis = getRedis();
  if (!redis && !devMemoryStoreEnabled()) {
    throw new LeaderboardUnavailableError('Leaderboard is not set up yet.');
  }

  const current = await getChampion();
  if (current && candidate.heartsCaught <= current.heartsCaught) {
    return { champion: current, accepted: false };
  }

  const champion: ChampionRecord = {
    walletAddress: candidate.walletAddress,
    username: candidate.username,
    heartsCaught: candidate.heartsCaught,
    message: candidate.message,
    updatedAt: new Date().toISOString(),
  };

  if (redis) {
    await redis.set(CHAMPION_KEY, champion);
  } else {
    devMemoryStore.champion = champion;
  }

  return { champion, accepted: true };
}
