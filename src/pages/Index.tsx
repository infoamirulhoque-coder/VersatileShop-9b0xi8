import { useState, useEffect, useCallback } from 'react';
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
  const [loaded, setLoaded] = useState(false);

  const loadProducts = useCallback(() => {
    const p = getProducts();
    setProducts([...p]);
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadProducts();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'versatile_products') loadProducts();
    };
    // Poll every 2s for same-tab admin changes
    const interval = setInterval(loadProducts, 2000);
    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadProducts]);

  const featured = products.filter(p => p.featured).slice(0, 8);
  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const stats = [
    { value: '500+', label: t('সন্তুষ্ট গ্রাহক', 'Happy Customers'), icon: '😊' },
    { value: '100+', label: t('মানসম্পন্ন পণ্য', 'Quality Products'), icon: '🛍️' },
    { value: '64+', label: t('জেলায় ডেলিভারি', 'Districts Covered'), icon: '🚚' },
    { value: '4.9', label: t('গড় রেটিং', 'Average Rating'), icon: '⭐' },
  ];

  const features = [
    { icon: <Truck className="w-6 h-6" />, title: t('ক্যাশ-অন ডেলিভারি', 'Cash on Delivery'), desc: t('নারায়ণগঞ্জে ক্যাশ-অন ডেলিভারি', 'COD in Narayanganj') },
    { icon: <Shield className="w-6 h-6" />, title: t('নিরাপদ পেমেন্ট', 'Secure Payment'), desc: t('বিকাশে নিরাপদ পেমেন্ট', 'Secure Bkash payment') },
    { icon: <Gift className="w-6 h-6" />, title: t('সেরা মান', 'Best Quality'), desc: t('উচ্চমানের পণ্য নিশ্চিত', 'Premium quality assured') },
    { icon: <Headphones className="w-6 h-6" />, title: t('কাস্টমার সাপোর্ট', 'Support'), desc: t('সর্বদা সহায়তার জন্য প্রস্তুত', 'Always ready to help') },
  ];

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="hero-gradient relative min-h-screen flex items-center overflow-hidden">
        <div className="hero-gradient-overlay absolute inset-0" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
            {/* Left */}
            <div className="text-white space-y-5 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm animate-fade-in-down">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="bangla">{t("বাংলাদেশের সেরা অনলাইন শপ", "Bangladesh's #1 Online Shop")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-in-left">
                <span className="bangla block">{t('সেরা মানের পণ্য', 'Quality Products')}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 bangla block mt-1">
                  {t('সাশ্রয়ী মূল্যে!', 'At Best Prices!')}
                </span>
              </h1>
              <p className="bangla text-base md:text-lg text-white/80 leading-relaxed animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
                {t(
                  'হেড ক্যাপ, মেন্স ওয়াচ, সানগ্লাস, টি-শার্ট, জার্সি সহ সব ধরনের ফ্যাশন পণ্য। নারায়ণগঞ্জের ভিতরে ক্যাশ-অন ডেলিভারি!',
                  "Head caps, men's watches, sunglasses, t-shirts, jerseys & more. Cash on delivery inside Narayanganj!"
                )}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link to="/shop"
                  className="bangla btn-secondary text-white px-7 py-3.5 rounded-full font-bold text-base flex items-center gap-2 shadow-xl">
                  <ShoppingBag className="w-5 h-5" />
                  {t('এখনই কিনুন', 'Shop Now')}
                </Link>
                <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                  className="bangla px-7 py-3.5 rounded-full font-bold text-base flex items-center gap-2 border-2 border-white/40 hover:bg-white/10 transition-all duration-300">
                  {t('ফেসবুক পেজ', 'Facebook Page')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <span className="bangla px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-medium">
                  ✅ {t('নারায়ণগঞ্জে ক্যাশ-অন ডেলিভারি', 'COD in Narayanganj')}
                </span>
                <span className="bangla px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium">
                  📦 {t('বাইরে মাত্র ১০০৳', 'Outside ৳100 only')}
                </span>
                <span className="bangla px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm font-medium">
                  💳 {t('বিকাশে পেমেন্ট', 'Bkash Payment')}
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in-right">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl glass flex items-center justify-center p-6 md:p-8 shadow-2xl border border-white/20 animate-float">
                  <img src={LOGO_URL} alt="Versatile Shop" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
                <div className="absolute -top-4 -right-4 w-14 h-14 md:w-16 md:h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-xl animate-bounce-in">
                  <Star className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
                </div>
              </div>
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

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 55 960 0 720 20C480 40 240 5 0 20L0 60Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-10 md:py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="glass-card rounded-2xl p-4 md:p-5 flex flex-col items-center text-center gap-2 md:gap-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
                  {f.icon}
                </div>
                <h3 className="bangla font-bold text-xs md:text-sm">{f.title}</h3>
                <p className="bangla text-xs text-muted-foreground hidden md:block">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="bangla text-2xl md:text-3xl font-extrabold mb-2 md:mb-3 animate-fade-in-up">{t('বিভাগসমূহ', 'Categories')}</h2>
            <p className="bangla text-muted-foreground text-sm animate-fade-in-up">
              {t('আপনার পছন্দের বিভাগ বেছে নিন', 'Choose your preferred category')}
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.id} to={`/shop?category=${cat.id}`}
                className="flex flex-col items-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-2xl bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up border border-border/50"
                style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl md:text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <span className="bangla text-xs font-semibold text-center leading-tight">{t(cat.nameBn, cat.name)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      {featured.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <div>
                <h2 className="bangla text-2xl md:text-3xl font-extrabold mb-1 md:mb-2">{t('ফিচার্ড পণ্য', 'Featured Products')}</h2>
                <p className="bangla text-muted-foreground text-sm">{t('বিশেষভাবে নির্বাচিত সেরা পণ্যসমূহ', 'Hand-picked best products')}</p>
              </div>
              <Link to="/shop"
                className="bangla hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 text-sm">
                {t('সব পণ্য দেখুন', 'View All')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
            <div className="text-center mt-6 sm:hidden">
              <Link to="/shop" className="bangla inline-flex items-center gap-2 text-primary font-semibold">
                {t('সব পণ্য দেখুন', 'View All')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL PRODUCTS ===== */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="bangla text-2xl md:text-3xl font-extrabold mb-2">{t('সব পণ্য', 'All Products')}</h2>
            <p className="bangla text-muted-foreground text-sm">
              {loaded
                ? t(`মোট ${products.length}টি পণ্য`, `${products.length} Products Available`)
                : t('লোড হচ্ছে...', 'Loading...')}
            </p>
          </div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8 justify-center">
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-pill bangla px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold border transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'active border-transparent text-white'
                    : 'border-border bg-card text-foreground hover:border-primary'
                }`}>
                {cat.icon} {t(cat.nameBn, cat.name)}
              </button>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="text-5xl md:text-6xl mb-4">🛍️</div>
              <h3 className="bangla text-xl font-bold mb-2 text-muted-foreground">{t('এখনো কোনো পণ্য নেই', 'No products yet')}</h3>
              <p className="bangla text-muted-foreground text-sm">
                {t('অ্যাডমিন প্যানেল থেকে পণ্য যোগ করুন', 'Add products from admin panel')}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bangla text-lg">
              {t('এই বিভাগে কোনো পণ্য নেই।', 'No products in this category.')}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ===== DELIVERY / BKASH BANNER ===== */}
      <section className="py-12 md:py-14 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-orange-900/20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            {/* COD */}
            <div className="text-center md:text-left">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">🚚</div>
              <h2 className="bangla text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-3">
                {t('নারায়ণগঞ্জে ক্যাশ-অন ডেলিভারি', 'Cash on Delivery in Narayanganj')}
              </h2>
              <p className="bangla text-slate-300 text-sm md:text-base leading-relaxed mb-4">
                {t(
                  'নারায়ণগঞ্জের ভিতরে পণ্য পেয়ে টাকা দিন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই!',
                  'Pay when you receive the product inside Narayanganj. No advance payment needed!'
                )}
              </p>
              <div className="flex flex-col gap-2">
                <div className="bangla flex items-center gap-2 text-green-400 font-semibold text-sm md:text-base">
                  <span>✅</span>
                  {t('নারায়ণগঞ্জের ভিতরে: ক্যাশ-অন ডেলিভারি (বিনামূল্যে)', 'Inside Narayanganj: COD (Free)')}
                </div>
                <div className="bangla flex items-center gap-2 text-yellow-400 font-semibold text-sm md:text-base">
                  <span>📦</span>
                  {t('বাইরে: মাত্র ১০০ টাকা ডেলিভারি চার্জ', 'Outside: ৳100 delivery charge')}
                </div>
              </div>
            </div>
            {/* Bkash */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">💳</div>
              <h2 className="bangla text-xl md:text-2xl font-extrabold text-white mb-3">
                {t('বিকাশে পেমেন্ট করুন', 'Pay via bKash')}
              </h2>
              <p className="bangla text-slate-300 text-sm mb-4">
                {t('অর্ডার কনফার্ম করতে নিচের নম্বরে সেন্ড মানি করুন:', 'Send money to confirm your order:')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['01750650124', '01835809017'].map(n => (
                  <div key={n} className="bg-pink-600/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl px-4 md:px-5 py-3">
                    <p className="bangla text-xs text-pink-300 mb-0.5">{t('বিকাশ নম্বর', 'Bkash Number')}</p>
                    <p className="text-lg md:text-xl font-bold text-white">{n}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
