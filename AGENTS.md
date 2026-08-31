# KarigarAI — AI Coding Agent Instructions

> This repository uses **Expo SDK 54** (Expo ~54.0.0) and React Native 0.81.5.
> Expo has changed a lot between releases. Read the **exact versioned docs at
> https://docs.expo.dev/versions/v54.0.0/** before writing any frontend code, and
> verify every Expo API against the version actually installed in `package.json`.

---

## 1. Mission

**KarigarAI** is an AI-powered, voice-first digital commerce assistant for Indian
artisans. An artisan takes/uploaded a product photo, describes it by voice or
text, and the app (using Google Gemini) turns that into a structured product
listing — filling in missing details through a short conversational follow-up,
recommending a price, and letting the artisan publish the product into a
persistent digital catalogue ("My Products").

This is a **hackathon prototype** for SIH, **not** a production marketplace.
The repository does **not** contain a real database, authentication, real
marketplace publishing, real delivery/logistics, real live marketplace pricing,
or a buyer-matching engine. Do not build or document those as if they exist.

Only **two** deliverables are handled by documentation: `AGENTS.md` and
`README.md`. Do not modify application source code.

---

## 2. Repository Structure

```
karigar-ai/
├── package.json          # Expo / React Native frontend (root project)
├── .env.example          # Frontend env template (EXPO_PUBLIC_API_URL)
├── app.json              # Expo app config (name, android package, plugins, eas projectId)
├── eas.json              # EAS Build profiles (preview=internal, production)
├── tsconfig.json         # Frontend TypeScript (paths: @/* -> ./src/*)
├── eslint.config.js      # ESLint (eslint-config-expo)
├── src/                  # FRONTEND application code
│   ├── app/              # expo-router file-based routes/screens
│   │   ├── _layout.tsx           # Root Stack + ProductAnalysisProvider
│   │   ├── (tabs)/               # Bottom-tab screens
│   │   │   ├── _layout.tsx       # Tab navigator (Home/Products/Orders/Profile)
│   │   │   ├── index.tsx         # Home
│   │   │   ├── products.tsx      # My Products (catalogue + search + filters)
│   │   │   ├── orders.tsx        # Orders (static/mock)
│   │   │   └── profile.tsx       # Profile (static/mock)
│   │   ├── add-product.tsx       # Photo + voice/text description (Step 1)
│   │   ├── processing.tsx        # Animated processing + product analysis
│   │   ├── product-followup.tsx  # Missing-field conversational flow
│   │   ├── product-studio.tsx    # Product Studio (Step 2)
│   │   ├── recommendation.tsx    # Price & Selling (Step 3)
│   │   ├── review.tsx            # Review & Publish
│   │   ├── success.tsx           # Published confirmation / share
│   │   └── product-followup.tsx  # (dup entry, see note)
│   ├── components/       # Reusable UI: ProductCard, PrimaryButton, InfoCard,
│   │                     #   ProcessingStep, ScreenHeader, SectionHeader, StatCard, Screen
│   ├── context/
│   │   ├── ProductAnalysisContext.tsx  # Single source of truth for the AI product flow
│   │   └── productFlow.ts             # ProductState/PublishedProduct helpers
│   ├── services/
│   │   ├── api.ts           # analyzeProduct + submitProductFollowUp (backend calls)
│   │   ├── speech.ts        # Voice recording + transcription (expo-audio)
│   │   ├── pricing.ts       # getMarketPricing (backend call)
│   │   ├── productStorage.ts# AsyncStorage persistence
│   │   └── tts.ts           # Text-to-speech (expo-speech)
│   ├── hooks/
│   │   └── useMarketPricing.ts  # Fetch pricing for current product (demo-safe)
│   ├── constants/
│   │   ├── colors.ts        # Theme palette
│   │   └── mockData.ts      # Demo/mock products, orders, profile, stats
│   ├── types/
│   │   ├── product.ts       # Product / ProductState / ProductField / Language / SellingScope
│   │   ├── pricing.ts       # MarketPricing types
│   │   └── env.d.ts
│   └── app-mimic/           # (empty placeholder directory)
├── backend/               # BACKEND (Node.js + Express + TypeScript)
│   ├── package.json        # backend scripts
│   ├── .env.example        # backend env template (Gemini keys, models, PORT)
│   ├── tsconfig.json       # backend TypeScript (outputs to dist/)
│   ├── scripts/
│   │   └── pricing.sanity.test.ts  # assertion-based pricing tests (npm run test:pricing)
│   ├── uploads/            # uploaded product images (multer; .gitkeep only in git)
│   └── src/
│       ├── server.ts       # Express app bootstrap + error middleware
│       ├── config/
│       │   ├── env.ts      # Port + Gemini env reading
│       │   └── gemini.ts   # Backend-only Gemini keys, models, failover
│       ├── routes/
│       │   ├── health.routes.ts    # GET /health
│       │   ├── product.routes.ts   # /api/products/*
│       │   ├── speech.routes.ts    # /api/speech/transcribe
│       │   └── ai.routes.ts        # /api/ai/generate-listing (stub)
│       ├── controllers/
│       │   ├── product.controller.ts
│       │   └── ai.controller.ts
│       ├── middleware/
│       │   └── upload.middleware.ts  # multer image upload
│       ├── services/
│       │   ├── ai.service.ts        # Gemini product analysis + follow-up engine
│       │   ├── speech.service.ts    # Gemini transcription + in-flight guard
│       │   ├── pricing.service.ts   # legacy wrapper -> marketPricing
│       │   ├── price/…              # services/pricing/* (market engine, providers, category refs)
│       │   └── image.service.ts     # stub (enhanceImage TODO)
│       └── types/
│           ├── product.ts
│           └── pricing.ts
├── assets/                # Expo images/splash/icons
├── dist/                  # Web static export artifact (ignored in git)
├── .env (ignored)         # Frontend env (local, not committed)
├── .env.example
├── eas.json
└── app.json / tsconfig.json / eslint.config.js
```

Notes:
- There is no `frontend/` subfolder; the Expo app lives at the repo root. The
  backend is a separate `backend/` package.
- `src/app-mimic/` and root `dist/` are empty/artifact folders.

---

## 3. Architecture

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

### Frontend state
- **`ProductAnalysisContext`** (`src/context/ProductAnalysisContext.tsx`) is the
  single source of truth for the product currently going through the AI flow
  (`currentProduct`, `sourceImageUri`, `missingFields`, `followUpQuestion`,
  `sellingScope`, `publishedProducts`, `editingProductId`).
- Screens read/write this context; they do **not** each keep their own copy of
  the product (avoids duplicate state).

### API boundary
- `src/services/api.ts` — `analyzeProduct()` (multipart: image + transcript +
  language) and `submitProductFollowUp()` (JSON). `src/services/pricing.ts` —
  `getMarketPricing()`. `src/services/speech.ts` — `transcribeAudio()`.
- The backend URL comes from `EXPO_PUBLIC_API_URL` (frontend `.env`), and the
  frontend never holds Gemini keys.

### Backend services
- Express 5 + TypeScript; routes under `src/routes`, logic in
  `src/services`. Multer handles image uploads to `backend/uploads/`.
- `/health` → liveness. `/api/products/*` → analysis, follow-up, pricing.
  `/api/speech/transcribe` → transcription. `/api/ai/generate-listing` → stub.

### Persistence
- `@react-native-async-storage/async-storage` (frontend device storage).
  See section 8.

### Pricing
- Estimate/category-reference engine on the backend; **no live providers are
  registered** (`providerRegistry.ts` has an empty `pricingProviders` array).
  See section 9.

---

## 4. Important Source-of-Truth Files

| File | Responsibility |
|------|----------------|
| `src/context/ProductAnalysisContext.tsx` | Single source of truth for current product, missing fields, follow-up Q, published products, selling scope, publish/update/clear |
| `src/context/productFlow.ts` | `ProductState`/`PublishedProduct` helpers: `applyProductPatch`, `createPublishedProduct`, `publishedToProductCard`, `productCardToProductState` |
| `src/services/api.ts` | Frontend → backend: `analyzeProduct`, `submitProductFollowUp` (with friendly Hindi error messages) |
| `src/services/speech.ts` | Voice recording (`useRecorder`), mono/low-bitrate preset, `transcribeAudio`, `[VOICE PERF]` logs |
| `src/services/pricing.ts` | Frontend → backend `getMarketPricing` (demo-safe, never throws) |
| `src/services/productStorage.ts` | AsyncStorage load/save of published products (key `@karigar_ai/published_products`) |
| `src/services/tts.ts` | Text-to-speech via `expo-speech` (`speakText`, `stopSpeech`) |
| `src/hooks/useMarketPricing.ts` | Fetch pricing per product; states `loading/ready/unavailable` |
| `src/app/_layout.tsx` | Root Stack + provider wrapper |
| `src/app/(tabs)/_layout.tsx` | Bottom tab navigator |
| `backend/src/config/gemini.ts` | Backend-only Gemini keys, product/speech models, failover loop |
| `backend/src/services/ai.service.ts` | Gemini product analysis + missing-field follow-up engine + mock fallback |
| `backend/src/services/speech.service.ts` | Gemini transcription + in-flight guard + language hints |
| `backend/src/services/pricing/marketPricing.service.ts` | Market-reference pricing engine (estimate fallback) |
| `backend/src/services/pricing/providers/providerRegistry.ts` | Live-provider registry (**currently empty**) |
| `backend/src/services/pricing/categoryReference.ts` | Curated category price ranges (estimate anchors, not live data) |
| `backend/src/routes/*`, `controllers/*` | HTTP surface |

---

## 5. Complete Current User Flow

1. **Add Product** — `src/app/add-product.tsx` (Step 1 of 3)
   - User picks a photo (`expo-image-picker`) and records a voice description
     (`src/services/speech.ts`) or types it into the description box.
   - `handleSubmit` navigates to `/processing` with `imageUri`, `imageName`,
     `imageType`, `transcript`, `language` params.

2. **Processing / analysis** — `src/app/processing.tsx`
   - Plays an animated progress sequence, calls `analyzeProduct()`.
   - On success calls `setProduct(product, imageUri, missingFields,
     followUpQuestion)`. If `ready === false` and missing fields exist →
     `/product-followup`; otherwise → `/product-studio`.

3. **Follow-up (missing-field conversation)** — `src/app/product-followup.tsx`
   - Shows the AI question, auto-speaks it (TTS), lets the artisan answer by
     **text** or **voice** (same transcription flow). Calls
     `submitProductFollowUp()`.
   - After `ready` **or** reaching `MAX_QUESTIONS = 2`
     (`src/app/product-followup.tsx:31`; backend cap `FOLLOW_UP_MAX_ROUNDS = 2`
     in `ai.service.ts:65`) → `/product-studio`.

4. **Product Studio** — `src/app/product-studio.tsx` (Step 2 of 3)
   - Shows image (with an "AI Enhanced" visual toggle — cosmetic only), product
     name/category/weight/price chips, description, materials, tags.
   - "Price & Selling देखें →" → `/recommendation`.

5. **Recommendation (price & selling)** — `src/app/recommendation.tsx` (Step 3 of 3)
   - Uses `useMarketPricing()` to fetch the suggested range. User can edit the
     price (updates `currentProduct.price`). Selling location shows
     **"Not set"** (hardcoded — the fake Mumbai/Pune/Nashik/Delhi claims were
     removed). Selling scope: Local / State / All India.
   - "Review & Publish करें →" → `/review`.

6. **Review & Publish** — `src/app/review.tsx`
   - Summarises product details, price, and selling location. On Publish, calls
     `publishCurrentProduct()` (saves to AsyncStorage) → `/success`.

7. **Success** — `src/app/success.tsx`
   - Confirmation, share button (`Share.share`), and "प्रोडक्ट देखें" →
     `/(tabs)/products`.

8. **My Products** — `src/app/(tabs)/products.tsx`
   - Shows persisted published products (from AsyncStorage) **plus** the demo
     products from `src/constants/mockData.ts`. Opening a card routes to
     `/product-studio` (EDIT mode if it is a published product).

---

## 6. Gemini Architecture

### Where Gemini is called (backend only)
- **Product analysis**: `backend/src/services/ai.service.ts` →
  `POST /v1beta/models/{model}:generateContent` with the product image (base64)
  + prompt. Model from `GEMINI_PRODUCT_MODEL` (falls back to `GEMINI_MODEL`).
- **Speech transcription**: `backend/src/services/speech.service.ts` →
  same endpoint with audio (base64) + `speechConfig.languageCode`. Model from
  `GEMINI_SPEECH_MODEL`.

### Product vs speech model
- Product model: `getProductModel()` = `GEMINI_PRODUCT_MODEL` → else
  `GEMINI_MODEL` → else default (`gemini-3.5-flash-lite` in `env.ts`).
- Speech model: `getSpeechModel()` = `GEMINI_SPEECH_MODEL` → else
  `GEMINI_SPEECH_MODEL` default in `env.ts`.

### Failover (`backend/src/config/gemini.ts`)
- `getGeminiApiKeys()` reads `GEMINI_API_KEY_1` … `GEMINI_API_KEY_5`
  (preferred, in order), ignoring empty values. If **no numbered keys** exist,
  it falls back to the single legacy `GEMINI_API_KEY`.
- `runGeminiWithFailover()` tries each key in order, **only failing over on
  qualifying transient failures**: HTTP 429 / 503, or bodies matching
  `RESOURCE_EXHAUSTED|quota|rate.?limit|temporar(?:y|ily)`.
- Non-transient errors (invalid key, malformed request) are rethrown
  immediately (no failover).
- If **all keys** are exhausted on transient errors, the last error is rethrown
  (HTTP status preserved) and logged as `[AI FAILOVER] all configured keys exhausted`.
- Logs reference "key 1", "key 2" — never the key value.

### Environment variables (backend)
`GEMINI_API_KEY_1..5`, `GEMINI_API_KEY`, `GEMINI_PRODUCT_MODEL`, `GEMINI_MODEL`,
`GEMINI_SPEECH_MODEL`, `PORT`. See `backend/.env.example`.

### What must NEVER be in frontend code
- **Gemini API keys must never be placed in the Expo frontend** or in
  `EXPO_PUBLIC_*` variables. Keys stay backend-only. The frontend only sends
  images/audio/transcript/language to your own backend and receives results.

### When no keys are configured
- `ai.service.ts`: product analysis falls back to a **mock analysis**
  (`mockAnalysis`) and a **mock follow-up** (`mockFollowUp`).
- `speech.service.ts`: throws a `SpeechServiceError` ("Gemini API keys set नहीं हैं…").

---

## 7. Voice Architecture

1. **Recording** — `src/app/add-product.tsx` and `src/app/product-followup.tsx`
   use `useRecorder()` from `src/services/speech.ts` (`expo-audio`).
2. **Audio file** — `VOICE_RECORDING_OPTIONS` in `speech.ts` uses a
   **voice-tuned preset**: mono, 16 kHz, 32 kbps AAC `.m4a` — far smaller than
   the stereo 128kbps default (the dominant contributor to upload/latency).
3. **Upload** — `transcribeAudio()` builds a `FormData` with the audio + a
   `language` hint and POSTs to `/api/speech/transcribe`.
4. **Backend** — `backend/src/routes/speech.routes.ts` (multer memory storage,
   ≤15 MB, audio-only) → `speech.service.ts::transcribeAudio`.
5. **Gemini** — one `generateContent` request (base64 audio + prompt +
   `speechConfig.languageCode`), **exactly one** normal request, **no retry
   loop** on normal success.
6. **In-flight guard** — a single `transcriptionInFlight` promise prevents
   accidental duplicate concurrent transcription requests (returns HTTP 409
   friendly message).
7. **Performance logs** — `[VOICE PERF]` timings on the frontend (`speech.ts`)
   and in the backend route/service (`backend/…/speech.routes.ts`,
   `speech.service.ts`).
8. **Language hint** — frontend sends the current UI language; backend maps to a
   BCP-47 hint (`hi-IN`, `mr-IN`, `en-IN`).
9. **Response/UI** — transcript text is appended to the description box (or, in
   follow-up, to the answer box). TTS (`src/services/tts.ts`) reads AI messages
   aloud and `setAudioModeAsync` is toggled between recording and playback.

---

## 8. Persistence

- **Library**: `@react-native-async-storage/async-storage` (device-local;
  **not** a server DB).
- **Key**: `@karigar_ai/published_products`
  (`src/services/productStorage.ts:4`).
- **Write**: `publishCurrentProduct()` in `ProductAnalysisContext.tsx` creates a
  snapshot `PublishedProduct { id, product, sourceImageUri, createdAt }`, adds
  it to `publishedProducts`, and calls `savePublishedProducts(next)`. Failures
  are swallowed (product stays in UI).
- **Read / hydration**: on provider mount, `loadPublishedProducts()` is called;
  rows are validated (`isPublishedProduct` shape check) and set into state.
  `isProductsHydrated` flips true after load so the Products tab can show a
  loading spinner without flashing.
- **Restart behaviour**: published products survive app restart (they are in
  AsyncStorage).
- **Limitations**:
  - Image URI persistence is limited: published products store the **local image
    URI** (`sourceImageUri`). Local image/cache URIs (e.g.
    `file:///…/ImagePicker/…`, cache paths) are **not guaranteed** to survive OS
    or cache cleanup, so images may not appear after a long time or device
    cleanup.
  - The demo products in `mockData.ts` use **remote Unsplash URLs** and are
    **not** persisted DB records — they are hardcoded catalogue items shown
    alongside the persisted ones.

---

## 9. Pricing

### What is real
- A backend endpoint `POST /api/products/pricing`
  (`backend/src/routes/product.routes.ts`) → `getMarketPricing()` in
  `backend/src/services/pricing/marketPricing.service.ts`.
- A **category-reference / AI-estimate engine** that returns a suggested
  `recommendedMin`/`recommendedMax`/`recommendedPrice`, source type,
  confidence, and an explanation (in Hindi/English).
- The engine **never fabricates** `comparableProducts` and always labels
  category/estimate results as "अनुमानित मूल्य है, लाइव मार्केट डेटा नहीं"
  (estimated, not live market data).
- A **sanity check** rejects absurd AI/user numbers against the category
  window (`sanityCheckPrice`).
- Manual price entry is always possible in `recommendation.tsx`.

### What is NOT real
- **No live marketplace provider is registered.** `providerRegistry.ts` has an
  **empty** `pricingProviders` array. There is **no confirmed Flipkart/Amazon
  integration** in the repository.
- Therefore pricing is currently **estimate / reference based**, **not live
  market data**, and there are **no real comparable marketplace listings**.
  The "market_reference" branch only runs if a provider is added later.

### Fallback
- Providers are searched first; since none exist, it always falls back to the
  category-reference / AI-estimate path with `marketAvailable: false`.

### Do NOT
- Call an estimate "live market data".
- Claim comparable marketplace listings exist in the current build (they don't).

---

## 10. Delivery / Selling Location

- In `src/app/recommendation.tsx` and `src/app/review.tsx`, the **Seller
  location is hardcoded to "Not set"** (`sellValue`). The old fake
  Mumbai/Pune/Nashik/Delhi serviceability is **not** present.
- The **selling scope** is selectable: Local / State / All India
  (`SellingScope` = `'local' | 'states' | 'india'`; `SELLING_SCOPES` in
  `mockData.ts`).
- The UI text explicitly says actual courier serviceability "would be verified
  through a logistics API in a later phase". **There is no logistics API
  integration.** Do not fabricate courier serviceability.

---

## 11. Environment Variables

### Frontend (root `.env` — copied from `.env.example`)
- `EXPO_PUBLIC_API_URL` — the backend base URL the app calls. Use your
  computer's LAN IP (http://<LAN-IP>:5000), **not** localhost, so a phone on the
  same Wi-Fi can reach it. This is **safe to expose** (no secret). Example file:
  `EXPO_PUBLIC_API_URL=http://192.168.1.100:5000`.
- **Never** put Gemini API keys into `EXPO_PUBLIC_*` variables.

### Backend (`backend/.env` — copied from `backend/.env.example`)
| Variable | Meaning | Secret? |
|----------|---------|---------|
| `PORT` | Backend port (default 5000) | No |
| `GEMINI_API_KEY` | Legacy single key (used only if no numbered keys set) | **Yes** |
| `GEMINI_API_KEY_1..5` | Numbered keys tried in order for failover | **Yes** |
| `GEMINI_PRODUCT_MODEL` | Product-analysis model (falls back to `GEMINI_MODEL`) | No |
| `GEMINI_MODEL` | Default product model | No |
| `GEMINI_SPEECH_MODEL` | Speech transcription model | No |

- All `GEMINI_*` keys are **secrets** and must stay **backend-only**.
- On Render you would set these as environment variables (secrets masked), plus
  `PORT=5000`. There is no committed `render.yaml`; see section 13.

---

## 12. Local Development Setup

### Prerequisites
- Node.js (LTS) and npm.
- For phone testing: the **Expo Go** app installed on an Android phone, and the
  phone + computer on the **same Wi-Fi network**.

### Clone & install
```bash
git clone https://github.com/Vikash-Singh-Bhadoriya/karigar-ai.git
cd karigar-ai
npm install            # root (frontend)
cd backend
npm install            # backend
cd ..
```

### Backend env
```bash
cd backend
cp .env.example .env
# edit .env: set at least one Gemini key (e.g. GEMINI_API_KEY_1=...)
#   and optionally GEMINI_PRODUCT_MODEL / GEMINI_SPEECH_MODEL
cd ..
```

### Frontend env
```bash
cp .env.example .env
# set EXPO_PUBLIC_API_URL to your LAN IP: http://<LAN-IP>:5000
# find your IP: `ipconfig` on Windows / `ip addr` or `ifconfig` on Linux/macOS
```

### Start the backend
```bash
cd backend
npm run dev            # ts-node-dev with respawn (or `npm run build && npm start`)
```
You should see: `KarigarAI backend running on http://localhost:5000`.

### Start the Expo dev server
```bash
npm start              # or: npx expo start
# on another terminal:
npm run android        # expo start --android (only if an emulator is connected)
```

### Open the app with Expo Go
1. Press `a` in the Expo terminal (Android) or scan the QR code with Expo Go.
2. The phone opens the app. If the bundle loads but the backend is unreachable,
   verify the phone and computer are on the same Wi-Fi and
   `EXPO_PUBLIC_API_URL` is the LAN IP.

### Tunnel mode (optional)
If the phone cannot reach the LAN IP (different network / firewall), start with
`npx expo start --tunnel` (`@expo/ngrok` is a dependency). The phone then loads
the JS bundle through a tunnel; the backend **still** needs to be reachable by
`EXPO_PUBLIC_API_URL` from the phone.

### Android emulator
`npm run android` (`expo start --android`) is configured, but there is no
dedicated emulator config or `android/` folder committed (Expo managed). If you
have Android Studio + an emulator running, `npm run android` will target it.

### How the frontend reaches the backend
All API calls use `EXPO_PUBLIC_API_URL` (`src/services/api.ts`,
`src/services/speech.ts`, `src/services/pricing.ts`). e.g.
`http://192.168.1.100:5000/api/products/analyze`.

### Verify backend is alive
```bash
curl http://<LAN-IP>:5000/health
# → {"success":true,"message":"KarigarAI backend is running"}
# or open http://localhost:5000/health on the machine running the backend
```

---

## 13. Render Deployment

- The repository has **no committed `render.yaml`** and no documented Render
  setup in the repo. The backend is a standard Node build; using Render for it
  would follow Render's own flow. The 2024 history shows a commit
  "Prepare backend for deployment" (`b1ad6f0`) but there is no committed
  deployment config.
- To deploy the backend on Render (if set up manually):
  - Build command: `npm run build` (runs `tsc` inside `backend`)
  - Start command: `npm start` (runs `node dist/server.js`)
  - Environment: all `GEMINI_API_KEY*` + optional model overrides + `PORT=5000`
    (mask secrets).
- **Frontend → backend**: set the Render URL (https://yourapp.onrender.com) as
  `EXPO_PUBLIC_API_URL` in the frontend `.env` before building for production.
- Redeploy note: any change to backend `.env` variables requires a Render redeploy
  / new environment values.

---

## 14. APK Build (EAS)

`eas.json` defines:
- `preview`: `{ "distribution": "internal" }` → APK for internal distribution
  (eas and teammates) — this is what you use to get a demo APK.
- `production`: `{}` → for app store submission (binary out).

Flow:
```bash
# 1. Install EAS CLI (once) and log in
npx eas-cli login
npx eas-cli whoami          # confirm logged-in Expo account

# 2. Build an internal-distribution Android APK (preview profile)
npx eas-cli build --platform android --profile preview

# 3. The build runs in the cloud; get the .apk from the link/QR in output, or
#    list builds with:
npx eas-cli build:list
```
- EAS builds the Android artifact **in the cloud** (not local).
- Teammates install by downloading the generated `.apk` (or scanning the QR) and
  opening it on an Android device (allow unknown sources).
- The `eas.projectId` is `17cfe2ea-18a5-47f6-954b-d69bb58d77b9` (`app.json`).

---

## 15. Git / GitHub Team Workflow

Default branch is **`master`** (per `git branch -a`), tracked at
`https://github.com/Vikash-Singh-Bhadoriya/karigar-ai.git`.

Recommended hackathon flow (short-lived feature branches off `master`):

```bash
git checkout master
git pull origin master
git checkout -b feature/<short-name>
# ... make a focused change, test ...
git add <specific files>
git commit -m "short description"
git push -u origin feature/<short-name>
# open a pull request, get a quick review, merge back to master
```

Rules:
- **Do not commit `.env`** (both root and `backend/.env` are gitignored).
- **Do not commit API keys.**
- **Do not force-push `master`.**
- **Do not make giant unrelated commits.**
- **Do not modify unrelated files.**

---

## 16. Coding Rules

- Frontend is **TypeScript**; backend is **TypeScript** compiled with `tsc`.
- **Reuse** existing services/context: route product state through
  `ProductAnalysisContext`, API through `src/services/*`, never open duplicate
  state or duplicate API requests.
- Thread flow through the existing screens; do **not** create parallel copies.
- **Preserve** error handling and loading states (friendly Hindi messages,
  `ApiError`, `useMarketPricing`'s demo-safe `unavailable` state).
- **Never expose secrets**; keep Gemini backend-only; never put keys in
  `EXPO_PUBLIC_*`.
- **Do not fabricate external/real data** (no fake delivery claims, no fake live
  market prices, no fake marketplace/orders as if real).

---

## 17. Testing Checklist

### Commands (from `package.json`)
- Frontend type/lint:
  ```bash
  npm run lint        # expo lint
  npx tsc --noEmit    # TypeScript check (frontend)
  ```
- Backend build:
  ```bash
  cd backend && npm run build   # tsc → dist/
  ```
- Backend pricing sanity tests:
  ```bash
  cd backend && npm run test:pricing
  ```
- Android export / build:
  ```bash
  npx eas-cli build --platform android --profile preview   # cloud APK
  ```

### Manual device demo tests
- [ ] App starts on Expo Go / APK (no white screen).
- [ ] Backend reachable (`/health` responds, connection flow works).
- [ ] Add product → pick photo → record voice → transcript appears.
- [ ] Product analysis returns a listing (photo + voice).
- [ ] Missing-field flow asks a question; answer by text **and** by voice.
- [ ] After enough info (or 2 question rounds) → Product Studio.
- [ ] Pricing recommendation shows (marked estimate/anonymous) and price editable.
- [ ] Review → Publish → success → appears in **My Products**.
- [ ] Restart app → published product still in My Products (persistence).
- [ ] Product detail opens correctly (tap a card → Studio), and back works.
- [ ] Navigation/back behaves correctly across the flow (no dead ends).
- [ ] Voice transcription latency is reasonable (`[VOICE PERF]` logs).
- [ ] Rate-limit failover: with a limited key + a good key, requests succeed and
      logs show `[AI FAILOVER] … trying key N`.
- [ ] No fake delivery/courier claims are shown to the user.

---

## 18. Current Status — DONE

- [x] Expo / React Native frontend with expo-router tabs & flow screens.
- [x] Separate Node.js/Express/TypeScript backend under `backend/`.
- [x] Gemini product analysis (photo + voice/text) with JSON output.
- [x] Gemini speech transcription with performance optimizations
      (mono/low-bitrate, single request, in-flight guard, `[VOICE PERF]`, language hints).
- [x] Gemini failover (`GEMINI_API_KEY_1..5`, sequential transient-failure
      retry, backend-only keys; product & speech models separately configurable).
- [x] Missing-field conversational flow (text + voice answers; max 2 rounds;
      auto-TTS of questions).
- [x] Product persistence via AsyncStorage (key `@karigar_ai/published_products`);
      published products survive restart.
- [x] Sample/demo products (hardcoded catalogue items in `mockData.ts`, opened
      into the Studio — not persisted DB records).
- [x] Product Studio / recommendation / review / publish / success flow.
- [x] Pricing endpoint returning **estimate / category-reference** results,
      sanity-checked, clearly labelled as not-live-data (provider registry empty).
- [x] Selling location UI showing **"Not set"** (no fake serviceability);
      selling scope Local/State/All India.
- [x] Mock/static orders and profile (clearly demo data).
- [x] EAS build config (preview = internal, production), `eas.projectId` set.

---

## 19. CURRENT LIMITATIONS

- [ ] No real database (only AsyncStorage on-device; no server persistence).
- [ ] No authentication / user accounts.
- [ ] No real buyer discovery or matching engine.
- [ ] No real marketplace publishing integration.
- [ ] No live market pricing providers registered (pricing is estimate/reference).
- [ ] No real delivery/logistics API; courier serviceability is not claimed.
- [ ] Orders tab shows static/mock data only.
- [ ] Profile screen is static/mock; the edit (✏️) buttons and many action
      buttons are non-functional placeholders.
- [ ] Product Studio "AI Enhanced" toggle is cosmetic only; image enhancement is
      a stub (`image.service.ts`).
- [ ] `generateListing` (`/api/ai/generate-listing`) is a stub.
- [ ] Local image URIs may not survive OS/cache cleanup (image persistence limit).
- [ ] Follow-up is capped at 2 rounds (hardcoded budget).
- [ ] No committed Render deployment config in the repo.

---

## 20. SIH FINAL PLAN (targeted for the evening)

Approx. 5 hours. Preserve the principle: **NO NEW LARGE FEATURES AFTER THE
FREEZE.**

```
18:00–18:30  P0 smoke test (full demo flow on a device)
18:30–19:30  Fix ONLY demo-blocking bugs
19:30–20:15  Polish core demo UX / loading / voice feel
20:15–21:00  Test failover / pricing / voice / persistence
21:00–21:30  Generate final APK (EAS preview)
21:30–22:00  Install + complete full demo on a clean device
22:00–22:30  Fix ONLY critical issues
22:30–23:00  FREEZE code + final APK + push + backup
```

### Priority hierarchy

**P0 — MUST NOT BREAK / DEMO CRITICAL (touch only to fix, never rewrite)**
- App starts; backend reachable; photo input; voice/text description;
  Gemini product analysis; missing-field conversation; voice transcription;
  Product Studio; pricing; review/edit; publish; My Products; persistence after
  restart; product detail opens; navigation/back; no fake delivery claims;
  Gemini failover; APK builds.

**P1 — HIGH VALUE IF TIME REMAINS (only if P0 is solid; ~5h budget)**
Examples to evaluate against the repo: improve demo reliability; loading/voice
UX; navigation polish; fix product-detail-after-restart image gaps; make sample
products open correctly; make publishing feel more marketplace-ready if cheap;
improve multilingual UI if infra exists; add demo-safe fallbacks.

**P2 — DO ONLY IF P0/P1 ARE SOLID (larger features)**
Buyer discovery; matching engine; marketplace integrations; real marketplace
pricing providers; seller-location persistence; real delivery/logistics API;
authentication; real backend database; real order management; ML/XGBoost/
scikit-learn; large multilingual expansion; real marketplace APIs.

**P3 — DO NOT ATTEMPT BEFORE SIH**
- Do **not** rewrite architecture.
- Do **not** migrate the backend framework (stays Express/Node).
- Do **not** introduce PostgreSQL merely for presentation completeness.
- Do **not** add authentication unless absolutely necessary.
- Do **not** build real Flipkart/Amazon integration overnight.
- Do **not** introduce ML/XGBoost just because it appears in the presentation.
- Do **not** replace working Gemini architecture.
- Do **not** perform broad refactors immediately before the demo.

---

## 21. Emergency Rule

If a change breaks the core demo:

```bash
git restore <file>            # revert a single file
# or
git log --oneline -10         # find the last known-good commit
git checkout <good-commit> -- <path>      # restore specific files
# or, as a hard reset ONLY if you have no uncommitted work:
git reset --hard <good-commit>
```

**The demo is more important than feature count.** When in doubt, return to the
last known-good state rather than chasing a risky fix.
