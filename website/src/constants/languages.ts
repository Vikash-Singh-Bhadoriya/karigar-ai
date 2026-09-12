export interface WebLanguage {
  code: string;
  name: string;
  nativeName: string;
  tier: 'national' | 'global';
  flag: string;
}

export const NATIONAL_LANGUAGES: WebLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', tier: 'national', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', tier: 'national', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', tier: 'national', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', tier: 'national', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', tier: 'national', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', tier: 'national', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', tier: 'national', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', tier: 'national', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', tier: 'national', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', tier: 'national', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', tier: 'national', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', tier: 'national', flag: '🇮🇳' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी / كٲشُر', tier: 'national', flag: '🇮🇳' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', tier: 'national', flag: '🇮🇳' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', tier: 'national', flag: '🇮🇳' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\'', tier: 'national', flag: '🇮🇳' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', tier: 'national', flag: '🇮🇳' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', tier: 'national', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', tier: 'national', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', tier: 'national', flag: '🇮🇳' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', tier: 'national', flag: '🇮🇳' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', tier: 'national', flag: '🇮🇳' },
];

export const GLOBAL_LANGUAGES: WebLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', tier: 'global', flag: '🌐' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', tier: 'global', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', tier: 'global', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', tier: 'global', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', tier: 'global', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', tier: 'global', flag: '🇦🇪' },
];

export const ALL_WEB_LANGUAGES: WebLanguage[] = [
  ...GLOBAL_LANGUAGES,
  ...NATIONAL_LANGUAGES,
];

export const DEFAULT_WEB_LANGUAGE = GLOBAL_LANGUAGES[0]; // English default for website
