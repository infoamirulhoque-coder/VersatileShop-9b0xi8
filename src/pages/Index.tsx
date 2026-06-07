import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Headphones, ArrowRight, Star, Zap, Gift } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { getProducts } from '@/lib/storage';
import { CATEGORIES, LOGO_URL, FACEBOOK_PAGE } from '@/constants';
import { Product } from '@/types';
import ProductCard from '@/components/features/ProductCard';
import { formatPriceEn } from '@/lib/utils';

export default function Index() {
  const { t } = useLang();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 6);
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  const stats = [
    { value: '500+', label: t('সন্তুষ্ট গ্রাহক', 'Happy Customers'), icon: '😊' },
    { value: '100+', label: t('মানসম্পন্ন পণ্য', 'Quality Products'), icon: '🛍️' },
    { value: '64+', label: t('জেলায় ডেলিভারি', 'Districts Covered'), icon: '🚚' },
    { value: '4.9', label: t('গড় রেটিং', 'Average Rating'), icon: '⭐' },
  ];

  const features = [
    { icon: <Truck className="w-6 h-6" />, title: t('দ্রুত ডেলিভারি', 'Fast Delivery'), desc: t('সারাদেশে দ্রুত ডেলিভারি', 'Delivery across Bangladesh') },
    { icon: <Shield className="w-6 h-6" />, title: t('নিরাপদ পেমেন্ট', 'Secure Payment'), desc: t('বিকাশে নিরাপদ পেমেন্ট', 'Secure Bkash payment') },
    { icon: <Gift className="w-6 h-6" />, title: t('সেরা মান', 'Best Quality'), desc: t('উচ্চমানের পণ্য নিশ্চিত', 'Premium quality assured') },
    { icon: <Headphones className="w-6 h-6" />, title: t('সাপোর্ট', 'Support'), desc: t('সর্বদা সহায়তার জন্য প্রস্তুত', 'Always ready to help') },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="hero-gradient relative min-h-screen flex items-center overflow-hidden">
        <div className="hero-gradient-overlay absolute inset-0" />
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm animate-fade-in-down">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="bangla">{t('বাংলাদেশের সেরা অনলাইন শপ', "Bangladesh's #1 Online Shop")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-in-left">
                <span className="bangla block">{t('সেরা মানের পণ্য', 'Quality Products')}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 bangla block">
                  {t('সাশ্রয়ী মূল্যে!', 'At Best Prices!')}
                </span>
              </h1>
              <p className="bangla text-lg text-white/80 leading-relaxed animate-fade-in-left delay-200">
                {t('হেড ক্যাপ, মেন্স ওয়াচ, সানগ্লাস, টি-শার্ট, জার্সি সহ সব ধরনের ফ্যাশন পণ্য পাওয়া যায়। ঢাকার ভিতরে ফ্রি ডেলিভারি!',
                   'Head caps, men\'s watches, sunglasses, t-shirts, jerseys & more. Free delivery inside Dhaka!')}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                <Link to="/shop"
                  className="bangla btn-secondary text-white px-8 py-3.5 rounded-full font-bold text-base flex items-center gap-2 shadow-xl">
                  <ShoppingBag className="w-5 h-5" />
                  {t('এখনই কিনুন', 'Shop Now')}
                </Link>
                <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                  className="bangla px-8 py-3.5 rounded-full font-bold text-base flex items-center gap-2 border-2 border-white/40 hover:bg-white/10 transition-all duration-300">
                  {t('ফেসবুক পেজ', 'Facebook Page')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              {/* Delivery badges */}
              <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
                <span className="bangla px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium">
                  ✅ {t('ঢাকায় ফ্রি ডেলিভারি', 'Free in Dhaka')}
                </span>
                <span className="bangla px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium">
                  📦 {t('বাইরে মাত্র ১০০৳', 'Outside ৳100 only')}
                </span>
                <span className="bangla px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm font-medium">
                  💳 {t('বিকাশে পেমেন্ট', 'Bkash Payment')}
                </span>
              </div>
            </div>

            {/* Right - Logo & Stats */}
            <div className="flex flex-col items-center gap-8 animate-fade-in-right">
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl glass flex items-center justify-center p-8 shadow-2xl border border-white/20 animate-float">
                  <img src={LOGO_URL} alt="Versatile Shop" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-xl animate-bounce-in">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
              </div>
              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {stats.map((s, i) => (
                  <div key={i} className="glass rounded-2xl p-3 text-center animate-scale-in" style={{ animationDelay: `${0.1 * i}s` }}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-white font-extrabold text-xl">{s.value}</div>
                    <div className="bangla text-white/70 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 55 960 0 720 20C480 40 240 5 0 20L0 60Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
                  {f.icon}
                </div>
                <h3 className="bangla font-bold text-sm">{f.title}</h3>
                <p className="bangla text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="bangla text-3xl font-extrabold mb-3 animate-fade-in-up">{t('বিভাগসমূহ', 'Categories')}</h2>
            <p className="bangla text-muted-foreground animate-fade-in-up delay-100">{t('আপনার পছন্দের বিভাগ বেছে নিন', 'Choose your preferred category')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="bangla text-xs font-semibold text-center leading-tight">{t(cat.nameBn, cat.name)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="bangla text-3xl font-extrabold mb-2 animate-fade-in-left">{t('ফিচার্ড পণ্য', 'Featured Products')}</h2>
              <p className="bangla text-muted-foreground animate-fade-in-left delay-100">{t('বিশেষভাবে নির্বাচিত সেরা পণ্যসমূহ', 'Hand-picked best products')}</p>
            </div>
            <Link to="/shop"
              className="bangla hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300">
              {t('সব পণ্য দেখুন', 'View All')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {featured.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bangla">{t('কোনো পণ্য নেই।', 'No products yet.')}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== ALL PRODUCTS ===== */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="bangla text-3xl font-extrabold mb-2">{t('সব পণ্য', 'All Products')}</h2>
          </div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-pill bangla px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${activeCategory === cat.id ? 'active border-transparent' : 'border-border bg-card text-foreground hover:border-primary'}`}>
                {cat.icon} {t(cat.nameBn, cat.name)}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground bangla">{t('এই বিভাগে কোনো পণ্য নেই।', 'No products in this category.')}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== BKASH BANNER ===== */}
      <section className="py-12 bg-gradient-to-r from-pink-600 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="text-5xl mb-4">💳</div>
          <h2 className="bangla text-2xl md:text-3xl font-extrabold mb-3">
            {t('বিকাশে সহজে পেমেন্ট করুন', 'Pay Easily with Bkash')}
          </h2>
          <p className="bangla text-white/90 mb-4 text-lg">
            {t('অর্ডার কনফার্ম করতে নিচের বিকাশ নম্বরে সেন্ড মানি করুন:', 'Send money to confirm your order:')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {['01750650124', '01835809017'].map(n => (
              <div key={n} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-3">
                <p className="text-xs text-white/70 mb-1">{t('বিকাশ নম্বর', 'Bkash Number')}</p>
                <p className="text-xl font-bold">{n}</p>
              </div>
            ))}
          </div>
          <p className="bangla text-white/80 text-sm">
            {t('সেন্ড মানি করে ট্রানজেকশন আইডি দিয়ে অর্ডার কনফার্ম করুন', 'Send money and confirm order with Transaction ID')}
          </p>
        </div>
      </section>
    </div>
  );
}
