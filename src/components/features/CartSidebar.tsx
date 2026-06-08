import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LanguageContext';
import { formatPriceEn, cn } from '@/lib/utils';

export default function CartSidebar() {
  const { items, removeFromCart, updateQty, totalPrice, isOpen, closeCart } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 modal-overlay z-50"
          onClick={closeCart}
          aria-label="Close cart"
        />
      )}
      {/* Sidebar Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-96 z-50 bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-l border-border",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="bangla font-bold text-base">{t('আমার কার্ট', 'My Cart')}</h2>
              <p className="bangla text-xs text-muted-foreground">
                {items.length > 0
                  ? t(`${items.reduce((s, i) => s + i.quantity, 0)}টি পণ্য`, `${items.reduce((s, i) => s + i.quantity, 0)} items`)
                  : t('খালি', 'Empty')}
              </p>
            </div>
          </div>
          <button onClick={closeCart}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <div>
                <p className="bangla font-semibold text-foreground mb-1">{t('কার্ট খালি আছে', 'Your cart is empty')}</p>
                <p className="bangla text-muted-foreground text-sm">{t('পণ্য যোগ করুন', 'Add some products')}</p>
              </div>
              <button
                onClick={() => { closeCart(); navigate('/shop'); }}
                className="bangla btn-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {t('কেনাকাটা শুরু করুন', 'Start Shopping')}
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="glass-card rounded-2xl p-3 flex gap-3">
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'}
                  alt={item.product.nameBn}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="bangla text-sm font-semibold line-clamp-2 mb-1">
                    {t(item.product.nameBn, item.product.name)}
                  </h4>
                  <p className="text-primary font-bold text-sm">{formatPriceEn(item.product.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-muted hover:bg-border flex items-center justify-center transition-colors"
                      aria-label="Decrease">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-muted hover:bg-border flex items-center justify-center transition-colors"
                      aria-label="Increase">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 flex items-center justify-center transition-colors"
                      aria-label="Remove">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3 bg-background/95 backdrop-blur-sm shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="bangla text-muted-foreground">{t('সাবটোটাল', 'Subtotal')}</span>
                <span className="font-semibold">{formatPriceEn(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="bangla text-muted-foreground">{t('ডেলিভারি', 'Delivery')}</span>
                <span className="bangla text-xs text-muted-foreground italic">
                  {t('অর্ডারে নির্ধারণ হবে', 'Set at checkout')}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                <span className="bangla">{t('মোট', 'Total')}</span>
                <span className="text-primary text-lg">{formatPriceEn(totalPrice)}</span>
              </div>
            </div>
            {/* Delivery Note */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2.5 border border-green-200 dark:border-green-800">
              <p className="bangla text-xs text-green-700 dark:text-green-400 font-medium text-center">
                ✅ {t('ঢাকায় ক্যাশ-অন ডেলিভারি বিনামূল্যে', 'Free COD in Dhaka')} | 📦 {t('বাইরে ১০০৳', 'Outside ৳100')}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-primary text-white py-3.5 rounded-xl font-bold bangla flex items-center justify-center gap-2 text-base">
              <ShoppingBag className="w-5 h-5" />
              {t('অর্ডার করুন', 'Place Order')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
