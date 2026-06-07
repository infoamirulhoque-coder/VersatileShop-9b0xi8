import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home, Facebook, Phone } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { Order } from '@/types';
import { formatPriceEn, formatDateEn } from '@/lib/utils';
import { FACEBOOK_PAGE, BKASH_NUMBERS } from '@/constants';

export default function OrderSuccess() {
  const { state } = useLocation();
  const { t } = useLang();
  const order: Order | undefined = state?.order;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20 px-4">
      <div className="max-w-lg w-full space-y-6 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce-in">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <div className="animate-fade-in-up">
          <h1 className="bangla text-2xl md:text-3xl font-extrabold text-green-600 mb-2">
            {t('অর্ডার সফলভাবে দেওয়া হয়েছে!', 'Order Placed Successfully!')}
          </h1>
          <p className="bangla text-muted-foreground">
            {t('ধন্যবাদ! আপনার অর্ডার পেয়েছি। শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।', 'Thank you! We received your order. We will contact you soon.')}
          </p>
        </div>

        {order && (
          <div className="glass-card rounded-3xl p-6 text-left space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h2 className="bangla font-bold">{t('অর্ডার বিবরণ', 'Order Details')}</h2>
              <span className="text-xs text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="bangla text-muted-foreground text-xs">{t('নাম', 'Name')}</p>
                <p className="bangla font-semibold">{order.customer.name}</p>
              </div>
              <div>
                <p className="bangla text-muted-foreground text-xs">{t('ফোন', 'Phone')}</p>
                <p className="font-semibold">{order.customer.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="bangla text-muted-foreground text-xs">{t('ঠিকানা', 'Address')}</p>
                <p className="bangla font-semibold">{order.customer.address}, {order.customer.upazila}, {order.customer.district}</p>
              </div>
              <div>
                <p className="bangla text-muted-foreground text-xs">{t('পেমেন্ট', 'Payment')}</p>
                <p className="bangla font-semibold">{order.paymentMethod === 'bkash' ? 'বিকাশ' : 'ক্যাশ অন ডেলিভারি'}</p>
              </div>
              <div>
                <p className="bangla text-muted-foreground text-xs">{t('ডেলিভারি', 'Delivery')}</p>
                <p className={`font-semibold bangla ${order.deliveryCharge === 0 ? 'text-green-500' : ''}`}>
                  {order.deliveryCharge === 0 ? t('ফ্রি', 'FREE') : formatPriceEn(order.deliveryCharge)}
                </p>
              </div>
            </div>
            {/* Items */}
            <div className="border-t border-border pt-3">
              {order.items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm py-1">
                  <span className="bangla">{t(item.product.nameBn, item.product.name)} ×{item.quantity}</span>
                  <span className="font-medium">{formatPriceEn(item.product.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-2">
                <span className="bangla">{t('সর্বমোট', 'Total')}</span>
                <span className="text-primary">{formatPriceEn(order.totalAmount)}</span>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
              <p className="bangla text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                ⏱ {t('অর্ডার স্ট্যাটাস: অপেক্ষমাণ — আমরা শীঘ্রই কনফার্ম করব', 'Order Status: Pending — We will confirm soon')}
              </p>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
          <Link to="/" className="flex-1 bangla btn-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> {t('হোমে যান', 'Go Home')}
          </Link>
          <Link to="/shop" className="flex-1 bangla btn-secondary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" /> {t('আরও কিনুন', 'Shop More')}
          </Link>
        </div>
        <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
          className="bangla flex items-center justify-center gap-2 text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium">
          <Facebook className="w-4 h-4" /> {t('ফেসবুকে আমাদের ফলো করুন', 'Follow us on Facebook')}
        </a>
      </div>
    </div>
  );
}
