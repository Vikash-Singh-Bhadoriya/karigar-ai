import React, { createContext, useContext, useState } from 'react';
import {
  ALL_WEB_LANGUAGES,
  DEFAULT_WEB_LANGUAGE,
} from '../constants/languages';
import type { WebLanguage } from '../constants/languages';

const STORAGE_KEY = '@karigar_web_language';

export interface WebTranslations {
  // Navigation & Branding
  home: string;
  browse: string;
  shopNow: string;
  empoweringArtisans: string;
  preservingHeritage: string;
  viksitBharat: string;
  stepTowards: string;
  cart: string;
  addToCart: string;
  viewDetails: string;
  freeShipping: string;

  // Tabs & Indicators
  nationalTab: string;
  globalTab: string;
  authenticHandmade: string;
  directFromArtisans: string;
  exportWorldwide: string;

  // Browse Page UI
  browseTitle: string;
  browseSubtitle: string;
  filters: string;
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  allCategories: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  applyFilters: string;
  clearAll: string;
  productsFound: string;
  loadingProducts: string;
  noProductsFound: string;
  noProductsSub: string;

  // Product Card & Details
  priceLabel: string;
  artisanLabel: string;
  authenticBadge: string;
  backToProducts: string;
  descriptionLabel: string;
  materialsLabel: string;
  estimatedPrice: string;
  productNotFound: string;
  productNotFoundSub: string;
  buyNow: string;
  orderThisProduct: string;
  tagsLabel: string;
  weightLabel: string;
  dimensionsLabel: string;
  sellingScopeLabel: string;
  scopeLocal: string;
  scopeStates: string;
  scopeIndia: string;

  // Home Page
  heroHeritageTag: string;
  heroTitle: string;
  heroSub: string;
  heroDesc: string;
  exploreCollection: string;
  craftsmanshipTitle: string;
  craftsmanshipDesc: string;
  latestProductsTitle: string;
  latestProductsSubtitle: string;
  viewAllCollection: string;
  warmingUpTitle: string;
  warmingUpSub: string;
  warmingUpDesc: string;
  promiseTitle: string;
  promiseSubtitle: string;
  viksitTitle: string;
  viksitDesc: string;
  directArtisanTitle: string;
  directArtisanDesc: string;
  authenticCraftsTitle: string;
  authenticCraftsDesc: string;
}

const TRANSLATION_MAP: Record<string, Partial<WebTranslations>> = {
  // 1. English (Default)
  en: {
    home: 'Home',
    browse: 'Browse Collection',
    shopNow: 'Shop Now',
    empoweringArtisans: 'Empowering Rural Artisans',
    preservingHeritage: "Preserving India's Heritage",
    viksitBharat: 'Viksit Bharat',
    stepTowards: 'A Step Towards',
    cart: 'Cart',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    freeShipping: 'Authentic GI Tagged Crafts',
    nationalTab: '🇮🇳 National (India)',
    globalTab: '🌍 Global (Export)',
    authenticHandmade: '100% Authentic Handmade',
    directFromArtisans: 'Direct from Village Artisans',
    exportWorldwide: 'Global Export Ready',
    browseTitle: 'Browse Products',
    browseSubtitle: 'Explore authentic handcrafted treasures direct from master artisans',
    filters: 'Filters',
    searchLabel: 'Search',
    searchPlaceholder: 'Search products, handloom, pottery...',
    categoryLabel: 'Category',
    allCategories: 'All Categories',
    priceRange: 'Price Range (₹)',
    minPrice: 'Min',
    maxPrice: 'Max',
    applyFilters: 'Apply Filters',
    clearAll: 'Clear All',
    productsFound: 'products found',
    loadingProducts: 'Loading authentic crafts...',
    noProductsFound: 'No products found',
    noProductsSub: 'No crafts matched your current filters. Try resetting.',
    priceLabel: 'Price',
    artisanLabel: 'Artisan',
    authenticBadge: 'Authentic',
    backToProducts: '← Back to Products',
    descriptionLabel: 'Description',
    materialsLabel: 'Materials',
    estimatedPrice: 'Estimated Price',
    heroHeritageTag: "India's Heritage — भारत की विरासत",
    heroTitle: 'The Royal Artisan Legacy',
    heroSub: 'Directly from the Hands of Rural Masters',
    heroDesc: 'Step into the majestic world of Indian craftsmanship. We connect you directly with skilled artisans across the country, ensuring every piece you buy is authentic, handmade, and carries a rich cultural story.',
    exploreCollection: 'Explore the Collection →',
    productNotFound: 'Product Not Found',
    productNotFoundSub: 'This product is currently unavailable or has been removed.',
    buyNow: '⚡ Buy Now',
    orderThisProduct: 'Order This Product',
    tagsLabel: 'Tags',
    weightLabel: 'Weight',
    dimensionsLabel: 'Dimensions',
    sellingScopeLabel: 'Selling Scope',
    scopeLocal: 'Local Delivery',
    scopeStates: 'State Level',
    scopeIndia: 'All India',
    craftsmanshipTitle: 'The Craftsmanship — हमारी कला',
    craftsmanshipDesc: 'Witness the intricate processes passed down through generations. From delicate brush strokes to rhythmic weaving, our artisans pour their soul into every creation.',
    latestProductsTitle: 'Fresh From Artisans',
    latestProductsSubtitle: 'Freshly crafted items straight from the master artisans.',
    viewAllCollection: 'View All Collection',
    warmingUpTitle: 'Artisans Are Preparing Products',
    warmingUpSub: 'The marketplace is warming up!',
    warmingUpDesc: 'Our artisans are currently photographing and preparing their handcrafted catalogs. Scan a product in the KarigarAI app to see it appear here instantly!',
    promiseTitle: 'Our Promise to India',
    promiseSubtitle: 'More than just a marketplace, KarigarAI is a movement to digitize rural craftsmanship and build a truly self-reliant India.',
    viksitTitle: 'Viksit Bharat Vision',
    viksitDesc: 'Empowering rural economies by bridging the digital divide. We enable artisans to go online using just their native voice and a smartphone camera.',
    directArtisanTitle: 'Direct to Artisan',
    directArtisanDesc: 'No middlemen, no hidden fees. When you purchase on KarigarAI, you are directly supporting the livelihoods of traditional weavers and craftsmen.',
    authenticCraftsTitle: 'Authentic Crafts',
    authenticCraftsDesc: 'Every product tells a story. We guarantee the authenticity of our catalog, ensuring you receive genuine heritage crafts directly from the source.',
  },

  // 2. Hindi
  hi: {
    home: 'होम',
    browse: 'उत्पाद देखें',
    shopNow: 'खरीदारी करें',
    empoweringArtisans: 'ग्रामीण शिल्पकारों का सशक्तिकरण',
    preservingHeritage: 'भारत की सांस्कृतिक धरोहर',
    viksitBharat: 'विकसित भारत',
    stepTowards: 'एक कदम',
    cart: 'थैला',
    addToCart: 'थैले में जोड़ें',
    viewDetails: 'विवरण देखें',
    freeShipping: 'प्रामाणिक जीआई टैग शिल्प',
    nationalTab: '🇮🇳 राष्ट्रीय (भारत)',
    globalTab: '🌍 वैश्विक (निर्यात)',
    authenticHandmade: '100% हस्तनिर्मित व प्रामाणिक',
    directFromArtisans: 'सीधे ग्रामीण कारीगरों से',
    exportWorldwide: 'वैश्विक निर्यात योग्य',
    browseTitle: 'हस्तशिल्प उत्पाद देखें',
    browseSubtitle: 'भारत के कुशल कारीगरों द्वारा हस्तनिर्मित प्रामाणिक उत्पाद',
    filters: 'फ़िल्टर',
    searchLabel: 'खोजें',
    searchPlaceholder: 'हथकरघा, मिट्टी के बर्तन, कढ़ाई खोजें...',
    categoryLabel: 'श्रेणी / प्रकार',
    allCategories: 'सभी श्रेणियां',
    priceRange: 'मूल्य सीमा (₹)',
    minPrice: 'न्यूनतम',
    maxPrice: 'अधिकतम',
    applyFilters: 'फ़िल्टर लागू करें',
    clearAll: 'सभी हटाएं',
    productsFound: 'उत्पाद उपलब्ध हैं',
    loadingProducts: 'शिल्प लोड हो रहे हैं...',
    noProductsFound: 'कोई उत्पाद नहीं मिला',
    noProductsSub: 'दिए गए फ़िल्टर के अनुसार कोई शिल्प उपलब्ध नहीं है।',
    priceLabel: 'मूल्य',
    artisanLabel: 'कारीगर',
    authenticBadge: 'प्रामाणिक',
    backToProducts: '← सभी उत्पादों पर लौटें',
    descriptionLabel: 'शिल्प का विवरण',
    materialsLabel: 'उपयोग की गई सामग्री',
    estimatedPrice: 'अनुमानित मूल्य',
    heroHeritageTag: 'भारत की विरासत — सांस्कृतिक धरोहर',
    heroTitle: 'कारीगरों की शाही विरासत',
    heroSub: 'सीधे ग्रामीण कारीगरों के हाथों से',
    heroDesc: 'भारतीय हस्तकला की भव्य दुनिया में कदम रखें। हम आपको देश भर के कुशल शिल्पकारों से सीधे जोड़ते हैं ताकि हर खरीद प्रामाणिक, हस्तनिर्मित और सांस्कृतिक कहानी से सजी हो।',
    exploreCollection: 'संग्रह का अन्वेषण करें →',
    productNotFound: 'उत्पाद नहीं मिला',
    productNotFoundSub: 'यह उत्पाद वर्तमान में उपलब्ध नहीं है।',
    buyNow: '⚡ अभी खरीदें',
    orderThisProduct: 'यह उत्पाद ऑर्डर करें',
    tagsLabel: 'टैग',
    weightLabel: 'वज़न',
    dimensionsLabel: 'आकार',
    sellingScopeLabel: 'विक्रय क्षेत्र',
    scopeLocal: 'स्थानीय वितरण',
    scopeStates: 'राज्य स्तर',
    scopeIndia: 'अखिल भारतीय',
    craftsmanshipTitle: 'हमारी कला — हस्तशिल्प की कहानी',
    craftsmanshipDesc: 'पीढ़ियों से चली आ रही पारंपरिक कारीगरी के साक्षी बनें। नाजुक ब्रश स्ट्रोक से लेकर लयबद्ध बुनाई तक, हमारे कारीगर हर रचना में अपनी आत्मा उड़ेलते हैं।',
    latestProductsTitle: 'नवीनतम उत्पाद',
    latestProductsSubtitle: 'सीधे कारीगरों के हाथों से तैयार किए गए ताज़ा उत्पाद।',
    viewAllCollection: 'संपूर्ण संग्रह देखें',
    warmingUpTitle: 'कारीगर अपने उत्पाद तैयार कर रहे हैं',
    warmingUpSub: 'मार्केटप्लेस तैयार हो रहा है!',
    warmingUpDesc: 'हमारे कारीगर वर्तमान में अपने हस्तनिर्मित उत्पादों की सूची तैयार कर रहे हैं। KarigarAI ऐप से उत्पाद स्कैन करते ही वह तुरंत यहाँ दिखाई देगा!',
    promiseTitle: 'भारत के प्रति हमारा संकल्प',
    promiseSubtitle: 'सिर्फ एक बाज़ार नहीं, KarigarAI ग्रामीण शिल्प कौशल को डिजिटल बनाने और आत्मनिर्भर भारत के निर्माण का एक आंदोलन है।',
    viksitTitle: 'विकसित भारत संकल्प',
    viksitDesc: 'डिजिटल विभाजन को पाटकर ग्रामीण अर्थव्यवस्था को सशक्त बनाना। कारीगर अपनी मूल आवाज़ और स्मार्टफोन कैमरे से ऑनलाइन जुड़ सकते हैं।',
    directArtisanTitle: 'सीधे कारीगर तक लाभ',
    directArtisanDesc: 'कोई बिचौलिया नहीं, कोई छुपा शुल्क नहीं। KarigarAI पर आपकी हर खरीद पारंपरिक बुनकरों और कारीगरों की आजीविका का सीधा संबल है।',
    authenticCraftsTitle: '100% प्रामाणिक शिल्प',
    authenticCraftsDesc: 'हर उत्पाद एक जीवंत कहानी कहता है। हम प्रामाणिकता की गारंटी देते हैं ताकि आप सीधे स्रोत से असली विरासत उत्पाद प्राप्त करें।',
  },

  // 3. Bengali
  bn: {
    home: 'হোম',
    browse: 'সংগ্রহ দেখুন',
    shopNow: 'কেনাকাটা করুন',
    empoweringArtisans: 'গ্রামীণ কারিগরদের ক্ষমতায়ন',
    preservingHeritage: 'ভারতের ঐতিহ্য সংরক্ষণ',
    viksitBharat: 'বিকশিত ভারত',
    stepTowards: 'একটি পদক্ষেপ',
    cart: 'ব্যাগ',
    addToCart: 'ব্যাগে যোগ করুন',
    viewDetails: 'বিস্তারিত দেখুন',
    freeShipping: 'প্রামাণিক জিআই ট্যাগযুক্ত পণ্য',
    nationalTab: '🇮🇳 জাতীয় (ভারত)',
    globalTab: '🌍 গ্লোবাল (রপ্তানি)',
    authenticHandmade: '১০০% খাঁটি হস্তনির্মিত',
    directFromArtisans: 'সরাসরি কারিগরদের থেকে',
    exportWorldwide: 'আন্তর্জাতিক রপ্তানিযোগ্য',
    browseTitle: 'হস্তশিল্প পণ্য দেখুন',
    browseSubtitle: 'গ্রামের দক্ষ কারিগরদের তৈরি খাঁটি ঐতিহ্যবাহী শিল্পকর্ম',
    filters: 'ফিল্টার',
    searchLabel: 'অনুসন্ধান',
    searchPlaceholder: 'তাঁত, মৃৎশিল্প, কাঁথা অনুসন্ধান করুন...',
    categoryLabel: 'বিভাগ',
    allCategories: 'সকল বিভাগ',
    priceRange: 'মূল্য সীমা (₹)',
    minPrice: 'সর্বনিম্ন',
    maxPrice: 'সর্বোচ্চ',
    applyFilters: 'ফিল্টার প্রয়োগ করুন',
    clearAll: 'সব সাফ করুন',
    productsFound: 'টি পণ্য পাওয়া গেছে',
    loadingProducts: 'পণ্য লোড হচ্ছে...',
    noProductsFound: 'কোনো পণ্য পাওয়া যায়নি',
    noProductsSub: 'আপনার ফিল্টারের সাথে কোনো পণ্য মেলেনি।',
    priceLabel: 'মূল্য',
    artisanLabel: 'কারিগর',
    authenticBadge: 'খাঁটি শিল্প',
    backToProducts: '← পণ্যের তালিকায় ফিরুন',
    descriptionLabel: 'বিবরণ',
    materialsLabel: 'উপাদানসমূহ',
    estimatedPrice: 'আনুমানিক মূল্য',
    heroHeritageTag: 'ভারতের ঐতিহ্য — পরম্পরা',
    heroTitle: 'কারিগরদের রাজকীয় ঐতিহ্য',
    heroSub: 'সরাসরি গ্রামীণ কারিগরদের হাতে তৈরি',
    heroDesc: 'ভারতীয় লোকশিল্পের রাজকীয় সম্ভার সরাসরি কারিগরদের থেকে আপনার দোরগোড়ায়।',
    exploreCollection: 'সংগ্রহ দেখুন →',
  },

  // 4. Marathi
  mr: {
    home: 'होम',
    browse: 'संग्रह पहा',
    shopNow: 'खरेदी करा',
    empoweringArtisans: 'ग्रामीण कारागिरांचे सक्षमीकरण',
    preservingHeritage: 'भारताचा सांस्कृतिक वारसा',
    viksitBharat: 'विकसित भारत',
    stepTowards: 'एक पाऊल',
    cart: 'कार्ट',
    addToCart: 'कार्टमध्ये जोडा',
    viewDetails: 'तपशील पहा',
    freeShipping: 'अस्सल जीआय प्रमाणित हस्तकला',
    nationalTab: '🇮🇳 राष्ट्रीय (भारत)',
    globalTab: '🌍 जागतिक (निर्यात)',
    authenticHandmade: '१००% अस्सल हस्तनिर्मित',
    directFromArtisans: 'थेट गावच्या कारागिरांकडून',
    exportWorldwide: 'जागतिक निर्यातीस सज्ज',
    browseTitle: 'हस्तकला उत्पादने पहा',
    browseSubtitle: 'भारतीय कारागिरांनी हाताने बनवलेल्या अस्सल वस्तू',
    filters: 'फिल्टर',
    searchLabel: 'शोधा',
    searchPlaceholder: 'हातमाग, मातीची भांडी, कलाकृती शोधा...',
    categoryLabel: 'श्रेणी / प्रकार',
    allCategories: 'सर्व श्रेणी',
    priceRange: 'किंमत मर्यादा (₹)',
    minPrice: 'किमान',
    maxPrice: 'कमाल',
    applyFilters: 'फिल्टर लावा',
    clearAll: 'सर्व हटवा',
    productsFound: 'उत्पादने उपलब्ध',
    loadingProducts: 'वस्तू लोड होत आहेत...',
    noProductsFound: 'कोणतेही उत्पादन सापडले नाही',
    noProductsSub: 'निवडलेल्या फिल्टरनुसार वस्तू उपलब्ध नाहीत.',
    priceLabel: 'किंमत',
    artisanLabel: 'कारागीर',
    authenticBadge: 'अस्सल',
    backToProducts: '← मागे उत्पादनांवर जा',
    descriptionLabel: 'कलाकृतीची माहिती',
    materialsLabel: 'वापरलेले साहित्य',
    estimatedPrice: 'अंदाजे किंमत',
    heroHeritageTag: 'भारताचा सांस्कृतिक वारसा',
    heroTitle: 'कारागिरांचा ऐतिहासिक वारसा',
    heroSub: 'थेट ग्रामीण कारागिरांच्या हातून',
    heroDesc: 'भारतीय हस्तकलेच्या शाही विश्वात आपले स्वागत आहे. प्रत्येक खरेदीतून थेट कारागिरांना बळ मिळते.',
    exploreCollection: 'संग्रह एक्सप्लोर करा →',
  },

  // 5. Tamil
  ta: {
    home: 'முகப்பு',
    browse: 'தொகுப்பை உலாவு',
    shopNow: 'இப்போதே வாங்குங்கள்',
    empoweringArtisans: 'கிராமப்புற கைவினைஞர்களுக்கு அதிகாரம்',
    preservingHeritage: 'இந்தியாவின் பாரம்பரியத்தை பாதுகாத்தல்',
    viksitBharat: 'வளர்ச்சியடைந்த இந்தியா',
    stepTowards: 'ஒரு படி முன்னோக்கி',
    cart: 'கூடை',
    addToCart: 'கூடையில் சேர்க்கவும்',
    viewDetails: 'விவரங்களைப் பார்க்க',
    freeShipping: 'புவிசார் குறியீடு பெற்ற கைவினைப்பொருட்கள்',
    nationalTab: '🇮🇳 தேசியம் (இந்தியா)',
    globalTab: '🌍 உலகளாவிய (ஏற்றுமதி)',
    authenticHandmade: '100% கைவினைப்பொருள்',
    directFromArtisans: 'நேரடியாக கைவினைஞர்களிடமிருந்து',
    exportWorldwide: 'உலகளாவிய ஏற்றுமதி தயார்',
    browseTitle: 'கைவினைப்பொருட்களை உலாவுக',
    browseSubtitle: 'கைவினைஞர்களிடமிருந்து நேரடியாக பாரம்பரிய கலைப்படைப்புகள்',
    filters: 'வடிகட்டிகள்',
    searchLabel: 'தேடுங்கள்',
    searchPlaceholder: 'கைத்தறி, மண்பாண்டங்கள், எம்பிராய்டரி தேடுங்கள்...',
    categoryLabel: 'வகை',
    allCategories: 'அனைத்து வகைகள்',
    priceRange: 'விலை வரம்பு (₹)',
    minPrice: 'குறைந்தபட்சம்',
    maxPrice: 'அதிகபட்சம்',
    applyFilters: 'வடிகட்டிகளைப் பயன்படுத்து',
    clearAll: 'அனைத்தையும் அழிக்கவும்',
    productsFound: 'பொருட்கள் உள்ளன',
    loadingProducts: 'பொருட்கள் ஏற்றப்படுகின்றன...',
    noProductsFound: 'பொருட்கள் எதுவும் கிடைக்கவில்லை',
    noProductsSub: 'உங்கள் தேடலுக்கு ஏற்ற பொருட்கள் எதுவும் இல்லை.',
    priceLabel: 'விலை',
    artisanLabel: 'கைவினைஞர்',
    authenticBadge: 'அசல்',
    backToProducts: '← பொருட்களுக்குத் திரும்பு',
    descriptionLabel: 'விளக்கம்',
    materialsLabel: 'பொருட்கள்',
    estimatedPrice: 'மதிப்பிடப்பட்ட விலை',
    heroHeritageTag: 'இந்தியாவின் பாரம்பரியம்',
    heroTitle: 'கைவினைஞர்களின் பாரம்பரியப் பெருமை',
    heroSub: 'நேரடியாக கிராமப்புற கைவினைஞர்களின் கைகளில் இருந்து',
    heroDesc: 'இந்தியாவின் கைவினைப் பாரம்பரியத்தை நேரடியாக உங்கள் இல்லத்திற்கு கொண்டு வருகிறோம்.',
    exploreCollection: 'தொகுப்பை ஆராயுங்கள் →',
  },

  // 6. Telugu
  te: {
    home: 'హోమ్',
    browse: 'సేకరణ చూడండి',
    shopNow: 'షాపింగ్ చేయండి',
    empoweringArtisans: 'గ్రామీణ కళాకారుల సాధికారత',
    preservingHeritage: 'భారతీయ వారసత్వ పరిరక్షణ',
    viksitBharat: 'వికసిత భారత్',
    stepTowards: 'ఒక అడుగు',
    cart: 'కార్ట్',
    addToCart: 'కార్ట్ లో చేర్చండి',
    viewDetails: 'వివరాలు చూడండి',
    freeShipping: 'అసలైన జీఐ ట్యాగ్ చేతివృత్తులు',
    nationalTab: '🇮🇳 జాతీయ (భారత్)',
    globalTab: '🌍 గ్లోబల్ (ఎగుమతి)',
    authenticHandmade: '100% అసలైన చేతిపనులు',
    directFromArtisans: 'నేరుగా గ్రామీణ కళాకారుల నుండి',
    exportWorldwide: 'ప్రపంచ స్థాయి ఎగుమతి సిద్ధం',
    browseTitle: 'హస్తకళల ఉత్పత్తులు',
    browseSubtitle: 'నైపుణ్యం కలిగిన కళాకారుల ద్వారా చేతితో తయారు చేయబడిన కళాఖండాలు',
    filters: 'ఫిల్టర్లు',
    searchLabel: 'వెతకండి',
    searchPlaceholder: 'చేనేత, మట్టిపాత్రలు, కళాఖండాలు వెతకండి...',
    categoryLabel: 'వర్గం',
    allCategories: 'అన్ని వర్గాలు',
    priceRange: 'ధర పరిధి (₹)',
    minPrice: 'కనిష్ట',
    maxPrice: 'గరిష్ట',
    applyFilters: 'ఫిల్టర్లు వర్తించు',
    clearAll: 'అన్నీ క్లియర్ చేయండి',
    productsFound: 'ఉత్పత్తులు కనుగొనబడ్డాయి',
    loadingProducts: 'ఉత్పత్తులు లోడ్ అవుతున్నాయి...',
    noProductsFound: 'ఉత్పత్తులు ఏవీ లేవు',
    noProductsSub: 'మీ శోధనకు తగిన ఉత్పత్తులు లభించలేదు.',
    priceLabel: 'ధర',
    artisanLabel: 'కళాకారుడు',
    authenticBadge: 'అసలైనది',
    backToProducts: '← ఉత్పత్తులకు తిరిగి వెళ్లండి',
    descriptionLabel: 'వివరణ',
    materialsLabel: 'ఉపయోగించిన వస్తువులు',
    estimatedPrice: 'అంచనా ధర',
    heroHeritageTag: 'భారతీయ ఘన వారసత్వం',
    heroTitle: 'భారతీయ చేతివృత్తుల వైభవం',
    heroSub: 'నేరుగా గ్రామీణ కళాకారుల చేతుల మీదుగా',
    heroDesc: 'భారతదేశ సంప్రదాయ హస్తకళల అద్భుత ప్రపంచాన్ని అనుభవించండి.',
    exploreCollection: 'సేకరణను అన్వేషించండి →',
  },

  // 7. Spanish (Export)
  es: {
    home: 'Inicio',
    browse: 'Colección',
    shopNow: 'Comprar',
    empoweringArtisans: 'Empoderando Artesanos Rurales',
    preservingHeritage: 'Preservando la Herencia de la India',
    viksitBharat: 'India Desarrollada',
    stepTowards: 'Un Paso Hacia',
    cart: 'Carrito',
    addToCart: 'Añadir al Carrito',
    viewDetails: 'Ver Detalles',
    freeShipping: 'Artesanías Auténticas Certificadas',
    nationalTab: '🇮🇳 Nacional (India)',
    globalTab: '🌍 Global (Exportación)',
    authenticHandmade: '100% Artesanal Auténtico',
    directFromArtisans: 'Directo de Artesanos Indios',
    exportWorldwide: 'Exportación Global Garantizada',
    browseTitle: 'Explorar Productos',
    browseSubtitle: 'Auténticas artesanías hechas a mano directamente de maestros artesanos indios',
    filters: 'Filtros',
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar artesanías, textiles, cerámica...',
    categoryLabel: 'Categoría',
    allCategories: 'Todas las Categorías',
    priceRange: 'Rango de Precio (₹)',
    minPrice: 'Mín',
    maxPrice: 'Máx',
    applyFilters: 'Aplicar Filtros',
    clearAll: 'Limpiar Todo',
    productsFound: 'productos encontrados',
    loadingProducts: 'Cargando artesanías auténticas...',
    noProductsFound: 'No se encontraron productos',
    noProductsSub: 'No hay artesanías que coincidan con sus filtros actuales.',
    priceLabel: 'Precio',
    artisanLabel: 'Artesano',
    authenticBadge: 'Auténtico',
    backToProducts: '← Volver a Productos',
    descriptionLabel: 'Descripción',
    materialsLabel: 'Materiales',
    estimatedPrice: 'Precio Estimado',
    heroHeritageTag: 'Patrimonio de la India',
    heroTitle: 'El Legado Real de los Artesanos',
    heroSub: 'Directo de las Manos de Maestros Rurales',
    heroDesc: 'Entra en el majestuoso mundo de la artesanía india con piezas auténticas y cargadas de historia.',
    exploreCollection: 'Explorar la Colección →',
  },

  // 8. French (Export)
  fr: {
    home: 'Accueil',
    browse: 'Collection',
    shopNow: 'Acheter',
    empoweringArtisans: 'Soutien aux Artisans Ruraux',
    preservingHeritage: "Préservation du Patrimoine de l'Inde",
    viksitBharat: 'Inde Développée',
    stepTowards: 'Un Pas Vers',
    cart: 'Panier',
    addToCart: 'Ajouter au Panier',
    viewDetails: 'Voir les Détails',
    freeShipping: 'Artisanat d’Origine Certifié',
    nationalTab: '🇮🇳 National (Inde)',
    globalTab: '🌍 Mondial (Export)',
    authenticHandmade: '100% Fait Main Authentique',
    directFromArtisans: 'Directement des Artisans',
    exportWorldwide: 'Prêt pour l’Export Mondial',
    browseTitle: 'Parcourir les Produits',
    browseSubtitle: 'Découvrez des trésors d’artisanat d’art directement créés par des maîtres artisans',
    filters: 'Filtres',
    searchLabel: 'Rechercher',
    searchPlaceholder: 'Rechercher tissages, poteries, broderies...',
    categoryLabel: 'Catégorie',
    allCategories: 'Toutes les Catégories',
    priceRange: 'Fourchette de Prix (₹)',
    minPrice: 'Min',
    maxPrice: 'Max',
    applyFilters: 'Appliquer les Filtres',
    clearAll: 'Effacer Tout',
    productsFound: 'produits trouvés',
    loadingProducts: 'Chargement des produits artisanaux...',
    noProductsFound: 'Aucun produit trouvé',
    noProductsSub: 'Aucun article ne correspond à vos filtres actuels.',
    priceLabel: 'Prix',
    artisanLabel: 'Artisan',
    authenticBadge: 'Authentique',
    backToProducts: '← Retour aux Produits',
    descriptionLabel: 'Description',
    materialsLabel: 'Matériaux',
    estimatedPrice: 'Prix Estimé',
    heroHeritageTag: 'Patrimoine de l’Inde',
    heroTitle: 'L’Héritage Royal des Artisans',
    heroSub: 'Directement des Mains des Maîtres Artisans',
    heroDesc: 'Plongez dans l’univers fascinant de l’artisanat indien traditionnel.',
    exploreCollection: 'Découvrir la Collection →',
  },

  // 9. German (Export)
  de: {
    home: 'Startseite',
    browse: 'Kollektion',
    shopNow: 'Jetzt Kaufen',
    empoweringArtisans: 'Stärkung ländlicher Handwerker',
    preservingHeritage: 'Bewahrung des indischen Erbes',
    viksitBharat: 'Entwickeltes Indien',
    stepTowards: 'Ein Schritt in Richtung',
    cart: 'Warenkorb',
    addToCart: 'In den Warenkorb',
    viewDetails: 'Details anzeigen',
    freeShipping: 'Zertifiziertes traditionelles Kunsthandwerk',
    nationalTab: '🇮🇳 National (Indien)',
    globalTab: '🌍 Global (Export)',
    authenticHandmade: '100% Echte Handarbeit',
    directFromArtisans: 'Direkt von den Handwerkern',
    exportWorldwide: 'Bereit für den weltweiten Export',
    browseTitle: 'Produkte Durchsuchen',
    browseSubtitle: 'Entdecken Sie authentische handgefertigte Kunstschätze direkt von Meistern',
    filters: 'Filter',
    searchLabel: 'Suche',
    searchPlaceholder: 'Suche nach Handweberei, Keramik, Stickerei...',
    categoryLabel: 'Kategorie',
    allCategories: 'Alle Kategorien',
    priceRange: 'Preisbereich (₹)',
    minPrice: 'Min',
    maxPrice: 'Max',
    applyFilters: 'Filter Anwenden',
    clearAll: 'Alles Zurücksetzen',
    productsFound: 'Produkte gefunden',
    loadingProducts: 'Authentische Kunstwerke werden geladen...',
    noProductsFound: 'Keine Produkte gefunden',
    noProductsSub: 'Keine Kunstwerke entsprechen Ihren aktuellen Filtern.',
    priceLabel: 'Preis',
    artisanLabel: 'Handwerker',
    authenticBadge: 'Authentisch',
    backToProducts: '← Zurück zu den Produkten',
    descriptionLabel: 'Beschreibung',
    materialsLabel: 'Materialien',
    estimatedPrice: 'Geschätzter Preis',
    heroHeritageTag: 'Indisches Kulturerbe',
    heroTitle: 'Das königliche Erbe der Kunsthandwerker',
    heroSub: 'Direkt aus den Händen ländlicher Meister',
    heroDesc: 'Erleben Sie die Vielfalt echter indischer Handwerkskunst direkt aus den Werkstätten.',
    exploreCollection: 'Kollektion Entdecken →',
  },

  // 10. Japanese (Export)
  ja: {
    home: 'ホーム',
    browse: 'コレクション',
    shopNow: '今すぐ購入',
    empoweringArtisans: '農村の伝統工芸士を支援',
    preservingHeritage: 'インドの文化遺産の継承',
    viksitBharat: '発展したインド',
    stepTowards: '未来への一歩',
    cart: 'カート',
    addToCart: 'カートに追加',
    viewDetails: '詳細を見る',
    freeShipping: '認定伝統工芸品',
    nationalTab: '🇮🇳 インド国内向け',
    globalTab: '🌍 世界輸出向け',
    authenticHandmade: '100% 本物のハンドメイド',
    directFromArtisans: '村の職人から直接お届け',
    exportWorldwide: '世界中へ発送可能',
    browseTitle: '工芸品一覧',
    browseSubtitle: 'インド各地の熟練工芸士による本物の手作り工芸品',
    filters: 'フィルター',
    searchLabel: '検索',
    searchPlaceholder: '手織り、陶器、刺繍を検索...',
    categoryLabel: 'カテゴリー',
    allCategories: 'すべてのカテゴリー',
    priceRange: '価格帯 (₹)',
    minPrice: '最小',
    maxPrice: '最大',
    applyFilters: 'フィルターを適用',
    clearAll: 'すべて解除',
    productsFound: '件の商品が見つかりました',
    loadingProducts: '工芸品を読み込み中...',
    noProductsFound: '商品が見つかりませんでした',
    noProductsSub: '条件に合う工芸品は見つかりませんでした。',
    priceLabel: '価格',
    artisanLabel: '職人',
    authenticBadge: '本物保証',
    backToProducts: '← 商品一覧に戻る',
    descriptionLabel: '商品説明',
    materialsLabel: '使用素材',
    estimatedPrice: '参考価格',
    heroHeritageTag: 'インドの伝統遺産',
    heroTitle: '王室に愛された職人たちの遺産',
    heroSub: '農村の熟練職人の手から直接お届け',
    heroDesc: 'インドの豊かな伝統と職人技の世界へ。すべての作品が本物の手作りです。',
    exploreCollection: 'コレクションを見る →',
  },

  // 11. Arabic (Export)
  ar: {
    home: 'الرئيسية',
    browse: 'المجموعة',
    shopNow: 'تسوق الآن',
    empoweringArtisans: 'تمكين الحرفيين الريفيين',
    preservingHeritage: 'الحفاظ على تراث الهند',
    viksitBharat: 'الهند المتطورة',
    stepTowards: 'خطوة نحو',
    cart: 'السلة',
    addToCart: 'أضف إلى السلة',
    viewDetails: 'عرض التفاصيل',
    freeShipping: 'حرف يدوية أصيلة معتمدة',
    nationalTab: '🇮🇳 محلي (الهند)',
    globalTab: '🌍 دولي (تصدير)',
    authenticHandmade: 'صناعة يدوية أصيلة 100%',
    directFromArtisans: 'مباشرة من الحرفيين',
    exportWorldwide: 'جاهز للتصدير العالمي',
    browseTitle: 'تصفح المنتجات الحرفية',
    browseSubtitle: 'استكشف الكنوز الحرفية الأصيلة المصنوعة يدوياً مباشرة من كبار الحرفيين',
    filters: 'تصفية',
    searchLabel: 'بحث',
    searchPlaceholder: 'ابحث عن النسيج اليدوي، الفخار، التطريز...',
    categoryLabel: 'الفئة',
    allCategories: 'جميع الفئات',
    priceRange: 'نطاق السعر (₹)',
    minPrice: 'الأدنى',
    maxPrice: 'الأعلى',
    applyFilters: 'تطبيق الفلتر',
    clearAll: 'مسح الكل',
    productsFound: 'منتج تم العثور عليه',
    loadingProducts: 'جارٍ تحميل الحرف الأصيلة...',
    noProductsFound: 'لم يتم العثور على منتجات',
    noProductsSub: 'لا توجد منتجات تطابق الفلاتر المحددة.',
    priceLabel: 'السعر',
    artisanLabel: 'الحرفي',
    authenticBadge: 'أصيل 100%',
    backToProducts: '← العودة إلى المنتجات',
    descriptionLabel: 'الوصف',
    materialsLabel: 'المواد المستخدمة',
    estimatedPrice: 'السعر التقديري',
    heroHeritageTag: 'تراث الهند العريق',
    heroTitle: 'الإرث الملكي للحرفيين',
    heroSub: 'مباشرة من أيدي كبار الحرفيين',
    heroDesc: 'ادخل إلى عالم الحرف اليدوية الهندية الفاخرة، حيث كل قطعة تحمل قصة ثقافية غنية.',
    exploreCollection: 'استكشف المجموعة →',
  },
};

/* ------------------------------------------------------------------------- */
/* Dynamic Marketplace Category Translation Dictionary                      */
/* ------------------------------------------------------------------------- */
const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  Jewelry: {
    hi: 'आभूषण / गहने',
    bn: 'গহনা',
    mr: 'दागिने',
    ta: 'நகைகள்',
    te: 'ఆభరణాలు',
    gu: 'ઘરેણાં',
    es: 'Joyería',
    fr: 'Bijoux',
    de: 'Schmuck',
    ja: 'ジュエリー',
    ar: 'مجوهرات',
  },
  Sarees: {
    hi: 'साड़ियां',
    bn: 'শাড়ি',
    mr: 'साड्या',
    ta: 'புடவைகள்',
    te: 'చీరలు',
    gu: 'સાડીઓ',
    es: 'Saris',
    fr: 'Saris',
    de: 'Saris',
    ja: 'サリー',
    ar: 'ساري',
  },
  Accessories: {
    hi: 'एक्सेसरीज़ / आभूषण',
    bn: 'অনুষঙ্গ',
    mr: 'अॅक्सेसरीज',
    ta: 'துணைப் பொருட்கள்',
    te: 'ఉపకరణాలు',
    gu: 'એસેસરીઝ',
    es: 'Accesorios',
    fr: 'Accessoires',
    de: 'Accessoires',
    ja: 'アクセサリー',
    ar: 'إكسسوارات',
  },
  Bags: {
    hi: 'बैग व थैले',
    bn: 'ব্যাগ',
    mr: 'पिशव्या / बॅग्ज',
    ta: 'பைகள்',
    te: 'బ్యాగులు',
    gu: 'બેગ',
    es: 'Bolsos',
    fr: 'Sacs',
    de: 'Taschen',
    ja: 'バッグ',
    ar: 'حقائب',
  },
  Clothing: {
    hi: 'वस्त्र व परिधान',
    bn: 'পোশাক',
    mr: 'कपडे',
    ta: 'ஆடைகள்',
    te: 'దుస్తులు',
    gu: 'કપડાં',
    es: 'Ropa',
    fr: 'Vêtements',
    de: 'Kleidung',
    ja: '衣類',
    ar: 'ملابس',
  },
  'Home Decor': {
    hi: 'गृह सज्जा',
    bn: 'ঘরের সাজসজ্জা',
    mr: 'गृह सजावट',
    ta: 'வீட்டு அலங்காரம்',
    te: 'గృహాలంకరణ',
    gu: 'ઘਰ સજાવટ',
    es: 'Decoración del Hogar',
    fr: 'Décoration Intérieure',
    de: 'Wohnkultur',
    ja: 'インテリア・室内装飾',
    ar: 'ديكور المنزل',
  },
  Pottery: {
    hi: 'मिट्टी के बर्तन / मृत्तिका शिल्प',
    bn: 'মৃৎশিল্প',
    mr: 'मातीची भांडी',
    ta: 'மண்பாண்டங்கள்',
    te: 'మట్టిపాత్రలు',
    gu: 'માટીકામ',
    es: 'Cerámica',
    fr: 'Poterie',
    de: 'Keramik',
    ja: '陶器・焼き物',
    ar: 'فخار وخزف',
  },
  Paintings: {
    hi: 'पारंपरिक चित्रकला',
    bn: 'চিত্রশিল্প',
    mr: 'पारंपारिक चित्रे',
    ta: 'ஓவியங்கள்',
    te: 'చిత్రలేఖనం',
    gu: 'ચિત્રકળા',
    es: 'Pinturas',
    fr: 'Peintures',
    de: 'Malereien',
    ja: '絵画',
    ar: 'لوحات فنية',
  },
};

/* ------------------------------------------------------------------------- */
/* Dynamic Product Title Translation Dictionary (For Buyer View)             */
/* ------------------------------------------------------------------------- */
const PRODUCT_TITLE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Handcrafted Lac Bangles with Traditional Meenakari and Stone Work': {
    hi: 'पारंपरिक मीनाकारी और स्टोन वर्क वाली लाख की चूड़ियाँ',
    bn: 'ঐতিহ্যবাহী মীনাকারি এবং পাথরের কাজ করা লাহার চুড়ি',
    mr: 'पारंपारिक मीनाकारी आणि खड्यांचे काम असलेल्या लाखेच्या बांगड्या',
    ta: 'பாரம்பரிய மீனாகாரி மற்றும் கல் வேலைப்பாடுகள் கொண்ட லாக் வளையல்கள்',
    te: 'సాంప్రదాయ మీనాకారి మరియు రాతి పనితనంతో కూడిన లాక్ గాజులు',
    gu: 'પરંપરાગત મીનાકારી અને સ્ટોન વર્કવાળી લાખની બંગડીઓ',
    es: 'Brazaletes de Laca Artesanales con Meenakari Tradicional y Pedrería',
    fr: 'Bracelets en Laque Faits Main avec Meenakari Traditionnel et Pierres',
    de: 'Handgefertigte Lackarmreifen mit traditioneller Meenakari- und Steinarbeit',
    ja: '伝統的なミーナカーリーとストーンワークが施された手作りのラックバングル',
    ar: 'أساور لاك يدوية الصنع مع ميناكاري تقليدي وتطعيم بالأحجار',
  },
  'Elegant Red Patterned Saree': {
    hi: 'आकर्षक लाल डिज़ाइनर पारंपरिक साड़ी',
    bn: 'মার্জিত লাল নকশাদার শাড়ি',
    mr: 'मोहक लाल नक्षीदार पारंपरिक साडी',
    ta: 'நேர்த்தியான சிவப்பு வடிவமைப்பு புடவை',
    te: 'సొగసైన ఎరుపు నమూనా పట్టు చీర',
    gu: 'આકર્ષક લાલ ભાતવાળી સાડી',
    es: 'Elegante Sari Rojo Estampado Tradicional',
    fr: 'Élégant Sari Rouge à Motifs Traditionnels',
    de: 'Eleganter roter gemusterter Sari',
    ja: 'エレガントな赤い模様の手織りサリー',
    ar: 'ساري أحمر أنيق بنقوش تقليدية فاخرة',
  },
  'Handcrafted Cotton Tote Bag': {
    hi: 'हस्तनिर्मित कॉटन टोट बैग',
    bn: 'হস্তনির্মিত সুতির টোট ব্যাগ',
    mr: 'हाताने बनवलेली कॉटन तोत पिशवी',
    ta: 'கைவினைப் பருத்தி டோட் பை',
    te: 'చేతితో తయారు చేసిన కాటన్ టోట్ బ్యాగ్',
    gu: 'હાથથી બનાવેલ કોટન ટોટ બેગ',
    es: 'Bolso Tote de Algodón Artesanal',
    fr: 'Sac Fourre-tout en Coton Artisanal',
    de: 'Handgefertigte Baumwoll-Totetasche',
    ja: '手作りのコットン製トートバッグ',
    ar: 'حقيبة كتف قطنية مصنوعة يدوياً',
  },
  'Handwoven Dupatta': {
    hi: 'हाथ से बुना पारंपरिक दुपट्टा',
    bn: 'হাতে বোনা ঐতিহ্যবাহী ওড়না',
    mr: 'हाताने विणलेला पारंपरिक दुपट्टा',
    ta: 'கைத்தறி துப்பட்டா',
    te: 'చేనేత దుపట్టా',
    gu: 'હાથવણાટનો દુપટ્ટો',
    es: 'Dupatta Tejido a Mano',
    fr: 'Dupatta Tissé à la Main',
    de: 'Handgewebte traditionelle Dupatta',
    ja: '手織りの伝統的なドゥパッタ',
    ar: 'دوباتا منسوج يدوياً بنقوش هندية',
  },
  'Kantha Quilt': {
    hi: 'पारंपरिक बंगाल कांथा रजाई',
    bn: 'ঐতিহ্যবাহী নকশিকাঁথা',
    mr: 'पारंपारिक कांथा गोधडी',
    ta: 'பாரம்பரிய காந்தா குயில்ட்',
    te: 'సాంప్రదాయ కాంతా రజాయి',
    gu: 'પરંપરાગત કાંથા રજાઈ',
    es: 'Colcha Kantha Tradicional',
    fr: 'Courtepointe Kantha Traditionnelle',
    de: 'Traditionelle Kantha-Steppdecke',
    ja: 'ベンガル地方の伝統的なカンタキルト',
    ar: 'لحاف كانثا بنغالي تقليدي مطرز',
  },
  'Jute Shoulder Bag': {
    hi: 'पर्यावरण-अनुकूल जूट शोल्डर बैग',
    bn: 'পরিবেশ-বান্ধব পাটের ব্যাগ',
    mr: 'पर्यावरणपूरक तागाची पिशवी',
    ta: 'சுற்றுச்சூழல் நட்பு சணல் தோள்பை',
    te: 'పర్యావరణ అనుకూల జనపనార బ్యాగ్',
    gu: 'પર્યાવરણ-અનુકૂળ શણની બેગ',
    es: 'Bolso de Hombro de Yute Ecológico',
    fr: 'Sac à Bandoulière Écologique en Jute',
    de: 'Umweltfreundliche Jute-Schultertasche',
    ja: '環境に優しいジュート製ショルダーバッグ',
    ar: 'حقيبة كتف صديقة للبيئة من الجوت',
  },
  'Embroidered Potli': {
    hi: 'कढ़ाई वाली खूबसूरत पोटली बैग',
    bn: 'সূচিকর্ম করা সুন্দর পটলি ব্যাগ',
    mr: 'भरतकाम केलेली सुंदर पोटली पिशवी',
    ta: 'எம்பிராய்டரி பொட்லி பை',
    te: 'ఎంబ్రాయిడరీ పోట్లీ బ్యాగ్',
    gu: 'ભરતકામવાળી સુંદર પોટલી',
    es: 'Bolsito Potli Bordado Tradicional',
    fr: 'Pochette Potli Traditionnelle Brodée',
    de: 'Traditionell bestickte Potli-Tasche',
    ja: '伝統的な刺繍入りポトリ巾着',
    ar: 'حقيبة بوتلي تقليدية مطرزة',
  },
  'Handloom Saree': {
    hi: 'अस्सल हथकरघा साड़ी',
    bn: 'খাঁটি তাঁতের শাড়ি',
    mr: 'अस्सल हातमाग साडी',
    ta: 'கைத்தறி பாரம்பரியப் புடவை',
    te: 'చేనేత సంప్రదాయ చీర',
    gu: 'અસલી હાથવણાટ સાડી',
    es: 'Sari de Telar Manual Tradicional',
    fr: 'Sari Traditionnel Tissé à la Main',
    de: 'Handgewebter indischer Sari',
    ja: '職人による手織りの伝統的なサリー',
    ar: 'ساري هندي منسوج على النول اليدوي',
  },
};

interface LanguageContextType {
  currentLang: WebLanguage;
  setLanguage: (lang: WebLanguage) => void;
  t: WebTranslations;
  translateCategory: (category?: string | null) => string;
  translateProductTitle: (title?: string | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<WebLanguage>(() => {
    try {
      const savedCode = localStorage.getItem(STORAGE_KEY);
      if (savedCode) {
        const found = ALL_WEB_LANGUAGES.find((l) => l.code === savedCode);
        if (found) return found;
      }
    } catch {
      // LocalStorage unavailable
    }
    return DEFAULT_WEB_LANGUAGE;
  });

  const handleSetLanguage = (lang: WebLanguage) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang.code);
    } catch {
      // LocalStorage unavailable
    }
  };

  const currentStrings: WebTranslations = {
    ...TRANSLATION_MAP.en,
    ...(TRANSLATION_MAP[currentLang.code] || {}),
  } as WebTranslations;

  const translateCategory = (category?: string | null): string => {
    if (!category) return '';
    if (currentLang.code === 'en') return category;
    const catMap = CATEGORY_TRANSLATIONS[category];
    if (catMap && catMap[currentLang.code]) {
      return catMap[currentLang.code];
    }
    return category;
  };

  const translateProductTitle = (title?: string | null): string => {
    if (!title) return '';
    if (currentLang.code === 'en') return title;

    // Direct match in dictionary
    for (const [enTitle, translations] of Object.entries(PRODUCT_TITLE_TRANSLATIONS)) {
      if (
        title.toLowerCase().trim() === enTitle.toLowerCase().trim() ||
        title.toLowerCase().includes(enTitle.toLowerCase().slice(0, 20))
      ) {
        if (translations[currentLang.code]) {
          return translations[currentLang.code];
        }
      }
    }

    // Keyword based smart translation fallback for titles
    const lang = currentLang.code;
    if (lang === 'hi') {
      return title
        .replace(/Handcrafted|Handmade/gi, 'हस्तनिर्मित')
        .replace(/Traditional/gi, 'पारंपरिक')
        .replace(/Bangles/gi, 'चूड़ियाँ')
        .replace(/Lac/gi, 'लाख')
        .replace(/with/gi, 'सहित')
        .replace(/and/gi, 'व')
        .replace(/Stone Work/gi, 'स्टोन वर्क')
        .replace(/Saree/gi, 'साड़ी')
        .replace(/Patterned/gi, 'डिज़ाइनर')
        .replace(/Elegant/gi, 'आकर्षक')
        .replace(/Red/gi, 'लाल')
        .replace(/Cotton/gi, 'कॉटन')
        .replace(/Tote Bag/gi, 'टोट बैग')
        .replace(/Bag/gi, 'बैग')
        .replace(/Quilt/gi, 'रजाई')
        .replace(/Dupatta/gi, 'दुपट्टा');
    }

    return title;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage: handleSetLanguage,
        t: currentStrings,
        translateCategory,
        translateProductTitle,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useWebLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      currentLang: DEFAULT_WEB_LANGUAGE,
      setLanguage: () => {},
      t: TRANSLATION_MAP.en as WebTranslations,
      translateCategory: (c) => c || '',
      translateProductTitle: (t) => t || '',
    };
  }
  return context;
}
