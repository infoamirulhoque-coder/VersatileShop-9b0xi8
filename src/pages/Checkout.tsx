import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LanguageContext';
import { addOrder } from '@/lib/storage';
import { generateId, formatPriceEn } from '@/lib/utils';
import { BANGLADESH_DISTRICTS, COD_DISTRICTS, BKASH_NUMBERS, DELIVERY_CHARGE_OUTSIDE } from '@/constants';
import { Order, CustomerInfo } from '@/types';
import { ShoppingBag, Truck, CreditCard, User, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';

type Step = 'info' | 'payment' | 'confirm';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', phone: '', email: '', address: '', district: '', upazila: '', insideNarayanganj: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'cod'>('cod');
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTxId, setBkashTxId] = useState('');
  const [selectedBkash, setSelectedBkash] = useState(BKASH_NUMBERS[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if inside Narayanganj (free COD)
  const isInsideNarayanganj = customer.district !== '' &&
    COD_DISTRICTS.some(d => customer.district === d || customer.district.toLowerCase() === d.toLowerCase());

  const deliveryCharge = isInsideNarayanganj ? 0 : (customer.district ? DELIVERY_CHARGE_OUTSIDE : 0);
  const grandTotal = totalPrice + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center space-y-5">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
          </div>
          <h2 className="bangla text-xl font-bold">{t('কার্ট খালি আছে', 'Cart is empty')}</h2>
          <p className="bangla text-muted-foreground text-sm">{t('প্রথমে পণ্য কার্টে যোগ করুন', 'Please add products to cart first')}</p>
          <button onClick={() => navigate('/shop')}
            className="bangla btn-primary text-white px-8 py-3 rounded-2xl font-bold">
            {t('কেনাকাটা শুরু করুন', 'Start Shopping')}
          </button>
        </div>
      </div>
    );
  }

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!customer.name.trim()) e.name = t('নাম দিন', 'Enter name');
    if (!customer.phone.trim() || customer.phone.length < 11) e.phone = t('সঠিক ফোন নম্বর দিন (১১ সংখ্যা)', 'Enter valid phone (11 digits)');
    if (!customer.address.trim()) e.address = t('ঠিকানা দিন', 'Enter address');
    if (!customer.district) e.district = t('জেলা নির্বাচন করুন', 'Select district');
    if (!customer.upazila.trim()) e.upazila = t('উপজেলা/এলাকা দিন', 'Enter upazila/area');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod === 'cod') return true;
    const e: Record<string, string> = {};
    if (!bkashNumber || bkashNumber.length < 11) e.bkashNumber = t('সঠিক বিকাশ নম্বর দিন', 'Enter valid bkash number');
    if (!bkashTxId.trim()) e.bkashTxId = t('ট্রানজেকশন আইডি দিন', 'Enter transaction ID');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    const order: Order = {
      id: generateId(),
      items,
      customer: { ...customer, insideNarayanganj: isInsideNarayanganj },
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
    }, 1200);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all bangla placeholder:text-muted-foreground";
  const errorClass = "text-red-500 text-xs mt-1.5 bangla flex items-center gap-1";
  const stepIndex = ['info', 'payment', 'confirm'].indexOf(step);
  const stepLabels = [t('তথ্য', 'Info'), t('পেমেন্ট', 'Payment'), t('নিশ্চিত', 'Confirm')];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <h1 className="bangla text-2xl md:text-3xl font-extrabold mb-6 md:mb-8 text-center gradient-text">
          {t('অর্ডার কনফার্ম করুন', 'Confirm Your Order')}
        </h1>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  stepIndex === i ? 'bg-primary text-white ring-4 ring-primary/30 scale-110'
                  : stepIndex > i ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
                }`}>
                  {stepIndex > i ? '✓' : i + 1}
                </div>
                <span className={`bangla text-xs font-medium hidden sm:block ${stepIndex === i ? 'text-primary' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className={`w-10 md:w-14 h-1 rounded-full transition-all duration-300 ${stepIndex > i ? 'bg-green-500' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          <div className="lg:col-span-2">

            {/* Step 1: Info */}
            {step === 'info' && (
              <div className="glass-card rounded-3xl p-5 md:p-6 space-y-5 animate-scale-in">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="bangla text-lg font-bold">{t('ডেলিভারি তথ্য', 'Delivery Information')}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('পূর্ণ নাম *', 'Full Name *')}</label>
                    <input value={customer.name}
                      onChange={e => setCustomer({ ...customer, name: e.target.value })}
                      placeholder={t('আপনার পূর্ণ নাম', 'Your full name')}
                      className={`${inputClass} ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-border'}`} />
                    {errors.name && <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('মোবাইল নম্বর *', 'Phone Number *')}</label>
                    <input value={customer.phone}
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="01XXXXXXXXX" type="tel" maxLength={11}
                      className={`${inputClass} ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-border'}`} />
                    {errors.phone && <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('ইমেইল (ঐচ্ছিক)', 'Email (Optional)')}</label>
                    <input value={customer.email}
                      onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="email@example.com" type="email"
                      className={`${inputClass} border-border`} />
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('জেলা *', 'District *')}</label>
                    <select value={customer.district}
                      onChange={e => setCustomer({ ...customer, district: e.target.value })}
                      className={`${inputClass} cursor-pointer ${errors.district ? 'border-red-400 focus:ring-red-400' : 'border-border'}`}>
                      <option value="">{t('— জেলা নির্বাচন করুন —', '— Select District —')}</option>
                      {BANGLADESH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.district && <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.district}</p>}
                    {customer.district && (
                      <p className={`text-xs mt-1.5 font-semibold bangla flex items-center gap-1 ${isInsideNarayanganj ? 'text-green-600' : 'text-yellow-600'}`}>
                        {isInsideNarayanganj
                          ? t('✅ নারায়ণগঞ্জের ভিতরে — ক্যাশ-অন ডেলিভারি (বিনামূল্যে)!', '✅ Inside Narayanganj — Cash on Delivery (Free)!')
                          : t('📦 নারায়ণগঞ্জের বাইরে — ১০০ টাকা ডেলিভারি চার্জ', '📦 Outside Narayanganj — ৳100 delivery charge')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('উপজেলা / এলাকা *', 'Upazila / Area *')}</label>
                    <input value={customer.upazila}
                      onChange={e => setCustomer({ ...customer, upazila: e.target.value })}
                      placeholder={t('উপজেলা বা এলাকার নাম', 'Upazila or area name')}
                      className={`${inputClass} ${errors.upazila ? 'border-red-400 focus:ring-red-400' : 'border-border'}`} />
                    {errors.upazila && <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.upazila}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('সম্পূর্ণ ঠিকানা *', 'Full Address *')}</label>
                    <textarea value={customer.address}
                      onChange={e => setCustomer({ ...customer, address: e.target.value })}
                      placeholder={t('বাড়ি নং, রাস্তা, মহল্লা, এলাকা...', 'House no, road, area...')} rows={3}
                      className={`${inputClass} resize-none ${errors.address ? 'border-red-400 focus:ring-red-400' : 'border-border'}`} />
                    {errors.address && <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.address}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="bangla text-sm font-semibold mb-1.5 block">{t('বিশেষ নোট (ঐচ্ছিক)', 'Special Note (Optional)')}</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder={t('কোনো বিশেষ নির্দেশনা থাকলে লিখুন...', 'Any special instructions...')} rows={2}
                      className={`${inputClass} border-border resize-none`} />
                  </div>
                </div>
                <button onClick={() => { if (validateInfo()) setStep('payment'); }}
                  className="w-full btn-primary text-white py-4 rounded-2xl font-bold bangla text-base">
                  {t('পরবর্তী: পেমেন্ট পদ্ধতি →', 'Next: Payment Method →')}
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="glass-card rounded-3xl p-5 md:p-6 space-y-5 animate-scale-in">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="bangla text-lg font-bold">{t('পেমেন্ট পদ্ধতি', 'Payment Method')}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={() => setPaymentMethod('cod')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      paymentMethod === 'cod'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                        : 'border-border hover:border-green-300'
                    }`}>
                    <div className="text-3xl mb-2">💵</div>
                    <p className="bangla font-bold text-green-600 dark:text-green-400 mb-1">
                      {t('ক্যাশ-অন ডেলিভারি', 'Cash on Delivery')}
                    </p>
                    <p className="bangla text-xs text-muted-foreground">
                      {isInsideNarayanganj
                        ? t('পণ্য পেয়ে পেমেন্ট করুন (নারায়ণগঞ্জ)', 'Pay when received (Narayanganj)')
                        : t('পণ্য পেয়ে পেমেন্ট করুন', 'Pay when you receive')}
                    </p>
                    {isInsideNarayanganj && (
                      <p className="bangla text-xs text-green-600 font-semibold mt-1">
                        ✅ {t('নারায়ণগঞ্জে বিনামূল্যে', 'Free in Narayanganj')}
                      </p>
                    )}
                  </button>
                  <button onClick={() => setPaymentMethod('bkash')}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md'
                        : 'border-border hover:border-pink-300'
                    }`}>
                    <div className="text-3xl mb-2">💳</div>
                    <p className="font-bold text-pink-600 dark:text-pink-400 mb-1">bKash</p>
                    <p className="bangla text-xs text-muted-foreground">{t('বিকাশে সেন্ড মানি করুন', 'Send money via bKash')}</p>
                    <p className="bangla text-xs text-pink-500 font-semibold mt-1">📱 {t('সারাদেশে', 'Nationwide')}</p>
                  </button>
                </div>

                {paymentMethod === 'bkash' && (
                  <div className="space-y-4 p-4 md:p-5 bg-pink-50 dark:bg-pink-900/10 rounded-2xl border border-pink-200 dark:border-pink-800">
                    <p className="bangla text-sm font-semibold text-pink-700 dark:text-pink-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {t('নিচের নম্বরে সেন্ড মানি করুন:', 'Send money to the number below:')}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {BKASH_NUMBERS.map(n => (
                        <button key={n} onClick={() => setSelectedBkash(n)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            selectedBkash === n
                              ? 'border-pink-500 bg-pink-100 dark:bg-pink-900/30'
                              : 'border-pink-200 bg-white dark:bg-slate-800 hover:border-pink-400'
                          }`}>
                          <p className="bangla text-xs text-muted-foreground mb-1">{t('বিকাশ নম্বর', 'Bkash No.')}</p>
                          <p className="font-bold text-pink-600 text-lg">{n}</p>
                        </button>
                      ))}
                    </div>
                    <div className="bg-pink-100 dark:bg-pink-900/20 rounded-xl p-3">
                      <p className="bangla text-sm text-pink-700 dark:text-pink-300 font-medium">
                        💰 {t('মোট:', 'Total:')} <strong>{formatPriceEn(grandTotal)}</strong> {t('পাঠান। তারপর নিচে ট্রানজেকশন আইডি দিন।', 'Send. Then enter Transaction ID below.')}
                      </p>
                    </div>
                    <div>
                      <label className="bangla text-sm font-semibold mb-1.5 block">{t('আপনার বিকাশ নম্বর *', 'Your Bkash Number *')}</label>
                      <input value={bkashNumber} onChange={e => setBkashNumber(e.target.value)}
                        placeholder="01XXXXXXXXX" maxLength={11} type="tel"
                        className={`${inputClass} ${errors.bkashNumber ? 'border-red-400' : 'border-pink-200 dark:border-pink-800'}`} />
                      {errors.bkashNumber && <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.bkashNumber}</p>}
                    </div>
                    <div>
                      <label className="bangla text-sm font-semibold mb-1.5 block">{t('ট্রানজেকশন আইডি *', 'Transaction ID *')}</label>
                      <input value={bkashTxId} onChange={e => setBkashTxId(e.target.value)}
                        placeholder={t('যেমন: ABC1234567', 'e.g: ABC1234567')}
                        className={`${inputClass} ${errors.bkashTxId ? 'border-red-400' : 'border-pink-200 dark:border-pink-800'}`} />
                      {errors.bkashTxId && <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.bkashTxId}</p>}
                    </div>
                  </div>
                )}
                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-800">
                    <p className="bangla text-sm text-green-700 dark:text-green-400 font-medium">
                      ✅ {isInsideNarayanganj
                        ? t('নারায়ণগঞ্জে পণ্য পেয়ে নগদে পেমেন্ট করুন — সম্পূর্ণ বিনামূল্যে ডেলিভারি!',
                           'Pay cash on delivery in Narayanganj — completely free delivery!')
                        : t('পণ্য ডেলিভারির সময় নগদে পেমেন্ট করুন।', 'Pay in cash when you receive the product.')}
                    </p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep('info')}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-border font-semibold bangla hover:bg-muted transition-colors">
                    <ChevronLeft className="w-4 h-4" /> {t('পিছনে', 'Back')}
                  </button>
                  <button onClick={() => { if (validatePayment()) setStep('confirm'); }}
                    className="flex-1 btn-primary text-white py-3 rounded-2xl font-bold bangla">
                    {t('অর্ডার পর্যালোচনা করুন →', 'Review Order →')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 'confirm' && (
              <div className="glass-card rounded-3xl p-5 md:p-6 space-y-5 animate-scale-in">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="bangla text-lg font-bold">{t('অর্ডার নিশ্চিত করুন', 'Confirm Your Order')}</h2>
                </div>
                <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
                  <h3 className="bangla font-semibold text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    {t('ডেলিভারি তথ্য', 'Delivery Info')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="bangla text-muted-foreground">{t('নাম:', 'Name:')}</span>
                      <span className="font-semibold bangla ml-1">{customer.name}</span>
                    </div>
                    <div>
                      <span className="bangla text-muted-foreground">{t('ফোন:', 'Phone:')}</span>
                      <span className="font-semibold ml-1">{customer.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="bangla text-muted-foreground">{t('ঠিকানা:', 'Address:')}</span>
                      <span className="font-semibold bangla ml-1">{customer.address}, {customer.upazila}, {customer.district}</span>
                    </div>
                    <div>
                      <span className="bangla text-muted-foreground">{t('পেমেন্ট:', 'Payment:')}</span>
                      <span className={`font-semibold bangla ml-1 ${paymentMethod === 'cod' ? 'text-green-600' : 'text-pink-600'}`}>
                        {paymentMethod === 'bkash' ? 'বিকাশ' : t('ক্যাশ-অন ডেলিভারি', 'Cash on Delivery')}
                      </span>
                    </div>
                    {paymentMethod === 'bkash' && (
                      <div>
                        <span className="bangla text-muted-foreground">Txn ID:</span>
                        <span className="font-semibold ml-1 text-pink-600">{bkashTxId}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="bangla font-semibold text-sm">{t('অর্ডার আইটেম', 'Order Items')}</h3>
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                      <img src={item.product.images[0] || ''} alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-border shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="bangla text-sm font-medium line-clamp-1">
                          {t(item.product.nameBn, item.product.name)} × {item.quantity}
                        </span>
                        {item.size && <p className="text-xs text-muted-foreground bangla">সাইজ: {item.size}</p>}
                      </div>
                      <span className="text-sm font-bold text-primary shrink-0">{formatPriceEn(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('payment')}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-border font-semibold bangla hover:bg-muted transition-colors">
                    <ChevronLeft className="w-4 h-4" /> {t('পিছনে', 'Back')}
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="flex-1 btn-secondary text-white py-3 rounded-2xl font-bold bangla flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('প্রক্রিয়াকরণ...', 'Processing...')}</>
                    ) : (
                      <><CheckCircle className="w-5 h-5" />
                        {t('অর্ডার কনফার্ম করুন!', 'Confirm Order!')}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="glass-card rounded-3xl p-5 sticky top-24">
              <h3 className="bangla font-bold text-base mb-5 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                {t('অর্ডার সারাংশ', 'Order Summary')}
              </h3>
              <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex justify-between items-start text-sm gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="bangla text-muted-foreground line-clamp-1">
                        {t(item.product.nameBn, item.product.name)} ×{item.quantity}
                      </span>
                      {item.size && <p className="text-xs text-muted-foreground">সাইজ: {item.size}</p>}
                    </div>
                    <span className="font-semibold shrink-0">{formatPriceEn(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="bangla text-muted-foreground">{t('সাবটোটাল', 'Subtotal')}</span>
                  <span className="font-medium">{formatPriceEn(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="bangla text-muted-foreground">{t('ডেলিভারি', 'Delivery')}</span>
                  <span className={deliveryCharge === 0 && customer.district ? 'text-green-500 font-semibold bangla' : 'font-medium'}>
                    {!customer.district
                      ? t('পরে নির্ধারণ', 'TBD')
                      : deliveryCharge === 0 ? t('বিনামূল্যে', 'FREE')
                      : formatPriceEn(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span className="bangla">{t('সর্বমোট', 'Grand Total')}</span>
                  <span className="text-primary text-xl">{formatPriceEn(grandTotal)}</span>
                </div>
              </div>
              {customer.district && (
                <div className={`mt-4 p-3 rounded-xl text-xs bangla font-semibold text-center ${
                  isInsideNarayanganj
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {isInsideNarayanganj
                    ? t('✅ নারায়ণগঞ্জে ক্যাশ-অন ডেলিভারি — বিনামূল্যে!', '✅ COD in Narayanganj — Free!')
                    : t('📦 নারায়ণগঞ্জের বাইরে — ১০০ টাকা ডেলিভারি চার্জ', '📦 Outside Narayanganj — ৳100 charge')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
