import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  claimChampion,
  LeaderboardUnavailableError,
} from '@/lib/leaderboard';
import { sanitizeMessage } from '@/lib/sanitize';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const heartsCaught = Number(body?.heartsCaught);
  const rawMessage = typeof body?.message === 'string' ? body.message : '';

  if (!Number.isInteger(heartsCaught) || heartsCaught <= 0) {
    return NextResponse.json({ error: 'Invalid score.' }, { status: 400 });
  }

  const message = sanitizeMessage(rawMessage);
  if (!message) {
    return NextResponse.json(
      { error: 'Message must be 1-60 characters and not contain a link.' },
      { status: 400 },
    );
  }

  try {
    const { champion, accepted } = await claimChampion({
      walletAddress: session.user.walletAddress,
      username: session.user.username,
      heartsCaught,
      message,
    });

    if (!accepted) {
      return NextResponse.json(
        { error: 'Someone beat your score just now — try again!', champion },
        { status: 409 },
      );
    }

    return NextResponse.json({ champion });
  } catch (err) {
    if (err instanceof LeaderboardUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
