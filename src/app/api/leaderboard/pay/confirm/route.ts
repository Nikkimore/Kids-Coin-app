import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  deletePendingPayment,
  getPendingPayment,
  LeaderboardUnavailableError,
  setMessageByPayment,
} from '@/lib/leaderboard';
import {
  isPaymentConfirmed,
  isPaymentFailed,
  PaymentVerificationError,
  verifyWldPayment,
} from '@/lib/payments';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const reference = typeof body?.reference === 'string' ? body.reference : '';
  const transactionId =
    typeof body?.transactionId === 'string' ? body.transactionId : '';
  if (!reference || !transactionId) {
    return NextResponse.json({ error: 'Invalid confirmation.' }, { status: 400 });
  }

  let pending;
  try {
    pending = await getPendingPayment(reference);
  } catch (err) {
    if (err instanceof LeaderboardUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }

  if (!pending || pending.walletAddress !== session.user.walletAddress) {
    return NextResponse.json(
      { error: 'No matching pending payment for this account.' },
      { status: 404 },
    );
  }

  try {
    const verification = await verifyWldPayment(transactionId);

    if (verification.reference !== reference) {
      return NextResponse.json(
        { error: 'Payment reference did not match — please try again.' },
        { status: 402 },
      );
    }
    if (isPaymentFailed(verification)) {
      await deletePendingPayment(reference);
      return NextResponse.json({ error: 'Payment failed.' }, { status: 402 });
    }
    if (!isPaymentConfirmed(verification)) {
      // Not confirmed yet (still settling on-chain) — keep the pending
      // record so the client can retry confirm shortly.
      return NextResponse.json(
        { error: 'Payment is still confirming — try again in a moment.' },
        { status: 409 },
      );
    }

    const message = await setMessageByPayment({
      walletAddress: pending.walletAddress,
      username: pending.username,
      message: pending.message,
    });
    await deletePendingPayment(reference);

    return NextResponse.json({ message });
  } catch (err) {
    if (err instanceof PaymentVerificationError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
