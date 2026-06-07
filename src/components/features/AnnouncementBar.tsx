import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { getAnnouncements } from '@/lib/storage';
import { Announcement } from '@/types';

export default function AnnouncementBar() {
  const { t } = useLang();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setAnnouncements(getAnnouncements().filter(a => a.active));
  }, []);

  if (dismissed || announcements.length === 0) return null;

  const combined = announcements.map(a => t(a.textBn, a.text)).join('  •  ');

  return (
    <div className="announcement-bar text-white py-2 px-4 relative overflow-hidden z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <Megaphone className="w-4 h-4 shrink-0 animate-pulse" />
        <div className="ticker-wrapper flex-1">
          <span className="bangla text-sm font-medium animate-ticker inline-block">{combined}</span>
        </div>
        <button onClick={() => setDismissed(true)}
          className="shrink-0 p-0.5 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
