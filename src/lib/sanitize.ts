const MAX_MESSAGE_LENGTH = 60;
const URL_PATTERN = /https?:\/\/|www\./i;

/**
 * Collapses whitespace and rejects empty, too-long, or link-carrying
 * messages. Returns null for anything that doesn't pass, since this is the
 * only guard between a player's phone and a message shown to every player.
 */
export function sanitizeMessage(raw: string): string | null {
  const trimmed = raw.replace(/\s+/g, ' ').trim();
  if (!trimmed || trimmed.length > MAX_MESSAGE_LENGTH) return null;
  if (URL_PATTERN.test(trimmed)) return null;
  return trimmed;
}

export { MAX_MESSAGE_LENGTH };
