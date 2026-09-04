import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { createPendingPayment, LeaderboardUnavailableError } from '@/lib/leaderboard';
import { sanitizeMessage } from '@/lib/sanitize';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  if (
    !process.env.NEXT_PUBLIC_WLD_RECEIVER_ADDRESS ||
    !process.env.DEV_PORTAL_API_KEY
  ) {
    return NextResponse.json(
      { error: 'Paid messages are not set up yet.' },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const rawMessage = typeof body?.message === 'string' ? body.message : '';
  const message = sanitizeMessage(rawMessage);
  if (!message) {
    return NextResponse.json(
      { error: 'Message must be 1-60 characters and not contain a link.' },
      { status: 400 },
    );
  }

  const reference = crypto.randomUUID().replace(/-/g, '');

  try {
    await createPendingPayment({
      reference,
      walletAddress: session.user.walletAddress,
      username: session.user.username,
      message,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    if (err instanceof LeaderboardUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }

  return NextResponse.json({ reference });
}
