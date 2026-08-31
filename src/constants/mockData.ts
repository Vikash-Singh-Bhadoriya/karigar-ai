import type {
  Language,
  Product,
  SellingScope,
} from '@/types/product';

export const IMAGES = {
  cottonBag:
    'https://images.unsplash.com/photo-1611583640642-c30238227b76?w=500&h=500&fit=crop&auto=format',
  dupatta:
    'https://images.unsplash.com/photo-1717585679395-bbe39b5fb6bc?w=500&h=500&fit=crop&auto=format',
  kantha:
    'https://images.unsplash.com/photo-1773847099204-238d283b2845?w=500&h=500&fit=crop&auto=format',
  juteBag:
    'https://images.unsplash.com/photo-1531357732422-758bdf2af3d5?w=500&h=500&fit=crop&auto=format',
  potli:
    'https://images.unsplash.com/photo-1777377372084-6eb0c83c2ed8?w=500&h=500&fit=crop&auto=format',
  saree:
    'https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=500&h=500&fit=crop&auto=format',
  avatar:
    'https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=100&h=100&fit=crop&auto=format&crop=faces',
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    hindi: 'कॉटन टोट बैग',
    title: 'Handcrafted Cotton Tote Bag',
    price: '₹649',
    status: 'active',
    views: 342,
    orders: 8,
    img: IMAGES.cottonBag,
  },
  {
    id: 2,
    hindi: 'हाथ से बुना दुपट्टा',
    title: 'Handwoven Dupatta',
    price: '₹1,249',
    status: 'active',
    views: 218,
    orders: 3,
    img: IMAGES.dupatta,
  },
  {
    id: 3,
    hindi: 'कांथा रजाई',
    title: 'Kantha Quilt',
    price: '₹2,100',
    status: 'draft',
    views: 0,
    orders: 0,
    img: IMAGES.kantha,
  },
  {
    id: 4,
    hindi: 'जूट शोल्डर बैग',
    title: 'Jute Shoulder Bag',
    price: '₹480',
    status: 'active',
    views: 567,
    orders: 12,
    img: IMAGES.juteBag,
  },
  {
    id: 5,
    hindi: 'कढ़ाई की पोटली',
    title: 'Embroidered Potli',
    price: '₹380',
    status: 'active',
    views: 189,
    orders: 5,
    img: IMAGES.potli,
  },
  {
    id: 6,
    hindi: 'हैंडलूम साड़ी',
    title: 'Handloom Saree',
    price: '₹3,200',
    status: 'active',
    views: 891,
    orders: 15,
    img: IMAGES.saree,
  },
];

export const CURRENT_PRODUCT = PRODUCTS[0];

export const HOME_STATS = [
  { value: '12', hindi: 'प्रोडक्ट', accent: 'ink' as const },
  { value: '3', hindi: 'नए ऑर्डर', accent: 'brand' as const, dot: true },
  { value: '₹8,430', hindi: 'कमाई', accent: 'ok' as const },
];

export const LANGUAGES: Language[] = ['हिंदी', 'मराठी', 'English'];

export const PROCESSING_STEPS = [
  { icon: '📸', hindi: 'फोटो का विश्लेषण हो रहा है', en: 'Photo analyzed' },
  { icon: '👂', hindi: 'आपकी बात समझी जा रही है', en: 'Voice understood' },
  { icon: '📝', hindi: 'Product description तैयार हो रही है', en: 'Description generated' },
  { icon: '🏷️', hindi: 'सही category खोजी जा रही है', en: 'Category matched' },
  { icon: '💰', hindi: 'Price सुझाव तैयार हो रहा है', en: 'Price suggested' },
];

export const PRODUCT_TAGS = ['#Handmade', '#Cotton', '#EcoFriendly', '#ToteBag', '#Artisan'];

export const PRICE_BREAKDOWN = [
  { hindi: 'कपड़े की लागत', en: 'Material cost', amount: '₹180' },
  { hindi: 'मेहनत / craftsmanship', en: 'Labor & skill', amount: '₹200' },
  { hindi: 'पैकेजिंग', en: 'Packaging', amount: '₹40' },
  { hindi: 'Profit margin', en: 'Recommended margin', amount: '₹229' },
];

export const SELLING_SCOPES: { id: SellingScope; emoji: string; label: string }[] = [
  { id: 'local', emoji: '🏘️', label: 'Local' },
  { id: 'states', emoji: '🗺️', label: 'State' },
  { id: 'india', emoji: '🇮🇳', label: 'All India' },
];

export const ORDERS = [
  { id: 'ORD-1042', product: 'कॉटन टोट बैग', buyer: 'Priya S.', city: 'Mumbai', qty: 2, amount: '₹1,298', status: 'Shipped' },
  { id: 'ORD-1041', product: 'जूट शोल्डर बैग', buyer: 'Amit K.', city: 'Pune', qty: 1, amount: '₹480', status: 'Processing' },
  { id: 'ORD-1040', product: 'हाथ से बुना दुपट्टा', buyer: 'Neha R.', city: 'Nashik', qty: 1, amount: '₹1,249', status: 'Delivered' },
  { id: 'ORD-1039', product: 'कॉटन टोट बैग', buyer: 'Ravi T.', city: 'Mumbai', qty: 1, amount: '₹649', status: 'Delivered' },
];

export const PROFILE_INFO = [
  { icon: '🏦', hindi: 'बैंक खाता', value: 'SBI ••••4521' },
  { icon: '📱', hindi: 'फ़ोन', value: '+91 98765 43210' },
  { icon: '📍', hindi: 'पता', value: 'Chandrapur, Maharashtra' },
  { icon: '🎨', hindi: 'शिल्प', value: 'Handloom Weaving' },
];

export const PROFILE_STATS = [
  { value: '12', hindi: 'प्रोडक्ट' },
  { value: '43', hindi: 'ऑर्डर' },
  { value: '₹28K', hindi: 'कमाई' },
];
