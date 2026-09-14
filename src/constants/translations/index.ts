/**
 * On-Device Translation Dictionary for KarigarAI Artisan Mobile App
 * Optimized for low-literacy artisans: simple, concise, action-oriented.
 * ₹0 API cost, works 100% offline.
 */

export interface TranslationStrings {
  // Navigation Tabs
  tabHome: string;
  tabOrders: string;
  tabProfile: string;
  tabAdd: string;

  // Header & Branding
  appName: string;
  tagline: string;
  artisanBadge: string;

  // Add Craft / Product Flow
  takePhoto: string;
  retakePhoto: string;
  tapToSpeak: string;
  recording: string;
  listening: string;
  analyzing: string;
  speakingPrompt: string;
  photoHelp: string;
  voiceHelp: string;
  priceHelp: string;
  publishBtn: string;
  publishing: string;
  productName: string;
  category: string;
  price: string;
  description: string;

  // Home Screen & Stats
  productsCount: string;
  newOrders: string;
  totalEarnings: string;
  quickActionTitle: string;
  addNewCraft: string;
  recentOrdersTitle: string;

  // Order Statuses
  statusShipped: string;
  statusProcessing: string;
  statusDelivered: string;
  statusDraft: string;

  // Audio Guidance Prompts (for TTS playback)
  ttsPhotoPrompt: string;
  ttsVoicePrompt: string;
  ttsPricePrompt: string;
  ttsWelcome: string;
}

export const TRANSLATIONS: Record<string, TranslationStrings> = {
  // 1. Hindi (Default)
  hi: {
    tabHome: 'होम',
    tabOrders: 'ऑर्डर',
    tabProfile: 'प्रोफ़ाइल',
    tabAdd: 'नया शिल्प',
    appName: 'कारीगर AI',
    tagline: 'कारीगरों का डिजिटल बाज़ार',
    artisanBadge: 'शिल्पकार',
    takePhoto: 'फोटो खींचें',
    retakePhoto: 'दूसरी फोटो लें',
    tapToSpeak: 'बोलकर बताएं',
    recording: 'रिकॉर्डिंग हो रही है...',
    listening: 'सुन रहे हैं...',
    analyzing: 'AI शिल्प को समझ रहा है...',
    speakingPrompt: 'अपने शिल्प के बारे में बोलें (सामग्री, खासियत, कीमत)',
    photoHelp: 'शिल्प की साफ फोटो खींचें',
    voiceHelp: 'माइक दबाकर अपने शिल्प के बारे में बताएं',
    priceHelp: 'कारीगर की मेहनत और सामग्री के अनुसार सही कीमत',
    publishBtn: 'दुकान में जोड़ें (पब्लिश)',
    publishing: 'शिल्प लाइव हो रहा है...',
    productName: 'शिल्प का नाम',
    category: 'श्रेणी / प्रकार',
    price: 'कीमत',
    description: 'विवरण',
    productsCount: 'शिल्प',
    newOrders: 'नए ऑर्डर',
    totalEarnings: 'कुल कमाई',
    quickActionTitle: 'त्वरित कार्य',
    addNewCraft: 'नया शिल्प जोड़ें',
    recentOrdersTitle: 'हाल के ऑर्डर',
    statusShipped: 'भेज दिया',
    statusProcessing: 'तैयार हो रहा है',
    statusDelivered: 'पहुंच गया',
    statusDraft: 'ड्राफ्ट',
    ttsPhotoPrompt: 'कृपया अपने हाथ से बने शिल्प की एक साफ फोटो लें।',
    ttsVoicePrompt: 'माइक का बटन दबाएं और बताएं कि यह शिल्प किस चीज से बना है और इसकी क्या कीमत रखनी है।',
    ttsPricePrompt: 'यह कीमत आपकी मेहनत और सामग्री के अनुसार सुझाई गई है। आप इसे बदल भी सकते हैं।',
    ttsWelcome: 'कारीगर AI में आपका स्वागत है। बोलकर अपना सामान बेचें।',
  },

  // 2. Bengali
  bn: {
    tabHome: 'হোম',
    tabOrders: 'অর্ডার',
    tabProfile: 'প্রোফাইল',
    tabAdd: 'নতুন শিল্প',
    appName: 'কারিগর AI',
    tagline: 'শিল্পীদের ডিজিটাল বাজার',
    artisanBadge: 'শিল্পী',
    takePhoto: 'ছবি তুলুন',
    retakePhoto: 'অন্য ছবি নিন',
    tapToSpeak: 'মুখে বলুন',
    recording: 'রেকর্ডিং হচ্ছে...',
    listening: 'শুনছি...',
    analyzing: 'AI আপনার শিল্প বিশ্লেষণ করছে...',
    speakingPrompt: 'আপনার শিল্পের বিবরণ দিন (উপকরণ, দাম)',
    photoHelp: 'শিল্পের পরিষ্কার ছবি তুলুন',
    voiceHelp: 'মাইক চেপে আপনার শিল্পের কথা বলুন',
    priceHelp: 'শ্রম এবং উপকরণের সঠিক মূল্য',
    publishBtn: 'বাজারে যুক্ত করুন',
    publishing: 'লাইভ হচ্ছে...',
    productName: 'পণ্যের নাম',
    category: 'বিভাগ',
    price: 'দাম',
    description: 'বিবরণ',
    productsCount: 'পণ্য',
    newOrders: 'নতুন অর্ডার',
    totalEarnings: 'মোট আয়',
    quickActionTitle: 'দ্রুত কাজ',
    addNewCraft: 'নতুন শিল্প যোগ করুন',
    recentOrdersTitle: 'সাম্প্রতিক অর্ডার',
    statusShipped: 'পাঠানো হয়েছে',
    statusProcessing: 'প্রস্তুত হচ্ছে',
    statusDelivered: 'পৌঁছে গেছে',
    statusDraft: 'খসড়া',
    ttsPhotoPrompt: 'দয়া করে আপনার তৈরি হস্তশিল্পের একটি পরিষ্কার ছবি তুলুন।',
    ttsVoicePrompt: 'মাইক বোতাম টিপুন এবং বলুন এই পণ্যটি কী দিয়ে তৈরি এবং এর দাম কত।',
    ttsPricePrompt: 'আপনার শ্রম ও উপাদানের ভিত্তিতে এই দামের প্রস্তাব করা হয়েছে।',
    ttsWelcome: 'কারিগর AI-তে স্বাগতম। মুখে বলেই আপনার শিল্প বিক্রি করুন।',
  },

  // 3. Marathi
  mr: {
    tabHome: 'होम',
    tabOrders: 'ऑर्डर्स',
    tabProfile: 'प्रोफाइल',
    tabAdd: 'नवीन कलाकृती',
    appName: 'कारागीर AI',
    tagline: 'कारागिरांची हक्काची डिजिटल बाजारपेठ',
    artisanBadge: 'शिल्पकार',
    takePhoto: 'फोटो काढा',
    retakePhoto: 'दुसरा फोटो घ्या',
    tapToSpeak: 'बोलून सांगा',
    recording: 'रेकॉर्डिंग सुरू आहे...',
    listening: 'ऐकत आहे...',
    analyzing: 'AI कलाकृती समजत आहे...',
    speakingPrompt: 'आपल्या वस्तूविषयी सांगा (साहित्य, किंमत)',
    photoHelp: 'कलाकृतीचा स्पष्ट फोटो काढा',
    voiceHelp: 'माइक दाबून वस्तूची माहिती सांगा',
    priceHelp: 'कष्ट आणि साहित्यानुसार योग्य किंमत',
    publishBtn: 'बाजारपेठेत जोडा (प्रकाशित करा)',
    publishing: 'वस्तू जोडली जात आहे...',
    productName: 'वस्तूचे नाव',
    category: 'प्रकार',
    price: 'किंमत',
    description: 'माहिती',
    productsCount: 'कलाकृती',
    newOrders: 'नवीन ऑर्डर्स',
    totalEarnings: 'एकूण कमाई',
    quickActionTitle: 'द्रुत कृती',
    addNewCraft: 'नवीन कलाकृती जोडा',
    recentOrdersTitle: 'अलीकडील ऑर्डर्स',
    statusShipped: 'पाठवले',
    statusProcessing: 'तयार होत आहे',
    statusDelivered: 'पोहोचले',
    statusDraft: 'मसुदा',
    ttsPhotoPrompt: 'कृपया आपल्या हाताने बनवलेल्या वस्तूचा एक स्पष्ट फोटो काढा.',
    ttsVoicePrompt: 'माइक दाबा आणि ही वस्तू कशापासून बनवली आहे आणि किंमत काय आहे ते सांगा.',
    ttsPricePrompt: 'ही किंमत आपल्या मेहनतीनुसार सुचवली आहे. आपण ती बदलू शकता.',
    ttsWelcome: 'कारागीर AI मध्ये स्वागत आहे. बोलून आपली उत्पादने विका.',
  },

  // 4. Tamil
  ta: {
    tabHome: 'முகப்பு',
    tabOrders: 'ஆர்டர்கள்',
    tabProfile: 'சுயவிவரம்',
    tabAdd: 'புதிய கைவினை',
    appName: 'காரிகர் AI',
    tagline: 'கைவினைஞர்களின் டிஜிட்டல் சந்தை',
    artisanBadge: 'கைவினைஞர்',
    takePhoto: 'படம் எடுக்கவும்',
    retakePhoto: 'மறுபடியும் எடுக்கவும்',
    tapToSpeak: 'பேசி விவரிக்கவும்',
    recording: 'பதிவாகிறது...',
    listening: 'கேட்கிறது...',
    analyzing: 'AI கைவினைப்பொருளை ஆய்வு செய்கிறது...',
    speakingPrompt: 'உங்கள் கைவினைப் பற்றி பேசுங்கள் (பொருட்கள், விலை)',
    photoHelp: 'கைவினைப்பொருளின் தெளிவான படம் எடுக்கவும்',
    voiceHelp: 'மைக்கை அழுத்தி பொருளைப் பற்றி பேசவும்',
    priceHelp: 'உழைப்பு மற்றும் பொருட்களுக்கு ஏற்ற நியாயமான விலை',
    publishBtn: 'சந்தையில் சேர்க்கவும்',
    publishing: 'பதிவேற்றப்படுகிறது...',
    productName: 'பொருளின் பெயர்',
    category: 'பிரிவு',
    price: 'விலை',
    description: 'விளக்கம்',
    productsCount: 'பொருட்கள்',
    newOrders: 'புதிய ஆர்டர்கள்',
    totalEarnings: 'மொத்த வருவாய்',
    quickActionTitle: 'விரைவு செயல்கள்',
    addNewCraft: 'புதிய கைவினை சேர்க்கவும்',
    recentOrdersTitle: 'சமீபத்திய ஆர்டர்கள்',
    statusShipped: 'அனுப்பப்பட்டது',
    statusProcessing: 'தயாராகிறது',
    statusDelivered: 'வழங்கப்பட்டது',
    statusDraft: 'வரைவு',
    ttsPhotoPrompt: 'உங்கள் கைவினைப் பொருளின் தெளிவான புகைப்படத்தை எடுக்கவும்.',
    ttsVoicePrompt: 'மைக் பட்டனை அழுத்தி, இது எதனால் செய்யப்பட்டது மற்றும் இதன் விலை என்ன என்று சொல்லுங்கள்.',
    ttsPricePrompt: 'உங்கள் உழைப்பிற்கு ஏற்ற நியாயமான விலை இது.',
    ttsWelcome: 'காரிகர் AI-க்கு நல்வரவு. பேசி உங்கள் பொருட்களை விற்பனை செய்யுங்கள்.',
  },

  // 5. Telugu
  te: {
    tabHome: 'హోమ్',
    tabOrders: 'ఆర్డర్లు',
    tabProfile: 'ప్రొఫైల్',
    tabAdd: 'కొత్త కళ',
    appName: 'కారికర్ AI',
    tagline: 'చేతివృత్తుల డిజిటల్ బజార్',
    artisanBadge: 'చేతివృత్తి కళాకారుడు',
    takePhoto: 'ఫోటో తీయండి',
    retakePhoto: 'మరో ఫోటో తీయండి',
    tapToSpeak: 'మాట్లాడి చెప్పండి',
    recording: 'రికార్డింగ్ అవుతోంది...',
    listening: 'వింటోంది...',
    analyzing: 'AI పరిశీలిస్తోంది...',
    speakingPrompt: 'మీ వస్తువు గురించి మాట్లాడండి (రకం, ధర)',
    photoHelp: 'స్పష్టమైన ఫోటో తీయండి',
    voiceHelp: 'మైక్ నొక్కి వస్తువు వివరాలు చెప్పండి',
    priceHelp: 'శ్రమకు తగిన న్యాయమైన ధర',
    publishBtn: 'మార్కెట్లో చేర్చండి',
    publishing: 'లైవ్ అవుతోంది...',
    productName: 'వస్తువు పేరు',
    category: 'వర్గం',
    price: 'ధర',
    description: 'వివరాలు',
    productsCount: 'వస్తువులు',
    newOrders: 'కొత్త ఆర్డర్లు',
    totalEarnings: 'మొత్తం ఆదాయం',
    quickActionTitle: 'త్వరిత పనులు',
    addNewCraft: 'కొత్త వస్తువు చేర్చండి',
    recentOrdersTitle: 'ఇటీవలి ఆర్డర్లు',
    statusShipped: 'పంపబడింది',
    statusProcessing: 'ప్రాసెసింగ్',
    statusDelivered: 'చేరింది',
    statusDraft: 'డ్రాఫ్ట్',
    ttsPhotoPrompt: 'దయచేసి మీ చేతివృత్తి వస్తువు స్పష్టమైన ఫోటో తీయండి.',
    ttsVoicePrompt: 'మైక్ నొక్కి ఇది దేనితో తయారు చేయబడింది మరియు ధర ఎంత అని చెప్పండి.',
    ttsPricePrompt: 'మీ శ్రమకు తగిన ధర ఇది.',
    ttsWelcome: 'కారికర్ AI కి స్వాగతం. మాట్లాడి మీ ఉత్పత్తులను విక్రయించండి.',
  },

  // 6. Gujarati
  gu: {
    tabHome: 'હોમ',
    tabOrders: 'ઓર્ડર',
    tabProfile: 'પ્રોફાઇલ',
    tabAdd: 'નવું શિલ્પ',
    appName: 'કારીગર AI',
    tagline: 'કારીગરોનું ડિજિટલ બજાર',
    artisanBadge: 'કારીગર',
    takePhoto: 'ફોટો લો',
    retakePhoto: 'બીજો ફોટો લો',
    tapToSpeak: 'બોલીને જણાવો',
    recording: 'રેકોર્ડિંગ ચાલુ છે...',
    listening: 'સાંભળે છે...',
    analyzing: 'AI કલાકૃતિ સમજી રહ્યું છે...',
    speakingPrompt: 'તમારા ઉત્પાદન વિશે બોલો (સામગ્રી, કિંમત)',
    photoHelp: 'સ્પષ્ટ ફોટો પાડો',
    voiceHelp: 'માઇક દબાવીને વિગતો બોલો',
    priceHelp: 'મહેનત અને સામગ્રી અનુસાર વાજબી કિંમત',
    publishBtn: 'દુકાનમાં ઉમેરો',
    publishing: 'લાઇવ થઈ રહ્યું છે...',
    productName: 'નામ',
    category: 'શ્રેણી',
    price: 'કિંમત',
    description: 'વિગત',
    productsCount: 'ઉત્પાદનો',
    newOrders: 'નવા ઓર્ડર',
    totalEarnings: 'કુલ કમાણી',
    quickActionTitle: 'ઝડપી કાર્યો',
    addNewCraft: 'નવું ઉત્પાદન ઉમેરો',
    recentOrdersTitle: 'તાજેતરના ઓર્ડર',
    statusShipped: 'મોકલેલ',
    statusProcessing: 'તૈયાર થઈ રહ્યું છે',
    statusDelivered: 'પહોંચી ગયું',
    statusDraft: 'ડ્રાફ્ટ',
    ttsPhotoPrompt: 'કૃપા કરીને તમારી હસ્તકલાનો એક સ્પષ્ટ ફોટો લો.',
    ttsVoicePrompt: 'માઇક દબાવો અને જણાવો કે આ વસ્તુ શેનાથી બનેલી છે અને કિંમત શું રાખવી છે.',
    ttsPricePrompt: 'તમારી મહેનત પ્રમાણે આ કિંમત સુચવેલ છે.',
    ttsWelcome: 'કારીગર AI માં આપનું સ્વાગત છે. બોલીને વેચાણ કરો.',
  },

  // 7. English (Fallback & Export)
  en: {
    tabHome: 'Home',
    tabOrders: 'Orders',
    tabProfile: 'Profile',
    tabAdd: 'Add Craft',
    appName: 'Karigar AI',
    tagline: 'Digital Marketplace for Indian Artisans',
    artisanBadge: 'Master Artisan',
    takePhoto: 'Take Photo',
    retakePhoto: 'Retake Photo',
    tapToSpeak: 'Tap to Speak',
    recording: 'Recording voice...',
    listening: 'Listening...',
    analyzing: 'AI is analyzing your craft...',
    speakingPrompt: 'Speak about your craft (materials, craft technique, price)',
    photoHelp: 'Take a clear, bright photo of your handcrafted item',
    voiceHelp: 'Hold or tap the mic and describe your craft naturally',
    priceHelp: 'Fair pricing suggested based on material costs and artisan labor',
    publishBtn: 'Publish to Marketplace',
    publishing: 'Publishing to cloud...',
    productName: 'Craft Title',
    category: 'Category',
    price: 'Price',
    description: 'Description',
    productsCount: 'Crafts',
    newOrders: 'New Orders',
    totalEarnings: 'Total Earnings',
    quickActionTitle: 'Quick Actions',
    addNewCraft: 'Add New Craft',
    recentOrdersTitle: 'Recent Orders',
    statusShipped: 'Shipped',
    statusProcessing: 'Processing',
    statusDelivered: 'Delivered',
    statusDraft: 'Draft',
    ttsPhotoPrompt: 'Please take a clear photo of your handcrafted item.',
    ttsVoicePrompt: 'Tap the microphone and describe what materials you used and your expected price.',
    ttsPricePrompt: 'This price is calculated based on your craft labor and material costs.',
    ttsWelcome: 'Welcome to Karigar AI. Speak naturally to list and sell your crafts.',
  },
};

/**
 * Returns localized strings for the given language code with fallback to Hindi, then English.
 */
export function getTranslations(langCode?: string): TranslationStrings {
  if (!langCode) return TRANSLATIONS.hi;
  const key = langCode.toLowerCase().split('-')[0];
  return TRANSLATIONS[key] ?? TRANSLATIONS.hi ?? TRANSLATIONS.en;
}
