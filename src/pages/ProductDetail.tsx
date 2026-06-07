import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, Heart, Share2, Plus, Minus } from 'lucide-react';
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

  const fallback = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&auto=format';

  useEffect(() => {
    const all = getProducts();
    const p = all.find(x => x.id === id);
    setProduct(p || null);
    if (p) setRelated(all.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4));
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

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground bangla">
          <Link to="/" className="hover:text-primary transition-colors">{t('হোম', 'Home')}</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary transition-colors">{t('শপ', 'Shop')}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{t(product.nameBn, product.name)}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
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
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn("w-16 h-16 rounded-xl overflow-hidden border-2 transition-all", activeImg === i ? "border-primary" : "border-transparent")}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6 animate-fade-in-right">
            {product.badge && (
              <span className={cn("inline-block px-3 py-1 rounded-full text-white text-xs font-bold",
                product.badge === 'new' ? 'badge-new' : product.badge === 'hot' ? 'badge-hot' : 'badge-sale')}>
                {product.badge === 'new' ? t('নতুন', 'NEW') : product.badge === 'hot' ? 'HOT 🔥' : t('সেল', 'SALE')}
              </span>
            )}
            <h1 className="bangla text-2xl md:text-3xl font-extrabold">{t(product.nameBn, product.name)}</h1>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={cn("w-4 h-4", s <= 4 ? "star-filled fill-amber-400" : "star-empty")} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground bangla">(4.0 - {t('১২টি রিভিউ', '12 reviews')})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-primary">{formatPriceEn(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPriceEn(product.originalPrice)}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-bold">-{discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="bangla text-muted-foreground leading-relaxed">{t(product.descriptionBn, product.description)}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", product.stock > 0 ? "bg-green-500" : "bg-red-500")} />
              <span className="bangla text-sm font-medium">
                {product.stock > 0
                  ? t(`স্টকে আছে (${product.stock}টি)`, `In Stock (${product.stock})`)
                  : t('স্টকে নেই', 'Out of Stock')}
              </span>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-4">
              <span className="bangla text-sm font-medium">{t('পরিমাণ:', 'Quantity:')}</span>
              <div className="flex items-center gap-2 border border-border rounded-xl p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-border flex items-center justify-center transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-border flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product, qty)}
                disabled={product.stock === 0}
                className="flex-1 btn-primary text-white py-3.5 rounded-2xl font-bold bangla flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCart className="w-5 h-5" />
                {t('কার্টে যোগ করুন', 'Add to Cart')}
              </button>
              <button onClick={() => setLiked(!liked)}
                className="w-12 h-12 rounded-2xl border border-border hover:border-red-300 flex items-center justify-center transition-colors">
                <Heart className={cn("w-5 h-5", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <Truck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="bangla text-xs font-semibold text-green-700 dark:text-green-400">{t('ঢাকার ভিতরে', 'Inside Dhaka')}</p>
                  <p className="bangla text-xs text-green-600 dark:text-green-500">{t('ফ্রি ডেলিভারি', 'Free Delivery')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <Truck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="bangla text-xs font-semibold text-blue-700 dark:text-blue-400">{t('ঢাকার বাইরে', 'Outside Dhaka')}</p>
                  <p className="bangla text-xs text-blue-600 dark:text-blue-500">৳100 {t('ডেলিভারি', 'Delivery')}</p>
                </div>
              </div>
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
