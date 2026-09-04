'use client';

import { MiniKit } from '@worldcoin/minikit-js';

/**
 * Fire-and-forget haptic buzz. No-ops outside World App (no error, just
 * nothing happens) so callers don't need to guard every call site.
 */
export function triggerHaptic(
  input: Parameters<typeof MiniKit.commands.sendHapticFeedback>[0],
) {
  if (!MiniKit.isInstalled()) return;
  MiniKit.commands.sendHapticFeedback(input);
}
