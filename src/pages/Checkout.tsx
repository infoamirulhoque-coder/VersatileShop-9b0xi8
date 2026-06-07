import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LanguageContext';
import { addOrder } from '@/lib/storage';
import { generateId, formatPriceEn } from '@/lib/utils';
import { BANGLADESH_DISTRICTS, DHAKA_DISTRICTS, BKASH_NUMBERS, DELIVERY_CHARGE_OUTSIDE_DHAKA } from '@/constants';
import { Order, CustomerInfo } from '@/types';
import { ShoppingBag, Truck, CreditCard, Phone, MapPin, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

type Step = 'info' | 'payment' | 'confirm';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', phone: '', email: '', address: '', district: '', upazila: '', insideDhaka: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod'>('bkash');
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTxId, setBkashTxId] = useState('');
  const [selectedBkash, setSelectedBkash] = useState(BKASH_NUMBERS[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isInsideDhaka = DHAKA_DISTRICTS.some(d => customer.district.includes(d) || d.includes(customer.district)) && customer.district !== '';
  const deliveryCharge = isInsideDhaka ? 0 : DELIVERY_CHARGE_OUTSIDE_DHAKA;
  const grandTotal = totalPrice + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto" />
          <h2 className="bangla text-xl font-bold">{t('কার্ট খালি আছে', 'Cart is empty')}</h2>
          <button onClick={() => navigate('/shop')} className="bangla btn-primary text-white px-6 py-2.5 rounded-xl">
            {t('কেনাকাটা শুরু করুন', 'Start Shopping')}
          </button>
        </div>
      </div>
    );
  }

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!customer.name.trim()) e.name = t('নাম দিন', 'Enter name');
    if (!customer.phone.trim() || customer.phone.length < 11) e.phone = t('সঠিক ফোন নম্বর দিন', 'Enter valid phone');
    if (!customer.address.trim()) e.address = t('ঠিকানা দিন', 'Enter address');
    if (!customer.district) e.district = t('জেলা নির্বাচন করুন', 'Select district');
    if (!customer.upazila.trim()) e.upazila = t('উপজেলা/এলাকা দিন', 'Enter upazila/area');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (paymentMethod === 'bkash') {
      if (!bkashNumber || bkashNumber.length < 11) e.bkashNumber = t('সঠিক বিকাশ নম্বর দিন', 'Enter valid bkash number');
      if (!bkashTxId.trim()) e.bkashTxId = t('ট্রানজেকশন আইডি দিন', 'Enter transaction ID');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    const order: Order = {
      id: generateId(),
      items,
      customer: { ...customer, insideDhaka: isInsideDhaka },
      paymentMethod,
      bkashNumber: paymentMethod === 'bkash' ? bkashNumber : undefined,
      bkashTransactionId: paymentMethod === 'bkash' ? bkashTxId : undefined,
      totalAmount: grandTotal,
      deliveryCharge,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes,
    };
    setTimeout(() => {
      addOrder(order);
      clearCart();
      setLoading(false);
      navigate('/order-success', { state: { order } });
    }, 1500);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all bangla";
  const errorClass = "text-red-500 text-xs mt-1 bangla";

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="bangla text-2xl md:text-3xl font-extrabold mb-8 text-center">
          {t('অর্ডার কনফার্ম করুন', 'Confirm Your Order')}
        </h1>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['info', 'payment', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s ? 'bg-primary text-white' : ((['info', 'payment', 'confirm'].indexOf(step) > i) ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground')}`}>
                {['info', 'payment', 'confirm'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              <span className={`bangla text-xs font-medium hidden sm:block ${step === s ? 'text-primary' : 'text-muted-foreground'}`}>
                {s === 'info' ? t('তথ্য', 'Info') : s === 'payment' ? t('পেমেন্ট', 'Payment') : t('নিশ্চিত', 'Confirm')}
              </span>
              {i < 2 && <div className="w-8 h-0.5 bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Info */}
            {step === 'info' && (
              <div className="glass-card rounded-3xl p-6 space-y-5 animate-scale-in">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="bangla text-lg font-bold">{t('ডেলিভারি তথ্য', 'Delivery Information')}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('পূর্ণ নাম *', 'Full Name *')}</label>
                    <input value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}
                      placeholder={t('আপনার নাম', 'Your name')} className={`${inputClass} ${errors.name ? 'border-red-400' : 'border-border'}`} />
                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('মোবাইল নম্বর *', 'Phone Number *')}</label>
                    <input value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="01XXXXXXXXX" type="tel" maxLength={11} className={`${inputClass} ${errors.phone ? 'border-red-400' : 'border-border'}`} />
                    {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('ইমেইল (ঐচ্ছিক)', 'Email (Optional)')}</label>
                    <input value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="email@example.com" type="email" className={`${inputClass} border-border`} />
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('জেলা *', 'District *')}</label>
                    <select value={customer.district} onChange={e => setCustomer({ ...customer, district: e.target.value })}
                      className={`${inputClass} cursor-pointer ${errors.district ? 'border-red-400' : 'border-border'}`}>
                      <option value="">{t('জেলা নির্বাচন করুন', 'Select District')}</option>
                      {BANGLADESH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.district && <p className={errorClass}>{errors.district}</p>}
                    {customer.district && (
                      <p className={`text-xs mt-1 font-medium bangla ${isInsideDhaka ? 'text-green-500' : 'text-yellow-500'}`}>
                        {isInsideDhaka ? t('✅ ঢাকার ভিতরে — ফ্রি ডেলিভারি!', '✅ Inside Dhaka — Free Delivery!') : t('📦 ঢাকার বাইরে — ১০০ টাকা ডেলিভারি চার্জ', '📦 Outside Dhaka — ৳100 delivery charge')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('উপজেলা / এলাকা *', 'Upazila / Area *')}</label>
                    <input value={customer.upazila} onChange={e => setCustomer({ ...customer, upazila: e.target.value })}
                      placeholder={t('উপজেলা বা এলাকার নাম', 'Upazila or area name')} className={`${inputClass} ${errors.upazila ? 'border-red-400' : 'border-border'}`} />
                    {errors.upazila && <p className={errorClass}>{errors.upazila}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('সম্পূর্ণ ঠিকানা *', 'Full Address *')}</label>
                    <textarea value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })}
                      placeholder={t('বাড়ি নং, রাস্তা, মহল্লা, এলাকা...', 'House no, road, area...')} rows={3}
                      className={`${inputClass} resize-none ${errors.address ? 'border-red-400' : 'border-border'}`} />
                    {errors.address && <p className={errorClass}>{errors.address}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('বিশেষ নোট (ঐচ্ছিক)', 'Special Note (Optional)')}</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder={t('কোনো বিশেষ নির্দেশনা থাকলে লিখুন...', 'Any special instructions...')} rows={2}
                      className={`${inputClass} border-border resize-none`} />
                  </div>
                </div>
                <button onClick={() => { if (validateInfo()) setStep('payment'); }}
                  className="w-full btn-primary text-white py-3.5 rounded-2xl font-bold bangla text-base">
                  {t('পরবর্তী: পেমেন্ট', 'Next: Payment')}
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="glass-card rounded-3xl p-6 space-y-5 animate-scale-in">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="bangla text-lg font-bold">{t('পেমেন্ট পদ্ধতি', 'Payment Method')}</h2>
                </div>
                {/* Payment options */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={() => setPaymentMethod('bkash')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-border'}`}>
                    <div className="text-2xl mb-2">💳</div>
                    <p className="font-bold text-pink-600">bKash</p>
                    <p className="bangla text-xs text-muted-foreground">{t('বিকাশে সেন্ড মানি', 'Send money via bKash')}</p>
                  </button>
                  <button onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-border'}`}>
                    <div className="text-2xl mb-2">💵</div>
                    <p className="font-bold text-green-600">{t('ক্যাশ অন ডেলিভারি', 'Cash on Delivery')}</p>
                    <p className="bangla text-xs text-muted-foreground">{t('পণ্য পেয়ে পেমেন্ট করুন', 'Pay when you receive')}</p>
                  </button>
                </div>

                {paymentMethod === 'bkash' && (
                  <div className="space-y-4 p-4 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-200 dark:border-pink-800">
                    <div className="flex items-center gap-2 text-pink-700 dark:text-pink-400">
                      <AlertCircle className="w-4 h-4" />
                      <p className="bangla text-sm font-semibold">{t('নিচের নম্বরে সেন্ড মানি করুন:', 'Send money to number below:')}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {BKASH_NUMBERS.map(n => (
                        <button key={n} onClick={() => setSelectedBkash(n)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${selectedBkash === n ? 'border-pink-500 bg-pink-100 dark:bg-pink-900/30' : 'border-pink-200 bg-white dark:bg-slate-800'}`}>
                          <p className="text-xs text-muted-foreground bangla mb-0.5">{t('বিকাশ নম্বর', 'Bkash No.')}</p>
                          <p className="font-bold text-pink-600 text-sm">{n}</p>
                        </button>
                      ))}
                    </div>
                    <p className="bangla text-xs text-pink-600 dark:text-pink-400 font-medium">
                      💰 {t(`মোট `, 'Total: ')} <strong>{formatPriceEn(grandTotal)}</strong> {t('পাঠান। ট্রানজেকশন আইডি সংরক্ষণ করুন।', 'Send. Keep the Transaction ID.')}
                    </p>
                    <div>
                      <label className="bangla text-sm font-semibold mb-1.5 block">{t('আপনার বিকাশ নম্বর *', 'Your Bkash Number *')}</label>
                      <input value={bkashNumber} onChange={e => setBkashNumber(e.target.value)}
                        placeholder="01XXXXXXXXX" maxLength={11} type="tel"
                        className={`${inputClass} ${errors.bkashNumber ? 'border-red-400' : 'border-border'}`} />
                      {errors.bkashNumber && <p className={errorClass}>{errors.bkashNumber}</p>}
                    </div>
                    <div>
                      <label className="bangla text-sm font-semibold mb-1.5 block">{t('ট্রানজেকশন আইডি *', 'Transaction ID *')}</label>
                      <input value={bkashTxId} onChange={e => setBkashTxId(e.target.value)}
                        placeholder={t('যেমন: 8XY12345', 'e.g: 8XY12345')}
                        className={`${inputClass} ${errors.bkashTxId ? 'border-red-400' : 'border-border'}`} />
                      {errors.bkashTxId && <p className={errorClass}>{errors.bkashTxId}</p>}
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800">
                    <p className="bangla text-sm text-green-700 dark:text-green-400">
                      ✅ {t('পণ্য ডেলিভারির সময় নগদে পেমেন্ট করুন।', 'Pay in cash when you receive the product.')}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep('info')}
                    className="flex-1 py-3 rounded-2xl border border-border font-semibold bangla hover:bg-muted transition-colors">
                    {t('পিছনে', 'Back')}
                  </button>
                  <button onClick={() => { if (validatePayment()) setStep('confirm'); }}
                    className="flex-1 btn-primary text-white py-3 rounded-2xl font-bold bangla">
                    {t('পর্যালোচনা করুন', 'Review Order')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 'confirm' && (
              <div className="glass-card rounded-3xl p-6 space-y-5 animate-scale-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h2 className="bangla text-lg font-bold">{t('অর্ডার নিশ্চিত করুন', 'Confirm Order')}</h2>
                </div>
                {/* Customer summary */}
                <div className="bg-muted/50 rounded-2xl p-4 space-y-2">
                  <h3 className="bangla font-semibold text-sm mb-3">{t('ডেলিভারি তথ্য', 'Delivery Info')}</h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="bangla text-muted-foreground">{t('নাম:', 'Name:')}</span> <span className="font-medium bangla">{customer.name}</span></div>
                    <div><span className="bangla text-muted-foreground">{t('ফোন:', 'Phone:')}</span> <span className="font-medium">{customer.phone}</span></div>
                    <div className="sm:col-span-2"><span className="bangla text-muted-foreground">{t('ঠিকানা:', 'Address:')}</span> <span className="font-medium bangla">{customer.address}, {customer.upazila}, {customer.district}</span></div>
                    <div><span className="bangla text-muted-foreground">{t('পেমেন্ট:', 'Payment:')}</span> <span className="font-medium bangla">{paymentMethod === 'bkash' ? 'বিকাশ' : 'ক্যাশ অন ডেলিভারি'}</span></div>
                    {paymentMethod === 'bkash' && <div><span className="bangla text-muted-foreground">Txn ID:</span> <span className="font-medium">{bkashTxId}</span></div>}
                  </div>
                </div>
                {/* Items summary */}
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 p-2 rounded-xl bg-muted/30">
                      <img src={item.product.images[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="bangla text-sm flex-1">{t(item.product.nameBn, item.product.name)} × {item.quantity}</span>
                      <span className="text-sm font-semibold text-primary">{formatPriceEn(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')}
                    className="flex-1 py-3 rounded-2xl border border-border font-semibold bangla hover:bg-muted transition-colors">
                    {t('পিছনে', 'Back')}
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="flex-1 btn-secondary text-white py-3 rounded-2xl font-bold bangla flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t('প্রক্রিয়াকরণ...', 'Processing...')}</>
                    ) : (
                      <><CheckCircle className="w-4 h-4" /> {t('অর্ডার কনফার্ম করুন!', 'Confirm Order!')}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="glass-card rounded-3xl p-5 sticky top-24">
              <h3 className="bangla font-bold text-base mb-4">{t('অর্ডার সারাংশ', 'Order Summary')}</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="bangla text-muted-foreground line-clamp-1 flex-1">{t(item.product.nameBn, item.product.name)} ×{item.quantity}</span>
                    <span className="font-medium ml-2">{formatPriceEn(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="bangla text-muted-foreground">{t('সাবটোটাল', 'Subtotal')}</span>
                  <span>{formatPriceEn(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="bangla text-muted-foreground">{t('ডেলিভারি চার্জ', 'Delivery')}</span>
                  <span className={deliveryCharge === 0 ? 'text-green-500 font-medium bangla' : 'font-medium'}>
                    {deliveryCharge === 0 ? t('ফ্রি', 'FREE') : formatPriceEn(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                  <span className="bangla">{t('সর্বমোট', 'Grand Total')}</span>
                  <span className="text-primary text-lg">{formatPriceEn(grandTotal)}</span>
                </div>
              </div>
              {customer.district && (
                <div className={`mt-3 p-2 rounded-xl text-xs bangla font-medium text-center ${isInsideDhaka ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'}`}>
                  {isInsideDhaka ? t('✅ ঢাকার ভিতরে ফ্রি ডেলিভারি', '✅ Free delivery inside Dhaka') : t('📦 ঢাকার বাইরে ১০০ টাকা ডেলিভারি', '📦 ৳100 outside Dhaka')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
