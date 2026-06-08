import { useState, useEffect, useCallback } from 'react';
import { X, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { getAnnouncements } from '@/lib/storage';
import { Announcement } from '@/types';

export default function AnnouncementBar() {
  const { t } = useLang();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const loadAnnouncements = useCallback(() => {
    const active = getAnnouncements().filter(a => a.active);
    setAnnouncements(active);
  }, []);

  useEffect(() => {
    loadAnnouncements();
    // Refresh announcements periodically
    const interval = setInterval(loadAnnouncements, 3000);
    return () => clearInterval(interval);
  }, [loadAnnouncements]);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(i => (i + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[currentIdx];
  const text = t(current.textBn, current.text);

  const typeColors: Record<Announcement['type'], string> = {
    info: 'from-cyan-700 via-teal-700 to-cyan-700',
    promo: 'from-primary via-cyan-600 to-primary',
    warning: 'from-amber-600 via-orange-600 to-amber-600',
    success: 'from-green-700 via-emerald-700 to-green-700',
  };

  return (
    <div className={`bg-gradient-to-r ${typeColors[current.type]} text-white py-2.5 px-4 relative overflow-hidden z-40`}>
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 animate-shimmer" />

      <div className="max-w-7xl mx-auto flex items-center gap-3 relative z-10">
        <Megaphone className="w-4 h-4 shrink-0 animate-pulse" />

        <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
          {announcements.length > 1 && (
            <button onClick={() => setCurrentIdx((currentIdx - 1 + announcements.length) % announcements.length)}
              className="p-0.5 hover:bg-white/20 rounded transition-colors shrink-0">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <p className="bangla text-sm font-medium text-center line-clamp-1 transition-all duration-300">{text}</p>
          {announcements.length > 1 && (
            <button onClick={() => setCurrentIdx((currentIdx + 1) % announcements.length)}
              className="p-0.5 hover:bg-white/20 rounded transition-colors shrink-0">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {announcements.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {announcements.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? 'bg-white w-3' : 'bg-white/40'}`} />
            ))}
          </div>
        )}

        <button onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
