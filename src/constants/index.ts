import { Category, Product, Announcement } from '@/types';

export const ADMIN_PIN = '090909';

export const BKASH_NUMBERS = ['01750650124', '01835809017'];

export const DELIVERY_CHARGE_OUTSIDE_DHAKA = 100;
export const DELIVERY_CHARGE_INSIDE_DHAKA = 0;

export const FACEBOOK_PAGE = 'https://www.facebook.com/share/1EAzfPtWbN/';

export const LOGO_URL = 'https://cdn-ai.onspace.ai/onspace/project/uploads/3HdtFfGzbXDuVTEnk83LJk/Messenger_creation_E13BC199-B1FD-4A9F-BD4C-A4B493064EA6.jpeg';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Products', nameBn: 'সব পণ্য', icon: '🛍️', color: 'from-teal-500 to-cyan-500' },
  { id: 'cap', name: 'Head Cap', nameBn: 'হেড ক্যাপ', icon: '🧢', color: 'from-blue-500 to-indigo-500' },
  { id: 'watch', name: "Men's Watch", nameBn: 'মেন্স ওয়াচ', icon: '⌚', color: 'from-amber-500 to-orange-500' },
  { id: 'sunglasses', name: 'Sunglasses', nameBn: 'সানগ্লাস', icon: '🕶️', color: 'from-purple-500 to-pink-500' },
  { id: 'drop-shoulder', name: 'Drop Shoulder', nameBn: 'ড্রপ শোল্ডার', icon: '👕', color: 'from-green-500 to-emerald-500' },
  { id: 'tshirt', name: 'T-Shirt', nameBn: 'টি-শার্ট', icon: '👔', color: 'from-red-500 to-rose-500' },
  { id: 'jersey', name: 'Jersey', nameBn: 'জার্সি', icon: '⚽', color: 'from-cyan-500 to-teal-500' },
  { id: 'other', name: 'Others', nameBn: 'অন্যান্য', icon: '📦', color: 'from-gray-500 to-slate-500' },
];

export const DHAKA_DISTRICTS = ['ঢাকা', 'নারায়ণগঞ্জ', 'গাজীপুর', 'মুন্সিগঞ্জ', 'মানিকগঞ্জ', 'নরসিংদী'];

export const BANGLADESH_DISTRICTS = [
  'ঢাকা', 'নারায়ণগঞ্জ', 'গাজীপুর', 'মুন্সিগঞ্জ', 'মানিকগঞ্জ', 'নরসিংদী',
  'চট্টগ্রাম', 'কক্সবাজার', 'রাঙামাটি', 'বান্দরবান', 'খাগড়াছড়ি', 'ফেনী', 'নোয়াখালী', 'লক্ষ্মীপুর', 'কুমিল্লা', 'চাঁদপুর', 'ব্রাহ্মণবাড়িয়া',
  'সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ',
  'রাজশাহী', 'চাঁপাইনবাবগঞ্জ', 'নওগাঁ', 'নাটোর', 'পাবনা', 'সিরাজগঞ্জ', 'বগুড়া', 'জয়পুরহাট',
  'খুলনা', 'বাগেরহাট', 'সাতক্ষীরা', 'যশোর', 'নড়াইল', 'ঝিনাইদহ', 'মাগুরা', 'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর',
  'বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'ঝালকাঠি', 'বরগুনা',
  'ময়মনসিংহ', 'জামালপুর', 'শেরপুর', 'নেত্রকোণা',
  'রংপুর', 'দিনাজপুর', 'ঠাকুরগাঁও', 'পঞ্চগড়', 'নীলফামারী', 'লালমনিরহাট', 'কুড়িগ্রাম', 'গাইবান্ধা',
  'ফরিদপুর', 'রাজবাড়ী', 'মাদারীপুর', 'শরীয়তপুর', 'গোপালগঞ্জ', 'টাঙ্গাইল', 'কিশোরগঞ্জ',
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Snapback Cap',
    nameBn: 'ক্লাসিক স্ন্যাপব্যাক ক্যাপ',
    price: 450,
    originalPrice: 600,
    category: 'cap',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format'],
    description: 'Premium quality snapback cap with adjustable strap',
    descriptionBn: 'উচ্চমানের স্ন্যাপব্যাক ক্যাপ, অ্যাডজাস্টেবল স্ট্র্যাপ সহ',
    stock: 50,
    badge: 'sale',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Premium Men\'s Watch',
    nameBn: 'প্রিমিয়াম মেন্স ওয়াচ',
    price: 1200,
    originalPrice: 1500,
    category: 'watch',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format'],
    description: 'Elegant men\'s watch with steel band',
    descriptionBn: 'এলিগেন্ট মেন্স ওয়াচ, স্টিল ব্যান্ড সহ',
    stock: 20,
    badge: 'hot',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Polarized Sunglasses',
    nameBn: 'পোলারাইজড সানগ্লাস',
    price: 650,
    originalPrice: 800,
    category: 'sunglasses',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format'],
    description: 'UV400 protection polarized sunglasses',
    descriptionBn: 'UV400 প্রোটেকশন পোলারাইজড সানগ্লাস',
    stock: 30,
    badge: 'new',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Drop Shoulder T-Shirt',
    nameBn: 'ড্রপ শোল্ডার টি-শার্ট',
    price: 550,
    category: 'drop-shoulder',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format'],
    description: 'Oversized drop shoulder comfort tee',
    descriptionBn: 'ওভারসাইজড ড্রপ শোল্ডার কমফোর্ট টি-শার্ট',
    stock: 40,
    badge: 'hot',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Graphic T-Shirt',
    nameBn: 'গ্রাফিক টি-শার্ট',
    price: 380,
    originalPrice: 480,
    category: 'tshirt',
    images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&auto=format'],
    description: 'Cool graphic printed premium t-shirt',
    descriptionBn: 'কুল গ্রাফিক প্রিন্টেড প্রিমিয়াম টি-শার্ট',
    stock: 60,
    badge: 'sale',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Football Jersey',
    nameBn: 'ফুটবল জার্সি',
    price: 750,
    originalPrice: 950,
    category: 'jersey',
    images: ['https://images.unsplash.com/photo-1522150786886-f4a2179b25ab?w=500&auto=format'],
    description: 'Premium football club jersey',
    descriptionBn: 'প্রিমিয়াম ফুটবল ক্লাব জার্সি',
    stock: 25,
    badge: 'new',
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

export const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    text: '🎉 Free delivery inside Dhaka! Order now!',
    textBn: '🎉 ঢাকার ভিতরে ফ্রি ডেলিভারি! এখনই অর্ডার করুন!',
    active: true,
    createdAt: new Date().toISOString(),
    type: 'promo',
  },
  {
    id: '2',
    text: '📦 Fast delivery all over Bangladesh - Outside Dhaka only ৳100 charge!',
    textBn: '📦 সারাদেশে দ্রুত ডেলিভারি - ঢাকার বাইরে মাত্র ১০০ টাকা ডেলিভারি চার্জ!',
    active: true,
    createdAt: new Date().toISOString(),
    type: 'info',
  },
];
