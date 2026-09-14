export interface LanguageDefinition {
  code: string;
  name: string;
  nativeName: string;
  speechLocale: string;
  script: string;
  craftHub?: string;
  flag?: string;
}

export const INDIAN_LANGUAGES: LanguageDefinition[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    speechLocale: 'hi-IN',
    script: 'Devanagari',
    craftHub: 'Zardozi, Blue Pottery, Brassware (Jaipur, Moradabad)',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechLocale: 'bn-IN',
    script: 'Bengali',
    craftHub: 'Kantha Embroidery, Terracotta, Tant Sari (Bishnupur)',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    speechLocale: 'mr-IN',
    script: 'Devanagari',
    craftHub: 'Paithani Sari, Kolhapuri Chappals, Warli Art',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speechLocale: 'te-IN',
    script: 'Telugu',
    craftHub: 'Kalamkari, Kondapalli Toys, Pochampally Ikat',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechLocale: 'ta-IN',
    script: 'Tamil',
    craftHub: 'Kanchipuram Silk, Thanjavur Paintings, Bronze Idols',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    speechLocale: 'gu-IN',
    script: 'Gujarati',
    craftHub: 'Bandhani, Rogan Art, Patola Silk (Kutch, Patan)',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechLocale: 'kn-IN',
    script: 'Kannada',
    craftHub: 'Mysore Silk, Channapatna Wooden Toys, Bidriware',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    speechLocale: 'ml-IN',
    script: 'Malayalam',
    craftHub: 'Aranmula Mirror, Coir Handicrafts, Bell Metal',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    speechLocale: 'or-IN',
    script: 'Odia',
    craftHub: 'Pattachitra, Pipili Applique, Filigree Silver',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    speechLocale: 'pa-IN',
    script: 'Gurmukhi',
    craftHub: 'Phulkari Embroidery, Punjabi Jutti, Wood Inlay',
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    speechLocale: 'as-IN',
    script: 'Bengali-Assamese',
    craftHub: 'Muga & Eri Silk, Bell Metal (Sualkuchi, Hajo)',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    speechLocale: 'ur-IN',
    script: 'Perso-Arabic',
    craftHub: 'Chikankari Embroidery, Zari Work (Lucknow)',
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कश्मीरी / كٲشُر',
    speechLocale: 'ks-IN',
    script: 'Perso-Arabic / Devanagari',
    craftHub: 'Pashmina Shawls, Walnut Wood Carving, Paper Mache',
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    speechLocale: 'kok-IN',
    script: 'Devanagari',
    craftHub: 'Lacquerware Wooden Toys, Bamboo Crafts (Goa)',
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    speechLocale: 'mai-IN',
    script: 'Devanagari',
    craftHub: 'Madhubani / Mithila Painting, Sikki Grass Craft',
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर\'',
    speechLocale: 'brx-IN',
    script: 'Devanagari',
    craftHub: 'Dokhona Weaving, Bamboo & Cane Crafts',
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    speechLocale: 'doi-IN',
    script: 'Devanagari',
    craftHub: 'Basohli Paintings, Calico Printing (Jammu)',
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    speechLocale: 'mni-IN',
    script: 'Meitei Mayek / Bengali',
    craftHub: 'Kauna Reed Mats & Bags, Shaphee Lanphee Shawls',
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    speechLocale: 'ne-IN',
    script: 'Devanagari',
    craftHub: 'Dhaka Handloom, Woolen Weaving (Sikkim)',
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    speechLocale: 'sa-IN',
    script: 'Devanagari',
    craftHub: 'Traditional Vedic Bronze Casting & Manuscripts',
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    speechLocale: 'sat-IN',
    script: 'Ol Chiki',
    craftHub: 'Sohrai Folk Paintings, Dhokra Brass (Jharkhand)',
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    speechLocale: 'sd-IN',
    script: 'Perso-Arabic / Devanagari',
    craftHub: 'Ajrak Block Printing, Ralli Quilts (Kutch)',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechLocale: 'en-IN',
    script: 'Latin',
    craftHub: 'Pan-India Export & Global Commerce',
  },
];

export const DEFAULT_LANGUAGE = INDIAN_LANGUAGES[0]; // Hindi default

export function getLanguageByCode(code?: string): LanguageDefinition {
  if (!code) return DEFAULT_LANGUAGE;
  const match = INDIAN_LANGUAGES.find(
    (l) => l.code.toLowerCase() === code.toLowerCase()
  );
  return match ?? DEFAULT_LANGUAGE;
}

export function getLanguageByName(name?: string): LanguageDefinition {
  if (!name) return DEFAULT_LANGUAGE;
  const match = INDIAN_LANGUAGES.find(
    (l) =>
      l.name.toLowerCase() === name.toLowerCase() ||
      l.nativeName.toLowerCase() === name.toLowerCase()
  );
  return match ?? DEFAULT_LANGUAGE;
}
