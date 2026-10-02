import React, { useState } from 'react';
import { Announcement } from '../../types';
import { Megaphone, Plus, Trash2, CheckCircle, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface AnnouncementsTabProps {
  announcements: Announcement[];
  onAddAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onToggleActive,
  isSubmitting,
}) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<Announcement['type']>('info');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await onAddAnnouncement({
      text: text.trim(),
      type,
      active: true,
    });

    setText('');
  };

  return (
    <div className="space-y-6">
      {/* 1. إضافة إعلان جديد */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Cairo']">
              إدارة شريط الإعلانات والأخبار العاجلة
            </h2>
            <p className="text-xs text-slate-500">
              يظهر هذا الشريط في أسفل شاشات العرض الذكية لإشعار الطلاب والمعلمين
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              نص الإعلان أو الخبر أو التوجيه التربوي:
            </label>
            <textarea
              required
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب التنبيه أو الحديث الشريف أو الإعلان المدرسي هنا..."
              className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">تصنيف الإعلان:</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Announcement['type'])}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="info">إعلان مدرسي عام</option>
                <option value="urgent">تنبيه عاجل ومهم</option>
                <option value="hadith">حديث شريف وحكمة اليوم</option>
                <option value="event">فعالية أو نشاط قادم</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'جارٍ الإضافة...' : 'إضافة الإعلان فوراً'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. قائمة الإعلانات الحالية */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 font-['Cairo'] mb-4">
          الإعلانات النشطة على الشاشة ({announcements.length})
        </h3>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                ann.active
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/40 border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  {ann.type === 'urgent' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                  {ann.type === 'hadith' && <Sparkles className="w-4 h-4 text-emerald-600" />}
                  {ann.type === 'event' && <BookOpen className="w-4 h-4 text-amber-600" />}
                  {ann.type === 'info' && <Megaphone className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 font-['Cairo']">
                    {ann.text}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    تم الإنشاء: {ann.createdAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleActive(ann.id, !ann.active)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition ${
                    ann.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {ann.active ? 'نشط على الشاشة' : 'معطل'}
                </button>

                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                  title="حذف الإعلان"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
