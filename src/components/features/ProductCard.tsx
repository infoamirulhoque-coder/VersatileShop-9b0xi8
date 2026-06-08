import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LanguageContext';
import { formatPriceEn, cn } from '@/lib/utils';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart();
  const { t } = useLang();
  const [liked, setLiked] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [visible, setVisible] = useState(false);

  const fallbackImg = `https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&auto=format`;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const badgeLabel = product.badge === 'new' ? t('নতুন', 'NEW')
    : product.badge === 'hot' ? t('হট', 'HOT')
    : t('সেল', 'SALE');
  const badgeCls = product.badge === 'new' ? 'badge-new'
    : product.badge === 'hot' ? 'badge-hot'
    : 'badge-sale';

  const imgSrc = imgErr ? fallbackImg : (product.images[0] || fallbackImg);

  return (
    <div
      className={cn(
        "product-card glass-card rounded-2xl overflow-hidden group transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      {/* Image Area */}
      <div className="relative img-zoom aspect-square overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={t(product.nameBn, product.name)}
          onError={() => setImgErr(true)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge */}
        {product.badge && (
          <span className={cn(
            "absolute top-2 left-2 px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-lg z-10",
            badgeCls
          )}>
            {badgeLabel}
          </span>
        )}
        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-2 right-10 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold z-10">
            -{discount}%
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md z-10"
          aria-label="Wishlist"
        >
          <Heart className={cn("w-4 h-4 transition-colors", liked ? "fill-red-500 text-red-500" : "text-slate-400")} />
        </button>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <Link to={`/product/${product.id}`}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            aria-label="Quick view">
            <Eye className="w-4 h-4 text-slate-800" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
            aria-label="Add to cart">
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
        {/* Out of Stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <span className="bangla text-white font-bold text-sm bg-red-500 px-3 py-1 rounded-full">
              {t('স্টক শেষ', 'Out of Stock')}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="bangla font-semibold text-foreground text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
            {t(product.nameBn, product.name)}
          </h3>
        </Link>
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-2.5">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className={cn("w-3 h-3", s <= 4 ? "star-filled fill-amber-400" : "star-empty")} />
          ))}
          <span className="text-xs text-muted-foreground ml-1.5">(4.0)</span>
        </div>
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary font-bold text-lg">{formatPriceEn(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-muted-foreground text-sm line-through">{formatPriceEn(product.originalPrice)}</span>
          )}
        </div>
        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full btn-primary text-white py-2.5 rounded-xl text-sm font-semibold bangla flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {t('কার্টে যোগ করুন', 'Add to Cart')}
        </button>
      </div>
    </div>
  );
}
