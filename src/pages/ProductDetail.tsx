import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, Heart, Plus, Minus, Tag } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { getProducts } from '@/lib/storage';
import { Product } from '@/types';
import { formatPriceEn, cn } from '@/lib/utils';
import ProductCard from '@/components/features/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [imgErr, setImgErr] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const fallback = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&auto=format';

  useEffect(() => {
    const all = getProducts();
    const p = all.find(x => x.id === id);
    setProduct(p || null);
    if (p) {
      setRelated(all.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4));
      // Auto-select first size
      if (p.sizes && p.sizes.length === 1) setSelectedSize(p.sizes[0]);
      else setSelectedSize('');
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h2 className="bangla text-xl font-bold">{t('পণ্য পাওয়া যায়নি', 'Product not found')}</h2>
          <Link to="/shop" className="bangla text-primary hover:underline flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" /> {t('শপে ফিরুন', 'Back to Shop')}
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  const canAddToCart = !hasSizes || selectedSize !== '';

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      return; // prevent add without size
    }
    addToCart(product, qty, selectedSize || undefined);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground bangla flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">{t('হোম', 'Home')}</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">{t('শপ', 'Shop')}</Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{t(product.nameBn, product.name)}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-16">
          {/* Images */}
          <div className="space-y-3 animate-fade-in-left">
            <div className="img-zoom aspect-square rounded-3xl overflow-hidden bg-muted shadow-xl">
              <img
                src={imgErr ? fallback : (product.images[activeImg] || fallback)}
                alt={product.nameBn}
                onError={() => setImgErr(true)}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {product.images.map((img, i) => (
                  <button key={i}
                    onClick={() => { setActiveImg(i); setImgErr(false); }}
                    className={cn("w-16 h-16 rounded-xl overflow-hidden border-2 transition-all", activeImg === i ? "border-primary shadow-md" : "border-transparent hover:border-border")}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5 animate-fade-in-right">
            {product.badge && (
              <span className={cn("inline-block px-3 py-1 rounded-full text-white text-xs font-bold",
                product.badge === 'new' ? 'badge-new' : product.badge === 'hot' ? 'badge-hot' : 'badge-sale')}>
                {product.badge === 'new' ? t('নতুন', 'NEW') : product.badge === 'hot' ? 'HOT 🔥' : t('সেল', 'SALE')}
              </span>
            )}
            <h1 className="bangla text-2xl md:text-3xl font-extrabold leading-tight">{t(product.nameBn, product.name)}</h1>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={cn("w-4 h-4", s <= 4 ? "star-filled fill-amber-400" : "star-empty")} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground bangla">(4.0 — {t('১২টি রিভিউ', '12 reviews')})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-primary">{formatPriceEn(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPriceEn(product.originalPrice)}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-bold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="bangla text-muted-foreground leading-relaxed">{t(product.descriptionBn, product.description)}</p>

            {/* Size Selection */}
            {hasSizes && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-2xl border border-border">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  <label className="bangla text-sm font-bold">
                    {t('সাইজ নির্বাচন করুন', 'Select Size')}
                    {!selectedSize && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {selectedSize && (
                    <span className="bangla text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                      {t('নির্বাচিত:', 'Selected:')} {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map(size => (
                    <button key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all duration-200 min-w-[52px]",
                        selectedSize === size
                          ? "border-primary bg-primary text-white shadow-md scale-105"
                          : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                      )}>
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="bangla text-xs text-amber-600 dark:text-amber-400 font-medium">
                    ⚠️ {t('কার্টে যোগ করতে সাইজ নির্বাচন করুন', 'Please select a size to add to cart')}
                  </p>
                )}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full shrink-0", product.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500")} />
              <span className="bangla text-sm font-medium">
                {product.stock > 0
                  ? t(`স্টকে আছে (${product.stock}টি)`, `In Stock (${product.stock})`)
                  : t('স্টকে নেই', 'Out of Stock')}
              </span>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-4">
              <span className="bangla text-sm font-semibold">{t('পরিমাণ:', 'Quantity:')}</span>
              <div className="flex items-center gap-1 border border-border rounded-xl p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-border flex items-center justify-center transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-base">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-9 h-9 rounded-lg bg-muted hover:bg-border flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || !canAddToCart}
                title={!canAddToCart ? t('সাইজ নির্বাচন করুন', 'Select a size first') : ''}
                className="flex-1 btn-primary text-white py-3.5 rounded-2xl font-bold bangla flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ShoppingCart className="w-5 h-5" />
                {!canAddToCart
                  ? t('সাইজ নির্বাচন করুন', 'Select Size First')
                  : t('কার্টে যোগ করুন', 'Add to Cart')}
              </button>
              <button onClick={() => setLiked(!liked)}
                className="w-12 h-12 rounded-2xl border border-border hover:border-red-300 flex items-center justify-center transition-colors shrink-0">
                <Heart className={cn("w-5 h-5 transition-colors", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <Truck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="bangla text-xs font-semibold text-green-700 dark:text-green-400">
                    {t('নারায়ণগঞ্জের ভিতরে', 'Inside Narayanganj')}
                  </p>
                  <p className="bangla text-xs text-green-600 dark:text-green-500">
                    {t('ক্যাশ-অন ডেলিভারি', 'Cash on Delivery')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <Truck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="bangla text-xs font-semibold text-blue-700 dark:text-blue-400">
                    {t('নারায়ণগঞ্জের বাইরে', 'Outside Narayanganj')}
                  </p>
                  <p className="bangla text-xs text-blue-600 dark:text-blue-500">৳100 {t('ডেলিভারি', 'Delivery')}</p>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground bangla p-3 bg-muted/30 rounded-xl border border-border">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              {t('নিরাপদ অর্ডার • বিকাশ পেমেন্ট সাপোর্টেড • দ্রুত ডেলিভারি', 'Secure Order • bKash Supported • Fast Delivery')}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="bangla text-2xl font-extrabold mb-6">{t('সম্পর্কিত পণ্য', 'Related Products')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
