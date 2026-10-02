import React, { useState, useEffect } from 'react';
import { Announcement } from '../../types';
import { Megaphone, AlertCircle, Sparkles, BookOpen, Code2 } from 'lucide-react';

interface TickerBarProps {
  announcements: Announcement[];
}

export const TickerBar: React.FC<TickerBarProps> = ({ announcements }) => {
  const activeAnnouncements = announcements.filter((a) => a.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  const current: Announcement = activeAnnouncements.length > 0
    ? (activeAnnouncements[currentIndex] || activeAnnouncements[0])
    : {
        id: 'default-welcome',
        text: 'أهلاً بكم في مدرسة الإبداع للتعليم الأساسي للبنين.. نتمنى لجميع معلمينا وطلبتنا يوماً دراسياً موفقاً ومتميزاً',
        type: 'hadith',
        active: true,
        createdAt: new Date().toISOString(),
      };

  const getBadgeStyle = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'تنبيه عاجل',
        };
      case 'hadith':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'حديث وإشراقة',
        };
      case 'event':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: <BookOpen className="w-3.5 h-3.5 text-amber-600" />,
          label: 'نشاط مدرسي',
        };
      default:
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: <Megaphone className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'إعلان مدرسي',
        };
    }
  };

  const badge = getBadgeStyle(current.type);

  return (
    <div className="bg-white/95 border-t border-slate-200/90 px-5 md:px-6 py-2 flex items-center justify-between gap-3 text-xs font-medium z-10 shadow-md">
      {/* جهة اليمين: شارة الشريط المدرسية */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold shadow-2xs">
          <Megaphone className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>الأخبار المدرسية</span>
        </div>

        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${badge.bg}`}
        >
          {badge.icon}
          {badge.label}
        </span>
      </div>

      {/* المنتصف: نص الإعلان المتحرك مع تأثير انسيابي */}
      <div className="flex-1 overflow-hidden relative h-6 flex items-center min-w-0">
        <div
          key={current.id}
          className="animate-fade-in flex items-center gap-3 text-slate-800 text-xs md:text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis font-['Cairo']"
        >
          <span className="truncate">{current.text}</span>
        </div>
      </div>

      {/* جهة اليسار: مؤشر الترقيم + وسم مبرمج النظام */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* مؤشر ترقيم الإعلانات */}
        {activeAnnouncements.length > 1 && (
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {activeAnnouncements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-4 bg-indigo-600'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`إعلان رقم ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* وسم مبرمج النظام جهة اليسار بدقة وأناقة */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-200 text-slate-700 text-xs shrink-0 font-bold shadow-2xs">
          <Code2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="text-slate-500 font-medium text-[11px]">مشرف النظام:</span>
          <span className="text-slate-900 font-black text-xs font-['Cairo']">محمد درويش الزعابي</span>
        </div>
      </div>
    </div>
  );
};
