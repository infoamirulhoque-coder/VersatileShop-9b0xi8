import { Link } from 'react-router-dom';
import { Facebook, Phone, MapPin, Heart, Code2 } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { LOGO_URL, FACEBOOK_PAGE, BKASH_NUMBERS, CATEGORIES, DEVELOPER_NAME } from '@/constants';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={LOGO_URL} alt="Versatile Shop" className="h-14 w-auto object-contain" />
            <p className="bangla text-sm text-slate-400 leading-relaxed">
              {t(
                'বাংলাদেশের সেরা ই-কমার্স শপ। সেরা মানের পণ্য সাশ্রয়ী মূল্যে পান। নারায়ণগঞ্জে ক্যাশ-অন ডেলিভারি।',
                "Bangladesh's top e-commerce shop. Quality products at best prices. COD in Narayanganj."
              )}
            </p>
            <div className="flex items-center gap-3">
              <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors hover:scale-110 duration-300">
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="bangla text-white font-bold text-base mb-5">
              {t('বিভাগসমূহ', 'Categories')}
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <li key={cat.id}>
                  <Link to={`/shop?category=${cat.id}`}
                    className="bangla text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="group-hover:scale-110 transition-transform inline-block">{cat.icon}</span>
                    <span>{t(cat.nameBn, cat.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="bangla text-white font-bold text-base mb-5">
              {t('দ্রুত লিংক', 'Quick Links')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="bangla text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>→</span>{t('হোম', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="bangla text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>→</span>{t('সব পণ্য', 'All Products')}
                </Link>
              </li>
              <li>
                <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                  className="bangla text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>→</span>{t('ফেসবুক পেজ', 'Facebook Page')}
                </a>
              </li>
            </ul>

            {/* Delivery Info Box */}
            <div className="mt-5 p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
              <p className="bangla text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">
                {t('ডেলিভারি তথ্য', 'Delivery Info')}
              </p>
              <p className="bangla text-sm text-green-400 font-medium mb-1">
                ✅ {t('নারায়ণগঞ্জের ভিতরে: ক্যাশ-অন ডেলিভারি', 'Inside Narayanganj: Cash on Delivery')}
              </p>
              <p className="bangla text-sm text-yellow-400 font-medium">
                📦 {t('নারায়ণগঞ্জের বাইরে: মাত্র ১০০ টাকা', 'Outside Narayanganj: Only ৳100')}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="bangla text-white font-bold text-base mb-5">
              {t('যোগাযোগ', 'Contact Us')}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <p className="bangla text-xs text-slate-400 mb-1.5 font-medium">{t('বিকাশ নম্বর:', 'Bkash Numbers:')}</p>
                  {BKASH_NUMBERS.map(n => (
                    <p key={n} className="text-base text-white font-bold tracking-wide mb-0.5">{n}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <p className="bangla text-sm text-slate-400">{t('বাংলাদেশ', 'Bangladesh')}</p>
              </div>
              <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-900/30 rounded-xl border border-blue-800/50 hover:bg-blue-900/50 transition-colors">
                <Facebook className="w-4 h-4 text-blue-400" />
                <span className="bangla text-sm text-blue-400 font-medium">
                  {t('ফেসবুকে মেসেজ করুন', 'Message on Facebook')}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="bangla text-sm text-slate-500">
              © 2024 Versatile Item E-Commerce Shop. {t('সর্বস্বত্ব সংরক্ষিত।', 'All rights reserved.')}
            </p>
            <p className="bangla text-sm text-slate-500 flex items-center gap-1">
              {t('ভালোবাসা দিয়ে তৈরি', 'Made with')} <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-0.5" /> {t('বাংলাদেশে', 'in Bangladesh')}
            </p>
          </div>
          {/* Developer Credit */}
          <div className="flex justify-center">
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Code2 className="w-3 h-3 text-cyan-600" />
              <span>Developed by </span>
              <span className="text-cyan-500 font-semibold">{DEVELOPER_NAME}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
