import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LanguageContext';
import { formatPriceEn, cn } from '@/lib/utils';
import { DELIVERY_CHARGE_INSIDE_DHAKA } from '@/constants';

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
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 modal-overlay z-50" onClick={closeCart} />
      )}
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-96 z-50 bg-background shadow-2xl flex flex-col transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="bangla font-bold text-lg">{t('আমার কার্ট', 'My Cart')}</h2>
          </div>
          <button onClick={closeCart} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
              <p className="bangla text-muted-foreground">{t('কার্ট খালি আছে', 'Your cart is empty')}</p>
              <button onClick={() => { closeCart(); navigate('/shop'); }}
                className="bangla btn-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
                {t('কেনাকাটা শুরু করুন', 'Start Shopping')}
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="glass-card rounded-xl p-3 flex gap-3 animate-scale-in">
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'}
                  alt={item.product.nameBn}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="bangla text-sm font-semibold line-clamp-2 mb-1">{t(item.product.nameBn, item.product.name)}</h4>
                  <p className="text-primary font-bold text-sm">{formatPriceEn(item.product.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors">
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
          <div className="p-4 border-t border-border space-y-3 bg-background">
            <div className="flex justify-between items-center">
              <span className="bangla text-muted-foreground text-sm">{t('সাবটোটাল', 'Subtotal')}</span>
              <span className="font-semibold">{formatPriceEn(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="bangla text-muted-foreground text-sm">{t('ডেলিভারি চার্জ', 'Delivery')}</span>
              <span className="text-green-500 font-semibold text-sm">{t('অর্ডারে নির্ধারণ হবে', 'Determined at order')}</span>
            </div>
            <button onClick={handleCheckout}
              className="w-full btn-secondary text-white py-3 rounded-xl font-bold bangla flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t('অর্ডার করুন', 'Place Order')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
