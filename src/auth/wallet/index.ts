import { MiniKit } from '@worldcoin/minikit-js';
import { signIn } from 'next-auth/react';
import { getNewNonces } from './server-helpers';

/**
 * Authenticates a user via their wallet using a nonce-based challenge-response mechanism.
 *
 * This function generates a unique `nonce` and requests the user to sign it with their wallet,
 * producing a `signedNonce`. The `signedNonce` ensures the response we receive from wallet auth
 * is authentic and matches our session creation.
 *
 * @returns {Promise<SignInResponse>} The result of the sign-in attempt.
 * @throws {Error} If wallet authentication fails at any step.
 */
export const walletAuth = async () => {
  if (!MiniKit.isInstalled()) {
    console.warn('MiniKit is not installed (outside World App).');
    throw new Error('Please open this mini app inside World App to verify your wallet.');
  }

  const { nonce, signedNonce } = await getNewNonces();

  const result = await MiniKit.walletAuth({
    nonce,
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
    statement: `Sign in to Balloon Kiss on World App (${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}).`,
  });

  console.log('MiniKit walletAuth result:', result);

  if (!result || !result.data || !result.data.address) {
    throw new Error('Wallet verification was canceled or failed.');
  }

  try {
    await MiniKit.sendHapticFeedback({
      hapticsType: 'notification',
      style: 'success',
    });
  } catch {
    // Haptics optional
  }

  return await signIn('credentials', {
    redirectTo: '/',
    nonce,
    signedNonce,
    finalPayloadJson: JSON.stringify({
      status: 'success',
      address: result.data.address,
      message: result.data.message,
      signature: result.data.signature,
    }),
  });
};

