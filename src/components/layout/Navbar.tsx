import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Globe, Menu, X, Search, Shield } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { LOGO_URL, FACEBOOK_PAGE } from '@/constants';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const { totalItems, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: t('হোম', 'Home') },
    { to: '/shop', label: t('শপ', 'Shop') },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 animate-fade-in-left">
            <img src={LOGO_URL} alt="Versatile Shop" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="bangla font-medium text-foreground hover:text-primary transition-colors duration-200 relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
              className="bangla font-medium text-foreground hover:text-primary transition-colors duration-200 relative group flex items-center gap-1">
              <span className="text-blue-600">f</span> {t('ফেসবুক', 'Facebook')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-muted transition-colors duration-200" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            {/* Language Toggle */}
            <button onClick={toggleLang}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-full bg-muted hover:bg-accent text-sm font-semibold transition-colors duration-200">
              <Globe className="w-4 h-4" />
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-all duration-300" aria-label="Toggle theme">
              {theme === 'light'
                ? <Moon className="w-5 h-5 text-slate-700" />
                : <Sun className="w-5 h-5 text-yellow-400" />
              }
            </button>

            {/* Cart */}
            <button onClick={openCart}
              className="relative p-2 rounded-full hover:bg-muted transition-colors duration-200" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="cart-badge absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Admin */}
            <Link to="/admin" className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors duration-200">
              <Shield className="w-3.5 h-3.5" /> Admin
            </Link>

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-muted transition-colors duration-200">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-3 animate-fade-in-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('পণ্য খুঁজুন...', 'Search products...')}
                autoFocus
                className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary bangla"
              />
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                {t('খুঁজুন', 'Search')}
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-fade-in-down">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className="bangla px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors">
                  {l.label}
                </Link>
              ))}
              <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer"
                className="bangla px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors flex items-center gap-2">
                <span className="text-blue-600 font-bold">f</span> {t('ফেসবুক পেজ', 'Facebook Page')}
              </a>
              <Link to="/admin" onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg hover:bg-muted font-medium transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
              <div className="flex items-center gap-2 px-4 pt-2">
                <button onClick={toggleLang}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm font-semibold">
                  <Globe className="w-4 h-4" /> {lang === 'bn' ? 'English' : 'বাংলা'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
