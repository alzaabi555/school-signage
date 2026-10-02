import React, { useState } from 'react';
import { Period } from '../../types';
import { Clock, Play, RotateCcw, X, Sparkles } from 'lucide-react';

interface TimeSimulatorControlProps {
  isOpen: boolean;
  onClose: () => void;
  periods: Period[];
  onSetSimulatedTime: (date: Date) => void;
  onResetToRealTime: () => void;
  isSimulated: boolean;
}

export const TimeSimulatorControl: React.FC<TimeSimulatorControlProps> = ({
  isOpen,
  onClose,
  periods,
  onSetSimulatedTime,
  onResetToRealTime,
  isSimulated,
}) => {
  const [customTime, setCustomTime] = useState('08:05');

  if (!isOpen) return null;

  const handleApplyPreset = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
    const simulatedDate = new Date();
    simulatedDate.setHours(h, m, 0, 0);
    onSetSimulatedTime(simulatedDate);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTime) return;
    handleApplyPreset(customTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-right">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* الترويسة */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Cairo']">
              محاكي الوقت وتجربة الحصص
            </h3>
            <p className="text-xs text-slate-500">
              اختبر شاشة العرض كأنها في أي حصة أو وقت من اليوم الدراسي
            </p>
          </div>
        </div>

        {/* حالة المحاكاة الحالية */}
        {isSimulated && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>المحاكاة قيد التشغيل حالياً</span>
            </div>
            <button
              onClick={() => {
                onResetToRealTime();
                onClose();
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition flex items-center gap-1 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              الوقت الفعلي
            </button>
          </div>
        )}

        {/* فترات جاهزة للاختيار السريع */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            فترات سريعة للتجربة:
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {periods.map((p) => {
              // حساب وقت في منتصف الحصة للتجربة
              const [h, m] = p.startTime.split(':').map((v) => parseInt(v, 10));
              const testM = (m + 15) % 60;
              const testH = m + 15 >= 60 ? h + 1 : h;
              const testTimeStr = `${String(testH).padStart(2, '0')}:${String(testM).padStart(2, '0')}`;

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    handleApplyPreset(testTimeStr);
                    onClose();
                  }}
                  className="flex flex-col items-start p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition text-right"
                >
                  <span className="text-xs font-bold text-slate-900 truncate w-full">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ({p.startTime} - {p.endTime})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* إدخال وقت يدوي */}
        <form onSubmit={handleApplyCustom} className="mb-5 pt-3 border-t border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            أو حدد وقتاً مخصصاً (ساعة : دقيقة):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 font-mono text-center text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              تطبيق
            </button>
          </div>
        </form>

        {/* أزرار الإجراءات السفلية */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <button
            onClick={() => {
              onResetToRealTime();
              onClose();
            }}
            className="text-xs text-slate-600 hover:text-slate-900 transition flex items-center gap-1 font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            استعادة الوقت الفعلي
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
