import { NextResponse } from 'next/server';

import { getChampion } from '@/lib/leaderboard';

export async function GET() {
  const champion = await getChampion();
  return NextResponse.json({ champion });
}
