'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import { signIn } from 'next-auth/react';

export class WalletAuthError extends Error {}

/**
 * Runs the World App wallet sign-in flow: fetches a server-minted nonce,
 * asks World App to sign a SIWE message with it, then hands the signed
 * payload to NextAuth's credentials provider for verification.
 */
export async function signInWithWallet() {
  if (!MiniKit.isInstalled()) {
    throw new WalletAuthError(
      'Open this app inside World App to sign in with your World ID wallet.',
    );
  }

  const nonceRes = await fetch('/api/nonce');
  if (!nonceRes.ok) {
    throw new WalletAuthError('Could not start sign-in. Please try again.');
  }
  const { nonce } = (await nonceRes.json()) as { nonce: string };

  const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
    nonce,
    statement: 'Sign in to Kiss Coin to start catching hearts and earning coins.',
    expirationTime: new Date(Date.now() + 1000 * 60 * 10),
  });

  if (finalPayload.status !== 'success') {
    throw new WalletAuthError('Sign-in was cancelled.');
  }

  const result = await signIn('credentials', {
    nonce,
    finalPayloadJson: JSON.stringify(finalPayload),
    redirect: false,
  });

  if (!result || result.error) {
    throw new WalletAuthError('Sign-in failed. Please try again.');
  }
}
