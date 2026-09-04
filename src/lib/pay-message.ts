'use client';

import { MiniKit, Tokens, tokenToDecimals } from '@worldcoin/minikit-js';

import type { ScreenMessageRecord } from '@/lib/leaderboard';

export class PaymentError extends Error {}

/**
 * Pays 1 WLD to your own configured receiver address and, once the server
 * has independently verified the payment against the Developer Portal,
 * overrides the leaderboard's on-screen message — regardless of score.
 */
export async function payToOverrideMessage(
  message: string,
): Promise<ScreenMessageRecord> {
  if (!MiniKit.isInstalled()) {
    throw new PaymentError('Open this app inside World App to pay with WLD.');
  }

  const receiver = process.env.NEXT_PUBLIC_WLD_RECEIVER_ADDRESS;
  if (!receiver) {
    throw new PaymentError('Paid messages are not set up yet.');
  }

  const initRes = await fetch('/api/leaderboard/pay/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const initData = (await initRes.json()) as { reference?: string; error?: string };
  if (!initRes.ok || !initData.reference) {
    throw new PaymentError(initData.error ?? 'Could not start payment.');
  }

  const { finalPayload } = await MiniKit.commandsAsync.pay({
    reference: initData.reference,
    to: receiver,
    tokens: [
      { symbol: Tokens.WLD, token_amount: tokenToDecimals(1, Tokens.WLD).toString() },
    ],
    description: 'Override the Kiss Coin leaderboard message',
  });

  if (finalPayload.status !== 'success') {
    throw new PaymentError('Payment was cancelled.');
  }

  const confirmRes = await fetch('/api/leaderboard/pay/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reference: initData.reference,
      transactionId: finalPayload.transaction_id,
    }),
  });
  const confirmData = (await confirmRes.json()) as {
    message?: ScreenMessageRecord;
    error?: string;
  };
  if (!confirmRes.ok || !confirmData.message) {
    throw new PaymentError(
      confirmData.error ?? 'Payment succeeded but could not be confirmed.',
    );
  }

  return confirmData.message;
}
