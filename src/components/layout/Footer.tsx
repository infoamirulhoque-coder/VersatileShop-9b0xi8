import { Link } from 'react-router-dom';
import { Facebook, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { LOGO_URL, FACEBOOK_PAGE, BKASH_NUMBERS, CATEGORIES } from '@/constants';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={LOGO_URL} alt="Versatile Shop" className="h-14 w-auto object-contain" />
            <p className="bangla text-sm text-slate-400 leading-relaxed">
              {t('বাংলাদেশের সেরা ই-কমার্স শপ। সেরা মানের পণ্য সাশ্রয়ী মূল্যে পান।', 'Bangladesh\'s top e-commerce shop. Get quality products at affordable prices.')}
            </p>
            <div className="flex items-center gap-3">
              <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="bangla text-white font-semibold text-base mb-4">
              {t('বিভাগসমূহ', 'Categories')}
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <Link to={`/shop?category=${cat.id}`}
                    className="bangla text-sm text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{t(cat.nameBn, cat.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="bangla text-white font-semibold text-base mb-4">
              {t('দ্রুত লিংক', 'Quick Links')}
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="bangla text-sm text-slate-400 hover:text-primary transition-colors">{t('হোম', 'Home')}</Link></li>
              <li><Link to="/shop" className="bangla text-sm text-slate-400 hover:text-primary transition-colors">{t('সব পণ্য', 'All Products')}</Link></li>
              <li>
                <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                  className="bangla text-sm text-slate-400 hover:text-primary transition-colors">
                  {t('ফেসবুক পেজ', 'Facebook Page')}
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-slate-800 rounded-xl">
              <p className="bangla text-xs text-slate-400 mb-1">{t('ডেলিভারি তথ্য', 'Delivery Info')}</p>
              <p className="bangla text-xs text-green-400">✅ {t('ঢাকার ভিতরে: ফ্রি', 'Inside Dhaka: Free')}</p>
              <p className="bangla text-xs text-yellow-400">📦 {t('ঢাকার বাইরে: ১০০ টাকা', 'Outside Dhaka: ৳100')}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="bangla text-white font-semibold text-base mb-4">
              {t('যোগাযোগ', 'Contact Us')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 bangla mb-1">{t('বিকাশ নম্বর:', 'Bkash Numbers:')}</p>
                  {BKASH_NUMBERS.map(n => (
                    <p key={n} className="text-sm text-white font-medium">{n}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="bangla text-sm text-slate-400">{t('বাংলাদেশ', 'Bangladesh')}</p>
              </div>
              <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2">
                <Facebook className="w-4 h-4 text-blue-400" />
                <span className="bangla text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  {t('ফেসবুকে মেসেজ করুন', 'Message on Facebook')}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="bangla text-sm text-slate-500">
            © 2024 Versatile Item E-Commerce Shop. {t('সর্বস্বত্ব সংরক্ষিত।', 'All rights reserved.')}
          </p>
          <p className="bangla text-sm text-slate-500 flex items-center gap-1">
            {t('ভালোবাসা দিয়ে তৈরি', 'Made with')} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t('বাংলাদেশে', 'in Bangladesh')}
          </p>
        </div>
      </div>
    </footer>
  );
}
