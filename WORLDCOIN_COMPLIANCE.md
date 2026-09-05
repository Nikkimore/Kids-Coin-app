# Balloon Kiss Mini App - World App Integration & Go-Live Guide

## Overview
**Balloon Kiss** is a fast-paced hot air balloon arcade mini app built natively for the **World App** ecosystem. It is fully compliant with all World App technical specifications, MiniKit v2 guidelines, World ID authentication standards, and World Chain token payment mechanics.

---

## 1. Technical Compliance & MiniKit Integration

### A. MiniKit SDK v2 Integration
- **Framework**: Built on Next.js 15 (App Router) using the official `@worldcoin/create-mini-app` template.
- **SDKs**: Uses `@worldcoin/minikit-js` (v2.0.3+), `@worldcoin/minikit-react`, and `@worldcoin/mini-apps-ui-kit-react`.
- **MiniKitProvider**: Configured in [`src/providers/index.tsx`](file:///Users/pedromorbeck/Desktop/Kids-Coin-app/src/providers/index.tsx) with `appId` initialization.
- **World App Detection**: Uses `MiniKit.isInstalled()` to gracefully adapt between native World App webviews and standard browser previews.

### B. World ID Authentication & Session Management
- **SIWE (Sign-In with Ethereum)**: Supports standard World ID wallet signature authentication via [`src/auth/wallet/`](file:///Users/pedromorbeck/Desktop/Kids-Coin-app/src/auth/wallet).
- **Session Handling**: Powered by NextAuth v5 with JWT strategy and server-side nonce verification.
- **User Profile**: Displays user username and Worldcoin `Marble` avatar inside the top navigation bar.

### C. 1 WLD Sky Banner Payment Flow
- **Payment Command**: Initiated via `MiniKit.pay({ ... })` requesting exactly 1.0 WLD on World Chain.
- **Configurable Recipient**: Recipient wallet address is parameterized via `NEXT_PUBLIC_WLD_RECIPIENT_ADDRESS`.
- **Backend Confirmation**: Uses [`/api/confirm-payment`](file:///Users/pedromorbeck/Desktop/Kids-Coin-app/src/app/api/confirm-payment/route.ts) to verify transaction receipts against the Worldcoin Developer Portal API (`https://developer.worldcoin.org/api/v2/minikit/transaction/{id}`).
- **Web Simulation**: Automatically provides mock approval in local development and web previews so pilots can test the sky banner without World App.

### D. Mobile Webview & UX Standards
- **Viewport**: Exported in `src/app/layout.tsx` with `viewportFit: 'cover'`, `maximumScale: 1`, and `userScalable: false` to ensure edge-to-edge native rendering.
- **Safe Area Insets**: Handled via `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` in `globals.css` to prevent UI obstruction by device notches and home indicators.
- **Native Gesture Lock**: `overscroll-behavior-y: none` prevents accidental browser pull-to-refresh gestures during balloon flight.

---

## 2. Step-by-Step Go-Live Checklist

Follow these steps to submit and deploy Kiss Coin to the World App store:

### Step 1: Register on World Developer Portal
1. Visit the [World Developer Portal](https://developer.worldcoin.org).
2. Log in and select **Create App** $\to$ choose **Mini App**.
3. Fill in your Mini App details:
   - **App Name**: `Balloon Kiss`
   - **Category**: Games
   - **Description**: `Fly hot air balloons, catch kisses, dodge darts, and sponsor sky banners in World App.`
4. Copy your **App ID** (format: `app_...`).
5. Under **API Keys**, create an API key and copy your **Dev Portal API Key**.

### Step 2: Configure Production Environment Variables
Set the following environment variables in your hosting provider (e.g. Vercel, Cloudflare, AWS):

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_ID` | Your App ID from World Developer Portal | `app_1234567890` |
| `NEXT_PUBLIC_WLD_RECIPIENT_ADDRESS` | Your World Chain wallet address to receive 1 WLD banner payments | `0xYourWalletAddress...` |
| `DEV_PORTAL_API_KEY` | Developer Portal API key for transaction validation | `key_...` |
| `AUTH_SECRET` | NextAuth encryption secret | Generate with `openssl rand -base64 32` |
| `HMAC_SECRET_KEY` | Nonce HMAC signing secret | Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Your production public HTTPS domain | `https://kisscoin.yourdomain.com` |
| `AUTH_TRUST_HOST` | Set to `true` on Vercel or behind reverse proxies | `true` |
| `RP_ID` | Relying Party ID (your app domain) | `kisscoin.yourdomain.com` |
| `RP_SIGNING_KEY` | Optional RP signing key from Developer Portal | `...` |

### Step 3: Deploy to Production (HTTPS Required)
1. Deploy your Next.js application to Vercel or any Node.js host.
2. Ensure SSL/HTTPS is active (World App strictly rejects insecure HTTP domains).
3. Test your production URL in your browser:
   - Verify the landing page loads with zero console errors.
   - Verify that clicking **Fly Balloon 🎈** immediately launches flight.

### Step 4: Test Inside World App Developer Mode
1. Open **World App** on your mobile device.
2. Go to **Settings $\to$ Developer Settings**.
3. Enter your production URL (or local tunnel via `ngrok`) into the Mini App URL field.
4. Launch the app inside World App:
   - Verify the TopBar and Marble load.
   - Test paying 1 WLD to sponsor a banner via the World App transaction modal.
   - Verify the banner immediately flies behind the hot air balloon.

### Step 5: Submit for App Store Review
1. In the World Developer Portal, upload your app icon (`public/kiss-balloon-icon-v2.jpg` or `public/icon.png`, matching the game opening screen) and screenshots (4:5 canvas aspect ratio).
2. Click **Submit for Review**.
3. Once approved by the Worldcoin foundation team, Balloon Kiss will appear in the World App store for all verified World ID users worldwide!

---

## 3. Compliance Verification Status
- ✅ **ESLint**: 0 errors, 0 warnings (`npm run lint` passes).
- ✅ **TypeScript**: Fully type-safe (`npx tsc --noEmit` passes).
- ✅ **Next.js Production Build**: Builds all static and server pages cleanly (`npm run build` passes).
- ✅ **MiniKit Compatibility**: Full support for MiniKit v2 and World ID SIWE wallet auth.
- ✅ **World Chain Payments**: Real 1 WLD transaction flow with Developer Portal verification.


