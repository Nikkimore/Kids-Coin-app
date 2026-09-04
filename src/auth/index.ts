import {
  MiniKit,
  verifySiweMessage,
  type MiniAppWalletAuthSuccessPayload,
} from '@worldcoin/minikit-js';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';

declare module 'next-auth' {
  interface User {
    walletAddress?: string;
    username?: string;
    profilePictureUrl?: string | null;
  }
  interface Session {
    user: {
      walletAddress: string;
      username: string;
      profilePictureUrl: string | null;
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  providers: [
    Credentials({
      name: 'World App Wallet',
      credentials: {
        nonce: { label: 'Nonce', type: 'text' },
        finalPayloadJson: { label: 'Final payload', type: 'text' },
      },
      authorize: async (credentials) => {
        const nonce = credentials?.nonce as string | undefined;
        const finalPayloadJson = credentials?.finalPayloadJson as
          | string
          | undefined;
        if (!nonce || !finalPayloadJson) return null;

        // The nonce is verified against the one we minted and stored in an
        // httpOnly cookie, so a client can't forge a sign-in with an
        // arbitrary nonce it never received from the server.
        const cookieStore = await cookies();
        const storedNonce = cookieStore.get('siwe-nonce')?.value;
        cookieStore.delete('siwe-nonce');
        if (!storedNonce || storedNonce !== nonce) return null;

        let finalPayload: MiniAppWalletAuthSuccessPayload;
        try {
          finalPayload = JSON.parse(finalPayloadJson);
        } catch {
          return null;
        }
        if (finalPayload.status !== 'success') return null;

        const { isValid } = await verifySiweMessage(finalPayload, storedNonce);
        if (!isValid) return null;

        const profile = await MiniKit.getUserByAddress(
          finalPayload.address,
        ).catch(() => null);

        return {
          id: finalPayload.address,
          walletAddress: finalPayload.address,
          username: profile?.username ?? finalPayload.address,
          profilePictureUrl: profile?.profilePictureUrl ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.walletAddress = user.walletAddress;
        token.username = user.username;
        token.profilePictureUrl = user.profilePictureUrl ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.walletAddress = (token.walletAddress as string) ?? '';
      session.user.username = (token.username as string) ?? '';
      session.user.profilePictureUrl =
        (token.profilePictureUrl as string | null) ?? null;
      return session;
    },
  },
});
