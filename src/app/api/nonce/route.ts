import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const nonce = crypto.randomUUID().replace(/-/g, '');

  const cookieStore = await cookies();
  cookieStore.set('siwe-nonce', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });

  return NextResponse.json({ nonce });
}
