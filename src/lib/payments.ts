// Statuses the Developer Portal is documented to return that we treat as a
// genuinely completed on-chain payment. NOTE: this was built from World's
// published pattern for verifying MiniKit payments (fetch
// developer.worldcoin.org/api/v2/minikit/transaction/{id}), but this
// sandbox couldn't reach docs.world.org to double check the exact response
// field names — confirm this against a real test payment (check what
// `transaction_status` actually comes back as) before relying on it with
// real WLD.
const CONFIRMED_STATUSES = ['success', 'confirmed', 'completed', 'mined'];
const FAILED_STATUSES = ['failed', 'error'];

export type TransactionVerification = {
  reference?: string;
  transaction_status?: string;
  status?: string;
  to?: string;
  from?: string;
};

export class PaymentVerificationError extends Error {}

export async function verifyWldPayment(
  transactionId: string,
): Promise<TransactionVerification> {
  const appId = process.env.NEXT_PUBLIC_APP_ID;
  const apiKey = process.env.DEV_PORTAL_API_KEY;
  if (!appId || !apiKey) {
    throw new PaymentVerificationError('Payment verification is not configured.');
  }

  const res = await fetch(
    `https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionId}?app_id=${appId}&type=payment`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );

  if (!res.ok) {
    throw new PaymentVerificationError(
      `Could not verify payment (status ${res.status}).`,
    );
  }

  return (await res.json()) as TransactionVerification;
}

export function isPaymentConfirmed(verification: TransactionVerification): boolean {
  const status = verification.transaction_status ?? verification.status;
  if (!status) return false;
  return CONFIRMED_STATUSES.includes(status.toLowerCase());
}

export function isPaymentFailed(verification: TransactionVerification): boolean {
  const status = verification.transaction_status ?? verification.status;
  if (!status) return false;
  return FAILED_STATUSES.includes(status.toLowerCase());
}
