import { NextResponse } from 'next/server';

import { getBestScore, getScreenMessage } from '@/lib/leaderboard';

export async function GET() {
  const [bestScore, message] = await Promise.all([
    getBestScore(),
    getScreenMessage(),
  ]);
  return NextResponse.json({ bestScore, message });
}
