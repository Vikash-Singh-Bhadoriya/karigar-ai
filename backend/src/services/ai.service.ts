import fs from 'fs';
import path from 'path';
import {
  getGeminiApiKeys,
  getProductModel,
  isTransientFailure,
  runGeminiWithFailover,
} from '../config/gemini';
import type {
  FollowUpInput,
  ListingInput,
  ProductAnalysisResponse,
  ProductField,
  ProductInput,
  ProductState,
} from '../types/product';

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

type Lang = 'hi' | 'mr' | 'en';

const REQUIRED_FIELDS: ProductField[] = [
  'name',
  'category',
  'description',
  'materials',
  'weight',
  'price',
];

const FOLLOW_UP: Record<ProductField, Record<Lang, string>> = {
  name: {
    hi: 'इस प्रोडक्ट का नाम क्या है?',
    mr: 'या उत्पादाचे नाव काय आहे?',
    en: 'What is the name of this product?',
  },
  category: {
    hi: 'यह प्रोडक्ट किस कैटेगरी में आता है?',
    mr: 'हे उत्पाद कोणत्या श्रेणीत येते?',
    en: 'Which category does this product belong to?',
  },
  description: {
    hi: 'इस प्रोडक्ट के बारे में थोड़ा और बताएं।',
    mr: 'या उत्पादाबद्दल थोडे अधिक सांगा.',
    en: 'Tell me a bit more about this product.',
  },
  materials: {
    hi: 'यह प्रोडक्ट किस सामग्री से बना है?',
    mr: 'हे उत्पाद कोणत्या साहित्यापासून बनवले आहे?',
    en: 'What material is this product made of?',
  },
  weight: {
    hi: 'इस प्रोडक्ट का वजन कितना है?',
    mr: 'या उत्पादाचे वजन किती आहे?',
    en: 'How much does this product weigh?',
  },
  price: {
    hi: 'इस प्रोडक्ट की कीमत कितनी रखनी है?',
    mr: 'या उत्पादाची किंमत किती ठेवायची आहे?',
    en: 'What price do you want for this product?',
  },
};

/** Hard cap so the artisan never gets trapped in an endless loop of questions. */
const FOLLOW_UP_MAX_ROUNDS = 2;

/** Order in which missing fields should be asked about (most important first). */
const FOLLOW_UP_PRIORITY: ProductField[] = [
  'price',
  'materials',
  'weight',
  'category',
  'description',
  'name',
];

/* ------------------------------------------------------------------------- */
/* Gemini HTTP client                                                         */
/* ------------------------------------------------------------------------- */

interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

interface GeminiCandidate {
  content: { parts: Array<{ text?: string }> };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

async function callGemini(parts: GeminiPart[]): Promise<Record<string, unknown>> {
  const model = getProductModel();
  return runGeminiWithFailover('product', async (apiKey) => {
    const url = `${GEMINI_ENDPOINT}/${model}:generateContent`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[ai.service] Gemini API error (${res.status}): ${body.slice(0, 300)}`);
      throw {
        status: res.status,
        body,
        transient: isTransientFailure(res.status, body),
      };
    }

    const data = (await res.json()) as GeminiResponse;
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Gemini returned no content');
    }
    return extractJson(text);
  });
}

function extractJson(text: string): Record<string, unknown> {
  let raw = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end > start) {
    raw = raw.slice(start, end + 1);
  }
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }
}

function mimeFromPath(p: string): string {
  switch (path.extname(p).toLowerCase()) {
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.heic':
      return 'image/heic';
    case '.jpg':
    case '.jpeg':
    default:
      return 'image/jpeg';
  }
}

/* ------------------------------------------------------------------------- */
/* Prompt + normalization                                                     */
/* ------------------------------------------------------------------------- */

function buildPrompt(input: ProductInput): string {
  const transcript = (input.transcript ?? '').trim();
  return [
    "You are KarigarAI, an expert assistant for Indian artisans creating e-commerce product listings.",
    "Analyze the product from the provided photo and/or the artisan's spoken description.",
    `Artisan's description: "${transcript || '(none provided)'}"`,
    "Respond with ONLY valid JSON (no markdown, no code fences) in exactly this shape:",
    JSON.stringify({
      name: 'string',
      category: 'string',
      description: 'string',
      materials: ['string'],
      tags: ['string'],
      weight: 'string or null',
      dimensions: 'string or null',
      price: 'number or null',
      confidence: { 'field-name': '0-1' },
    }),
    'Rules:',
    '- Set a field to null/empty ONLY if it cannot be determined from the photo or description. Do not invent facts.',
    '- name/category/description: fill from what is visible or described, in English.',
    '- materials: list of materials, e.g. ["Cotton"].',
    '- tags: 3-5 short English keywords suitable for a marketplace.',
    '- price: numeric INR value ONLY if the artisan mentioned a price. Otherwise null. Never guess market price.',
    '- weight/dimensions: keep as mentioned, e.g. "500 g" or "30 x 40 cm"; null if unknown.',
    '- confidence: a 0-1 score per field the model actually filled.',
  ].join('\n');
}

/* ------------------------------------------------------------------------- */
/* Conversational follow-up (missing-field) engine                            */
/* ------------------------------------------------------------------------- */

function ensureTags(product: ProductState): ProductState {
  if (product.tags && product.tags.length > 0) return product;
  const seed = [product.name, product.category, product.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const words = seed
    ? Array.from(
        new Set(seed.split(/[^a-z0-9\u0900-\u097F]+/).filter((w) => w.length > 2))
      )
    : [];
  const tags = words.slice(0, 5).map((w) => `#${w.charAt(0).toUpperCase()}${w.slice(1)}`);
  return { ...product, tags: tags.length ? tags : ['#Handmade', '#Artisan'] };
}

function buildFollowUpQuestion(field: ProductField, lang: Lang, isReask: boolean): string {
  const base = FOLLOW_UP[field][lang];
  if (isReask) {
    if (lang === 'hi') return `कोई बात नहीं 😊 ${base}`;
    if (lang === 'mr') return `काही हरकत नाही 😊 ${base}`;
    return `No problem 😊 ${base}`;
  }
  const lead = { hi: 'बहुत बढ़िया! 😊', mr: 'छान! 😊', en: 'Great! 😊' }[lang];
  return `${lead} ${base}`;
}

function buildFollowUpPrompt(input: FollowUpInput): string {
  const { product, missingFields, answer, questionCount = 0 } = input;
  const missing = missingFields.filter((f): f is ProductField =>
    (REQUIRED_FIELDS as readonly ProductField[]).includes(f)
  );
  return [
    'You are KarigarAI, continuing a product-listing conversation with an Indian artisan.',
    'Here is the current product JSON (PRESERVE every field in your output unless the answer changes it):',
    JSON.stringify(product),
    `The following required fields are still missing: ${JSON.stringify(missing)}`,
    `The artisan just answered: "${(answer ?? '').trim()}"`,
    'Interpret the answer in context and update ONLY the product fields it implies (e.g. "सात सौ रुपये" -> price 700; "कपास" -> materials ["Cotton"]; weight/size -> weight or dimensions).',
    `This is follow-up question #${questionCount + 1} of ${FOLLOW_UP_MAX_ROUNDS}. Do not imply more questions remain than this budget.`,
    'Then determine which required fields (name, category, description, materials, weight, price) are STILL missing.',
    'Rules:',
    '- If tags are empty, generate 3-5 sensible marketplace tags. Never block on tags.',
    '- If the answer is vague and a required field is still missing, keep that field missing so the caller can re-ask politely once.',
    '- Output ONLY valid JSON (no markdown, no code fences) in exactly this shape:',
    JSON.stringify({
      product: {
        name: 'string',
        category: 'string',
        description: 'string',
        materials: ['string'],
        tags: ['string'],
        weight: 'string or null',
        dimensions: 'string or null',
        price: 'number or null',
        confidence: { 'field-name': '0-1' },
      },
    }),
  ].join('\n');
}

function buildFollowUpResponse(
  product: ProductState,
  input: FollowUpInput
): ProductAnalysisResponse {
  const finalProduct = ensureTags(product);
  const missing = REQUIRED_FIELDS.filter((f) => isMissing(f, finalProduct));
  const asked = input.questionCount ?? 0;
  const lang = toLang(input.language);

  if (missing.length === 0 || asked >= FOLLOW_UP_MAX_ROUNDS) {
    return { product: finalProduct, missingFields: missing, followUpQuestion: undefined, ready: true };
  }

  const nextField = FOLLOW_UP_PRIORITY.find((f) => missing.includes(f)) ?? missing[0];
  const question = buildFollowUpQuestion(nextField, lang, asked >= 1);
  return {
    product: finalProduct,
    missingFields: missing,
    followUpQuestion: question,
    ready: false,
  };
}

function mockFollowUp(input: FollowUpInput): ProductAnalysisResponse {
  const product = ensureTags(input.product);
  const missing = REQUIRED_FIELDS.filter((f) => isMissing(f, product));
  return buildFollowUpResponse(product, input);
}

function toStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function toStrArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function toNullableStr(v: unknown): string | null {
  if (v == null) return null;
  const s = toStr(v).trim();
  return s || null;
}

function toPrice(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const digits = v.replace(/[^0-9]/g, '');
    const n = digits ? parseInt(digits, 10) : NaN;
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function normalize(raw: Record<string, unknown>, language?: string, imagePath?: string): ProductState {
  const confidenceRaw: Record<string, unknown> =
    typeof raw.confidence === 'object' && raw.confidence !== null
      ? (raw.confidence as Record<string, unknown>)
      : {};

  const confidence: Record<string, number> = {};
  for (const [k, v] of Object.entries(confidenceRaw)) {
    const n = typeof v === 'number' ? v : Number(v);
    if (Number.isFinite(n)) confidence[k] = Math.min(1, Math.max(0, n));
  }

  const product: ProductState = {
    name: toStr(raw.name),
    category: toStr(raw.category),
    description: toStr(raw.description),
    materials: toStrArr(raw.materials),
    tags: toStrArr(raw.tags),
    weight: toNullableStr(raw.weight),
    dimensions: toNullableStr(raw.dimensions),
    price: toPrice(raw.price),
    confidence,
    language,
    imagePath,
  };

  const present: Array<[ProductField, string | string[]]> = [
    ['name', product.name],
    ['category', product.category],
    ['description', product.description],
    ['materials', product.materials],
  ];
  for (const [field, value] of present) {
    const filled = typeof value === 'string' ? value.trim().length > 0 : value.length > 0;
    if (filled && confidence[field] === undefined) {
      confidence[field] = 0.6;
    }
  }

  return product;
}

/* ------------------------------------------------------------------------- */
/* Missing-field engine + follow-up questions                                 */
/* ------------------------------------------------------------------------- */

function toLang(language?: string): Lang {
  const l = (language ?? '').trim();
  if (l === 'hi' || l === 'mr' || l === 'en') return l;
  if (l.includes('मराठी')) return 'mr';
  if (/en/i.test(l)) return 'en';
  return 'hi';
}

function isMissing(field: ProductField, p: ProductState): boolean {
  switch (field) {
    case 'name':
      return !p.name.trim();
    case 'category':
      return !p.category.trim();
    case 'description':
      return !p.description.trim();
    case 'materials':
      return p.materials.length === 0;
    case 'weight':
      return !p.weight;
    case 'price':
      return p.price == null;
  }
}

function buildResponse(product: ProductState, language?: string): ProductAnalysisResponse {
  const missingFields = REQUIRED_FIELDS.filter((f) => isMissing(f, product));
  const firstMissing = missingFields[0];
  const followUpQuestion = firstMissing ? FOLLOW_UP[firstMissing][toLang(language)] : undefined;
  return { product, missingFields, followUpQuestion, ready: missingFields.length === 0 };
}

/* ------------------------------------------------------------------------- */
/* Public service API                                                         */
/* ------------------------------------------------------------------------- */

export async function analyzeProduct(input: ProductInput): Promise<ProductAnalysisResponse> {
  if (getGeminiApiKeys().length === 0) {
    console.warn('[ai.service] Gemini API keys not set — returning mock analysis');
    return mockAnalysis(input);
  }

  const parts: GeminiPart[] = [];
  if (input.imagePath) {
    let data: string;
    try {
      data = fs.readFileSync(input.imagePath).toString('base64');
    } catch {
      throw new Error('Could not read uploaded image');
    }
    parts.push({ inline_data: { mime_type: mimeFromPath(input.imagePath), data } });
  }
  parts.push({ text: buildPrompt(input) });

  const raw = await callGemini(parts);
  const product = normalize(raw, input.language, input.imagePath);
  return buildResponse(product, input.language);
}

export async function generateListing(input: ListingInput): Promise<ProductAnalysisResponse> {
  // TODO: wire through Gemini text-only call once the conversational flow lands
  const product: ProductState = {
    name: 'Artisan Product',
    category: 'Handmade',
    description: `Generated from transcript: ${input.transcript}`,
    materials: [],
    tags: ['Handmade', 'Artisan'],
    weight: null,
    dimensions: null,
    price: null,
    confidence: { name: 0.7, description: 0.7 },
    language: input.language,
  };
  return buildResponse(product, input.language);
}

export async function followUp(input: FollowUpInput): Promise<ProductAnalysisResponse> {
  if (getGeminiApiKeys().length === 0) {
    console.warn('[ai.service] Gemini API keys not set — returning mock follow-up');
    return mockFollowUp(input);
  }

  const parts: GeminiPart[] = [{ text: buildFollowUpPrompt(input) }];
  const raw = await callGemini(parts);

  const rawProduct: Record<string, unknown> =
    typeof raw.product === 'object' && raw.product !== null
      ? (raw.product as Record<string, unknown>)
      : {};
  const product = normalize(rawProduct, input.language, input.product.imagePath);
  return buildFollowUpResponse(product, input);
}

function mockAnalysis(input: ProductInput): ProductAnalysisResponse {
  const product: ProductState = {
    name: 'Handcrafted Cotton Tote Bag',
    category: 'Handmade Bags',
    description: 'A beautiful handcrafted cotton tote bag created by a local artisan.',
    materials: ['Cotton'],
    tags: ['Handmade', 'Cotton', 'EcoFriendly'],
    weight: null,
    dimensions: null,
    price: null,
    confidence: { name: 0.95, category: 0.92, description: 0.9, materials: 0.9 },
    language: input.language,
    imagePath: input.imagePath,
  };
  return buildResponse(product, input.language);
}