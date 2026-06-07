import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { getProducts } from '@/lib/storage';
import { CATEGORIES } from '@/constants';
import { Product } from '@/types';
import ProductCard from '@/components/features/ProductCard';

export default function Shop() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setActiveCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.nameBn.includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    const params = new URLSearchParams(searchParams);
    params.set('category', id);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="bangla text-3xl md:text-4xl font-extrabold text-white mb-2">
            {t('আমাদের পণ্যসমূহ', 'Our Products')}
          </h1>
          <p className="bangla text-slate-400">{t(`মোট ${filtered.length}টি পণ্য পাওয়া গেছে`, `${filtered.length} products found`)}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('পণ্য খুঁজুন...', 'Search products...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary bangla"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bangla px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer min-w-[160px]"
          >
            <option value="newest">{t('সর্বশেষ', 'Newest')}</option>
            <option value="price-asc">{t('কম দাম আগে', 'Price: Low to High')}</option>
            <option value="price-desc">{t('বেশি দাম আগে', 'Price: High to Low')}</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`category-pill bangla px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${activeCategory === cat.id ? 'active border-transparent' : 'border-border bg-card text-foreground'}`}>
              {cat.icon} {t(cat.nameBn, cat.name)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="bangla text-xl font-bold text-foreground">{t('কোনো পণ্য পাওয়া যায়নি', 'No products found')}</h3>
            <p className="bangla text-muted-foreground">{t('অন্য কিওয়ার্ড বা বিভাগ চেষ্টা করুন', 'Try different keywords or category')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
