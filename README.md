# KarigarAI

**KarigarAI** is an AI-powered, voice-first digital commerce assistant that lets
an Indian artisan turn a photo and a spoken (or typed) description into a
complete, publishable e-commerce product listing — aided by Google Gemini — and
then publish it into a persistent digital catalogue ("My Products"). It is a
**hackathon prototype** for SIH, built with Expo / React Native on the frontend
and Node.js / Express / TypeScript on the backend. It is **not** yet a
production marketplace, and it deliberately makes that boundary clear.

---

## Problem

Indian artisans — weavers, potters, embroiderers, bag-makers — make beautiful
physical products but often struggle to sell online. A large barrier is the
effort of turning a product into a polished, structured online listing: writing
a title, picking a category, listing materials, describing it, and pricing it.
Many artisans are more comfortable speaking in Hindi, Marathi, or English than
typing long descriptions, and English-heavy e-commerce forms are intimidating.

## Solution

KarigarAI removes that friction. An artisan uploads a photo and briefly describes
the product **by voice or by text** in their chosen language. The app:

- Transcribes the voice (Gemini speech model).
- Sends the photo + description to Gemini (product model) for multimodal
  analysis → produces a structured product draft.
- Detects which required fields are still missing and asks a short
  **conversational follow-up** (read aloud via text-to-speech, answered by text
  or voice), capped at two rounds so the artisan is never trapped in a loop.
- Shows the result in a **Product Studio**, recommends an **estimated price
  range**, lets the artisan review/edit, then **publishes** to a persistent
  digital catalogue on the device.

The core differentiator is **voice-first, multilingual support** and
**conversational completion** of a product listing.

## Core Demo

```
Photo + Voice
      ↓
AI Product Understanding (Gemini multimodal)
      ↓
Detected missing info → Conversational follow-up (text or voice)
      ↓
Structured Product Listing (Product Studio)
      ↓
Pricing Recommendation (estimate/reference)
      ↓
Review & Edit
      ↓
Publish
      ↓
Digital Catalogue (My Products)
```

---

## Features

### Implemented
- Photo capture/upload (`expo-image-picker`).
- Voice recording + Gemini transcription (`expo-audio`), voice-tuned
  mono/low-bitrate preset, language hints (Hindi / Marathi / English).
- Gemini multimodal **product analysis** producing a structured listing.
- **Missing-field conversational flow** (max 2 rounds), auto text-to-speech of
  questions, answers by text **or** voice.
- **Gemini failover**: up to 5 numbered API keys tried in order on transient
  rate-limit failures; product and speech models separately configurable.
- Product Studio, pricing recommendation, review & publish flow.
- **Persistence** of published products with AsyncStorage (survive restart).
- Sample/demo products and catalogue grid with search + status filters.
- EAS internal-distribution APK build config.

### Prototype / Mock
- **Pricing is an estimate/reference**, not live market data. A
  category-reference + product-attribute engine returns a suggested range,
  sanity-checked and clearly labelled "अनुमानित मूल्य है, लाइव मार्केट डेटा नहीं"
  (estimated, not live market data). The live-provider registry is **empty**.
- **Orders** tab shows static/sample orders only.
- **Profile** is static/mock; several edit/pencil and action buttons are
  non-functional placeholders.
- Product Studio **"AI Enhanced"** toggle is cosmetic only (no real image
  enhancement — backend image service is a stub).
- `/api/ai/generate-listing` is a **stub**.

### Planned (NOT implemented)
- Real marketplace publishing integration (Flipkart/Amazon, etc.).
- Live marketplace pricing providers.
- Seller-location persistence and real delivery/logistics API.
- Authentication / user accounts.
- A real backend database and real order management.
- Buyer discovery / matching engine.

---

## Architecture

```
                    ┌─────────────────────────────────────┐
 Mobile App (Expo)  │  React Native + expo-router          │
                    │  src/app/*  (screens)                │
                    │  src/context/ProductAnalysisContext  │
                    │  src/services/*  (API / speech /     │
                    │     pricing / storage / tts)         │
                    └───────────────┬─────────────────────┘
                                    │ REST (fetch / multipart; EXPO_PUBLIC_API_URL)
                                    ▼
                    ┌─────────────────────────────────────┐
 Backend (Node/JS)  │  Express 5 + TypeScript              │
                    │  src/routes/* → src/controllers/*     │
                    │  src/services/*                       │
                    │    ai.service      ──► Gemini (product model)
                    │    speech.service  ──► Gemini (speech model)
                    │    pricing/*       ──► market engine (*empty* live providers)
                    └───────────────┬─────────────────────┘
                                    │ HTTPS (generativelanguage.googleapis.com)
                                    ▼
                    ┌─────────────────────────────────────┐
                    │  Google Gemini (product + speech)    │
                    │  API keys: backend-only, failover    │
                    └─────────────────────────────────────┘
```

- **Frontend state** lives in `ProductAnalysisContext` (single source of truth).
- **API boundary**: the frontend calls your backend only; it never holds Gemini
  keys. All images/audio/transcript/language go to the backend, which talks to
  Gemini.

## Tech Stack

Only technologies actually used in this repository:

- **Frontend**: Expo SDK 54, React Native 0.81.5, React 19, `expo-router`,
  React Navigation, `expo-audio`, `expo-image-picker`, `expo-speech`,
  `@react-native-async-storage/async-storage`, TypeScript.
- **Backend**: Node.js, Express 5, TypeScript, `cors`, `dotenv`, `multer`.
- **AI**: Google Gemini (product + speech models, backend-only).

> Note: this repository is **Node.js / Express / TypeScript**. There is **no**
> Python, FastAPI, or PostgreSQL in the codebase, regardless of what any
> presentation material may suggest.

## Project Structure

```
karigar-ai/
├── src/                    # Frontend (Expo app at repo root)
│   ├── app/                # expo-router screens
│   │   ├── _layout.tsx           # Root stack + provider
│   │   ├── (tabs)/               # Home, Products, Orders, Profile
│   │   ├── add-product.tsx       # Step 1: photo + voice/text
│   │   ├── processing.tsx        # analysis animation + API call
│   │   ├── product-followup.tsx  # missing-field conversation
│   │   ├── product-studio.tsx    # Step 2: studio
│   │   ├── recommendation.tsx    # Step 3: price & selling
│   │   ├── review.tsx            # review & publish
│   │   └── success.tsx           # published confirmation
│   ├── components/         # Reusable UI
│   ├── context/            # ProductAnalysisContext + productFlow
│   ├── services/           # api, speech, pricing, storage, tts
│   ├── hooks/              # useMarketPricing
│   ├── constants/          # colors, mockData
│   └── types/              # product, pricing, env
├── backend/                # Express + TypeScript backend
│   ├── src/config/         # env, gemini (keys + failover)
│   ├── src/routes/         # health, product, speech, ai
│   ├── src/controllers/
│   ├── src/middleware/     # multer image upload
│   ├── src/services/       # ai, speech, pricing, image
│   ├── src/types/
│   └── scripts/            # pricing sanity tests
├── uploads/                # uploaded product images (backend)
├── app.json / eas.json / tsconfig.json / eslint.config.js
└── package.json
```

---

## Setup

### Prerequisites
- Node.js (LTS) and npm.
- For phone testing: the **Expo Go** app on an Android phone, and the phone +
  computer on the **same Wi-Fi** network.

### Clone & install
```bash
git clone https://github.com/Vikash-Singh-Bhadoriya/karigar-ai.git
cd karigar-ai
npm install            # frontend
cd backend
npm install            # backend
cd ..
```

### Backend env
```bash
cd backend
cp .env.example .env
# Edit .env and set at least one Gemini key, e.g.:
#   GEMINI_API_KEY_1=your_key           (preferred for failover)
#   or GEMINI_API_KEY=your_key          (legacy single key)
# Optionally override models:
#   GEMINI_PRODUCT_MODEL=...            (defaults to GEMINI_MODEL)
#   GEMINI_SPEECH_MODEL=...
cd ..
```

### Frontend env
```bash
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your machine's LAN IP, e.g.:
#   EXPO_PUBLIC_API_URL=http://192.168.1.100:5000
# Find your IP: `ipconfig` (Windows) or `ip addr` / `ifconfig` (Linux/macOS)
```
Use your **LAN IP**, not `localhost`, so a phone on the same Wi-Fi can reach
the backend.

### Start the backend
```bash
cd backend
npm run dev     # ts-node-dev with respawn — or: npm run build && npm start
```
You should see: `KarigarAI backend running on http://localhost:5000`.

### Start Expo
```bash
npm start       # or: npx expo start
```
Press `a` for Android (emulator) or scan the QR code with **Expo Go**.

### Expo Go on a physical Android device
1. Install **Expo Go** from the Play Store.
2. Put the phone and computer on the **same Wi-Fi network**.
3. Scan the QR code shown in the Expo terminal.
4. If the bundle loads but the backend is unreachable, verify the phone can
   reach `EXPO_PUBLIC_API_URL` (same Wi-Fi, correct LAN IP).

### Tunnel mode (optional)
If the phone cannot reach your LAN IP (different network / firewall), run:
```bash
npx expo start --tunnel
```
The JS bundle then loads through an ngrok tunnel, but the **backend still**
must be reachable from the phone via `EXPO_PUBLIC_API_URL`.

### Verify backend is alive
```bash
curl http://<LAN-IP>:5000/health
# → {"success":true,"message":"KarigarAI backend is running"}
```

### Android emulator
`npm run android` (`expo start --android`) is configured, but there is no
committed `android/` folder (Expo managed). With Android Studio + an emulator
running, `npm run android` will target it.

---

## Environment Variables

### Frontend (root `.env`) — non-secret
| Variable | Meaning |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | Backend base URL, e.g. `http://192.168.1.100:5000`. Safe to expose. |

**Never** put Gemini API keys in `EXPO_PUBLIC_*` variables.

### Backend (`backend/.env`) — keys are secrets
| Variable | Meaning | Secret? |
|----------|---------|---------|
| `PORT` | Backend port (default 5000) | No |
| `GEMINI_API_KEY` | Legacy single key (used only if no numbered keys set) | **Yes** |
| `GEMINI_API_KEY_1..5` | Numbered keys tried in order for failover | **Yes** |
| `GEMINI_PRODUCT_MODEL` | Product-analysis model (falls back to `GEMINI_MODEL`) | No |
| `GEMINI_MODEL` | Default product model | No |
| `GEMINI_SPEECH_MODEL` | Speech transcription model | No |

All `GEMINI_*` keys are **secrets** and stay **backend-only**.

---

## Running the App

```bash
npm start              # Expo dev server
npm run android        # expo start --android (emulator)
npm run lint           # expo lint
npx tsc --noEmit       # frontend typecheck
```

## Running the Backend

```bash
cd backend
npm run dev            # dev server (respawn)
npm run build          # tsc → dist/
npm start              # node dist/server.js
npm run test:pricing   # assertion-based pricing sanity tests
```

---

## Android APK (EAS)

`eas.json` defines two profiles:
- `preview` — `{ "distribution": "internal" }` → internal APK for teammates.
- `production` — for app store submission.

```bash
# 1. Install + log in (once)
npx eas-cli login
npx eas-cli whoami

# 2. Build an internal-distribution Android APK
npx eas-cli build --platform android --profile preview

# 3. See builds:
npx eas-cli build:list
```
- EAS builds the Android artifact **in the cloud** (not locally).
- Teammates install by downloading the generated `.apk` (or scanning the QR)
  and opening it on an Android device (allow unknown sources).
- `eas.projectId`: `17cfe2ea-18a5-47f6-954b-d69bb58d77b9`.

---

## Gemini Configuration

- **Product model** — used for product analysis & follow-up
  (`GEMINI_PRODUCT_MODEL`, else `GEMINI_MODEL`, else default in `env.ts`).
- **Speech model** — used for transcription (`GEMINI_SPEECH_MODEL`).
- **Failover** — the backend reads `GEMINI_API_KEY_1..5` in order (falling back
  to the legacy `GEMINI_API_KEY`). On a transient rate-limit/quota failure
  (HTTP 429/503 or a `RESOURCE_EXHAUSTED`-style body) it tries the next key.
  Non-transient errors are not retried. If all keys are exhausted, the last
  error is returned. Logs reference "key 1 / key 2", never the key value.
- Keys are **backend-only**; the frontend never sees or holds them.

---

## Demo Script (2–3 minutes)

1. **Introduce the scenario**: an artisan with a handmade product who finds
   online selling hard.
2. On **Add Product**, select a product **photo**.
3. Tap the mic and say a short **voice description** (Hindi/English/mixed),
   e.g. "यह हाथ से बना कॉटन बैग है" — show the transcript appears.
4. Submit → show the **AI processing** animation and the generated listing.
5. Show the **missing-field question** (auto read aloud) and answer it by
   **voice** or text.
6. Show the completed **Product Studio** with name/category/materials/tags.
7. Open **Price & Selling** — show the suggested range and read/state clearly
   that this is an **estimated** price (not live market data). Edit the price.
8. Choose a **selling scope** (Local / State / All India).
9. **Review** the details and **Publish**.
10. Show the **success** screen, then open **My Products**.
11. Demonstrate the **persistent catalogue** (optionally restart the app to show
    published products survive).

---

## Current Limitations

Honest scope of the current build:

- **No real database** — only on-device AsyncStorage for published products.
- **No authentication / user accounts.**
- **No real marketplace publishing integration.**
- **No live market pricing** — pricing is an estimate/category reference, not
  live Flipkart/Amazon data, and there are no real comparable listings.
- **No real delivery/logistics API** — courier serviceability is not claimed.
- **Orders** are static/mock; **Profile** is static/mock (some buttons are
  placeholders).
- **Product Studio "AI Enhanced"** is a visual toggle only.
- **Local image URIs** may not survive OS/cache cleanup, so images could
  disappear after a long time.
- `generateListing` endpoint is a stub.

---

## Roadmap

Priority-oriented so the team can focus during the SIH window:

**P0 — MUST NOT BREAK / DEMO CRITICAL**
App starts; backend reachable; photo input; voice/text description; Gemini
product analysis; missing-field conversation; voice transcription; Product
Studio; pricing; review/edit; publish; My Products; persistence after restart;
product detail opens; navigation/back; no fake delivery claims; Gemini failover;
APK builds.

**P1 — HIGH VALUE IF TIME REMAINS**
Demo reliability; loading/voice UX; navigation polish; fixing
product-detail-after-restart image gaps; sample products opening correctly;
publishing feel; multilingual UI where infra exists; demo-safe fallbacks.

**P2 — DO ONLY IF P0/P1 ARE SOLID**
Buyer discovery; matching engine; marketplace integrations; real marketplace
pricing providers; seller-location persistence; real delivery/logistics API;
authentication; real backend database; real order management;
ML/XGBoost/scikit-learn; large multilingual expansion; real marketplace APIs.

**P3 — DO NOT ATTEMPT BEFORE SIH**
Do not rewrite architecture, migrate the backend, introduce PostgreSQL "for
completeness", add auth unless necessary, build Flipkart/Amazon integration
overnight, add ML/XGBoost for presentation, replace the working Gemini
architecture, or do broad refactors at the last minute.

---

## Team Development Workflow

Default branch is **`master`** (see `git branch -a`), remote:
`https://github.com/Vikash-Singh-Bhadoriya/karigar-ai.git`.

```bash
git checkout master
git pull origin master
git checkout -b feature/<short-name>
# make a focused change, test it locally
git add <specific files>
git commit -m "short description"
git push -u origin feature/<short-name>
# open a PR, get a quick review, merge back to master
```

Rules:
- **Do not commit `.env`** (root and `backend/.env` are gitignored).
- **Do not commit API keys.**
- **Do not force-push `master`.**
- **Do not make giant unrelated commits.**
- **Do not modify unrelated files.**

---

## Troubleshooting

### Expo Go cannot connect
- Phone and computer must be on the **same Wi-Fi**.
- If you can't reach the LAN IP (different network / firewall), use
  `npx expo start --tunnel`.
- A QR/metro connectivity issue is separate from backend reachability.

### Backend unreachable
- Confirm the backend is running (`cd backend && npm run dev`) and shows the
  listening message.
- Confirm `EXPO_PUBLIC_API_URL` is the **LAN IP** with port `5000` (not
  `localhost`, not Metro's `8081`).
- Verify from the phone: `curl http://<LAN-IP>:5000/health` should return
  `{"success":true,...}`.

### Gemini rate limit
- The backend automatically fails over to the next configured key on
  rate-limit/quota errors and logs `[AI FAILOVER] …`. Check the backend logs.
- Add more `GEMINI_API_KEY_N` values to increase headroom.

### Speech slow
- The app uses a mono/low-bitrate preset to reduce upload size. Watch
  `[VOICE PERF]` logs for where time is spent (upload vs. Gemini).
- Weaker device Wi-Fi or a distant backend can add latency.

### APK build
- EAS builds in the **cloud**; you need `npx eas-cli login` and a free Expo
  account. Ensure `eas.json` uses the `preview` (internal) profile for a demo
  APK.

### AsyncStorage persistence
- Published products survive restart (stored under key
  `@karigar_ai/published_products`), but images reference **local URIs** that
  may not survive OS/cache cleanup. Demo products use remote Unsplash URLs.

### Render environment variables
- Set all `GEMINI_API_KEY*` (mask secrets) and `PORT=5000` as environment
  variables on the Render service; any change requires a redeploy. There is no
  committed `render.yaml`.
