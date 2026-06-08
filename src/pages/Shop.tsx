import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const loadProducts = useCallback(() => {
    setProducts(getProducts());
  }, []);

  useEffect(() => {
    loadProducts();
    const interval = setInterval(loadProducts, 2000);
    return () => clearInterval(interval);
  }, [loadProducts]);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    if (cat) setActiveCategory(cat);
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => {
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nameBn.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.descriptionBn.includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    const params = new URLSearchParams(searchParams);
    params.set('category', id);
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearch('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="bangla text-3xl md:text-4xl font-extrabold text-white mb-3 animate-fade-in-up">
            {t('আমাদের পণ্যসমূহ', 'Our Products')}
          </h1>
          <p className="bangla text-slate-400 text-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t(`মোট ${products.length}টি পণ্য • সেরা মানের গ্যারান্টি`, `${products.length} Products • Quality Guaranteed`)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('পণ্য খুঁজুন... (নাম বা বিবরণ)', 'Search products... (name or description)')}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all bangla shadow-sm"
            />
            {search && (
              <button onClick={clearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 hover:text-foreground text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bangla flex-1 sm:flex-none px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer sm:min-w-[180px] shadow-sm"
            >
              <option value="newest">{t('সর্বশেষ', 'Newest First')}</option>
              <option value="featured">{t('ফিচার্ড আগে', 'Featured First')}</option>
              <option value="price-asc">{t('কম দাম আগে', 'Price: Low to High')}</option>
              <option value="price-desc">{t('বেশি দাম আগে', 'Price: High to Low')}</option>
            </select>
            <button
              onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
              className="p-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
              title={viewMode === 'grid' ? 'List view' : 'Grid view'}>
              {viewMode === 'grid'
                ? <List className="w-4 h-4 text-muted-foreground" />
                : <Grid3X3 className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`category-pill bangla px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'active border-transparent text-white shadow-md'
                  : 'border-border bg-card text-foreground hover:border-primary hover:shadow-sm'
              }`}>
              {cat.icon} {t(cat.nameBn, cat.name)}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-5">
          <p className="bangla text-sm text-muted-foreground">
            {search
              ? t(`"${search}" এর জন্য ${filtered.length}টি ফলাফল`, `${filtered.length} results for "${search}"`)
              : t(`${filtered.length}টি পণ্য পাওয়া গেছে`, `${filtered.length} products found`)}
          </p>
          {search && (
            <button onClick={clearSearch} className="bangla text-xs text-primary hover:underline flex items-center gap-1">
              <X className="w-3 h-3" /> {t('খোঁজ মুছুন', 'Clear search')}
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-7xl">🔍</div>
            <h3 className="bangla text-xl font-bold">{t('কোনো পণ্য পাওয়া যায়নি', 'No products found')}</h3>
            <p className="bangla text-muted-foreground">
              {search
                ? t('অন্য কিওয়ার্ড চেষ্টা করুন বা সব পণ্য দেখুন', 'Try different keywords or browse all products')
                : t('এই বিভাগে এখনো পণ্য যোগ করা হয়নি', 'No products in this category yet')}
            </p>
            <button onClick={() => { handleCategoryChange('all'); clearSearch(); }}
              className="bangla btn-primary text-white px-6 py-3 rounded-xl font-semibold">
              {t('সব পণ্য দেখুন', 'View All Products')}
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              : "grid grid-cols-1 sm:grid-cols-2 gap-4"
          }>
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
