import { NextResponse } from 'next/server';

interface BannerData {
  type: 'highscore' | 'sponsor';
  author: string;
  message: string;
  score?: number;
  isSponsor: boolean;
  timestamp: number;
  expiresAt?: number; // 1-hour shield expiration timestamp
}

// In-memory shared state for the active sky banner and sky record
let currentBanner: BannerData = {
  type: 'highscore',
  author: 'Top Pilot',
  message: 'Kiss the sky! 💋',
  score: 0,
  isSponsor: false,
  timestamp: Date.now(),
};

let pendingChampionBanner: BannerData | null = null;
let currentHighScore = 0;

export async function GET() {
  const now = Date.now();

  // If active 1-hour VIP sponsor banner has expired:
  if (currentBanner.isSponsor && currentBanner.expiresAt && currentBanner.expiresAt <= now) {
    if (pendingChampionBanner) {
      // Promote the pending champion banner who broke the record during the 1-hour shield
      currentBanner = { ...pendingChampionBanner, timestamp: now };
      pendingChampionBanner = null;
    } else {
      // Stays visible until beaten, but shield is now down
      currentBanner.expiresAt = undefined;
    }
  }

  const isShielded = Boolean(
    currentBanner.isSponsor && currentBanner.expiresAt && currentBanner.expiresAt > now
  );
  const remainingSeconds = isShielded
    ? Math.max(0, Math.ceil((currentBanner.expiresAt! - now) / 1000))
    : 0;

  return NextResponse.json({
    banner: currentBanner,
    highScore: currentHighScore,
    isShielded,
    remainingSeconds,
    pendingChampion: pendingChampionBanner ? true : false,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, author, message, score } = body;
    const now = Date.now();

    if (action === 'reset') {
      currentHighScore = typeof score === 'number' ? score : 0;
      currentBanner = {
        type: 'highscore',
        author: author || 'Top Pilot',
        message: message || 'Kiss the sky! 💋',
        score: currentHighScore,
        isSponsor: false,
        timestamp: now,
      };
      pendingChampionBanner = null;
      return NextResponse.json({ success: true, banner: currentBanner, highScore: currentHighScore });
    }

    const cleanAuthor = typeof author === 'string' && author.trim() ? author.trim().slice(0, 20) : 'Pilot';
    const cleanMessage = typeof message === 'string' && message.trim() ? message.trim().slice(0, 65) : 'Kiss the sky! 💋';

    if (action === 'highscore') {
      const parsedScore = typeof score === 'number' ? score : parseInt(score, 10) || 0;

      // Only allow new high score to take over banner if it exceeds current record
      if (parsedScore > currentHighScore) {
        currentHighScore = parsedScore;
        const isShieldActive = Boolean(
          currentBanner.isSponsor && currentBanner.expiresAt && currentBanner.expiresAt > now
        );

        const newChamp: BannerData = {
          type: 'highscore',
          author: cleanAuthor,
          message: cleanMessage,
          score: parsedScore,
          isSponsor: false,
          timestamp: now,
        };

        if (isShieldActive) {
          // 1-Hour VIP shield is active! Queue this champion's message to fly right after shield finishes
          pendingChampionBanner = newChamp;
          const remainingSecs = Math.max(0, Math.ceil((currentBanner.expiresAt! - now) / 1000));

          return NextResponse.json({
            success: true,
            queued: true,
            message: `New high score record set! Your banner will take flight in ${Math.ceil(remainingSecs / 60)}m when the 1-hour VIP shield finishes.`,
            banner: currentBanner,
            highScore: currentHighScore,
            isShielded: true,
            remainingSeconds: remainingSecs,
          });
        } else {
          // Takes over banner immediately
          currentBanner = newChamp;
          pendingChampionBanner = null;

          return NextResponse.json({
            success: true,
            queued: false,
            message: 'New high score champion banner set!',
            banner: currentBanner,
            highScore: currentHighScore,
            isShielded: false,
            remainingSeconds: 0,
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          message: `Score ${parsedScore} does not beat the current record of ${currentHighScore}.`,
          banner: currentBanner,
          highScore: currentHighScore,
        }, { status: 400 });
      }
    } else if (action === 'sponsor') {
      // 1 WLD Sponsor override: 1 full hour (3600s) guaranteed shield!
      const oneHourMs = 60 * 60 * 1000;
      currentBanner = {
        type: 'sponsor',
        author: cleanAuthor,
        message: cleanMessage,
        score: currentHighScore,
        isSponsor: true,
        timestamp: now,
        expiresAt: now + oneHourMs,
      };
      pendingChampionBanner = null;

      return NextResponse.json({
        success: true,
        message: 'VIP 1 WLD Sponsor banner active with 1-hour guaranteed shield!',
        banner: currentBanner,
        highScore: currentHighScore,
        isShielded: true,
        remainingSeconds: 3600,
      });
    }

    return NextResponse.json({ error: 'Invalid action. Use "highscore" or "sponsor".' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to process banner update' }, { status: 500 });
  }
}
