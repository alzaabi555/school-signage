import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { SchoolLogo } from './common/SchoolLogo';
import {
  Download,
  Share2,
  PlusSquare,
  X,
  CheckCircle2,
  Smartphone,
  Copy,
  ExternalLink,
  Laptop,
  Check,
  Info,
} from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePlatformTab, setActivePlatformTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'android'
  );

  // إذا كان التطبيق مثبتاً بالفعل ويعمل كـ PWA مستقل، لا حاجة لإظهار زر التثبيت
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    // إذا كان متصفح المستخدم يدعم نافذة التثبيت المباشرة (مثل Chrome/Edge على أجهزة حقيقية خارج الـ iframe)
    if (isInstallable) {
      try {
        const installed = await install();
        if (installed) return;
      } catch {
        // في حال حدوث خطأ أو كان المتصفح داخل iframe، نفتح النافذة الإرشادية المدمجة
        setShowGuideModal(true);
        return;
      }
    }
    // في حال عدم توفر prompt تلقائي (الآيفون، أو المتصفح داخل نافذة معاينة/iframe، أو متصفحات أخرى)
    setShowGuideModal(true);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* 1. نمط الشريط العلوي الترحيبي (Banner) */}
      {variant === 'banner' ? (
        <div
          className={`bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">تثبيت التطبيق على هاتفك (PWA)</p>
              <p className="text-[10px] text-slate-400">ليعمل بكامل الشاشة وبدون شريط المتصفح كتطبيق أصلي</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-950/40 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت الآن</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="إغلاق هذا الشريط"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 2. نمط الزر العادي */
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition active:scale-95 cursor-pointer ${className}`}
          title="تثبيت التطبيق على هاتفك المحمول"
        >
          <Download className="w-3.5 h-3.5 text-white" />
          <span>تثبيت التطبيق على الجوال</span>
        </button>
      )}

      {/* 3. نافذة إرشادية وتفاعلية شاملة للتثبيت (In-App Install Modal) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3.5 bg-slate-950/85 backdrop-blur-md animate-fade-in text-right">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
            {/* رأس النافذة */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
                  <SchoolLogo className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-['Cairo']">
                    تثبيت «الجدول والاحتياط المدرسي» على جهازك
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    يعمل كتطبيق جوال أصلي وسريع وبدون شريط المتصفح
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* تنبيه حول بيئة التصفح والمعاينة */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-2.5 mb-3 flex items-start gap-2 text-[11px] text-indigo-200">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p>
                للتثبيت السريع على هاتفك: انسخ الرابط وافتحه في متصفح هاتفك (سفاري أو كروم) ليعطيك النظام خيار التثبيت المباشر.
              </p>
            </div>

            {/* أزرار اختيار نظام التشغيل */}
            <div className="grid grid-cols-3 gap-1.5 mb-4 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActivePlatformTab('android')}
                className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activePlatformTab === 'android'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>أندرويد</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('ios')}
                className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activePlatformTab === 'ios'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>آيفون / آيباد</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('desktop')}
                className={`py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  activePlatformTab === 'desktop'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>كمبيوتر</span>
              </button>
            </div>

            {/* محتوى الشرح بحسب الجهاز */}
            <div className="space-y-2.5 text-xs text-slate-300 mb-4">
              {activePlatformTab === 'android' && (
                <>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      افتح الرابط في متصفح <strong className="text-white">Google Chrome</strong> أو <strong className="text-white">Samsung Internet</strong> على هاتفك.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      اضغط على قائمة المتصفح (الثلاث نقاط <strong className="text-emerald-400 font-mono">⋮</strong> في الزاوية العلوية).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      اضغط على <strong className="text-emerald-400">«تثبيت التطبيق» (Install app)</strong> أو <strong className="text-emerald-400">«إضافة إلى الشاشة الرئيسية»</strong>.
                    </p>
                  </div>
                </>
              )}

              {activePlatformTab === 'ios' && (
                <>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      افتح الرابط عبر متصفح <strong className="text-white">Safari</strong> على جهاز الآيفون أو الآيباد.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      اضغط على زر <strong className="text-white">المشاركة (Share)</strong>{' '}
                      <Share2 className="w-3.5 h-3.5 inline mx-1 text-cyan-400" /> في أسفل الشاشة.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p>
                      اختر <strong className="text-white">«إضافة إلى الشاشة الرئيسية»</strong>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> ثم اضغط <strong className="text-emerald-400">إضافة (Add)</strong>.
                    </p>
                  </div>
                </>
              )}

              {activePlatformTab === 'desktop' && (
                <>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p>
                      في متصفح Chrome أو Edge على الكمبيوتر، ستجد أيقونة تثبيت صغيرة <Download className="w-3.5 h-3.5 inline mx-1 text-purple-400" /> في نهاية شريط العنوان (URL).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      انقر عليها ثم اختر <strong className="text-white">تثبيت (Install)</strong> لتفتح نافذة التطبيق المستقلة.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* أدوات سريعة: نسخ الرابط وفتح الرابط المباشر */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">تم نسخ الرابط!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>نسخ رابط التطبيق</span>
                  </>
                )}
              </button>

              <a
                href={window.location.href}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow active:scale-95 text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح في نافذة كاملة</span>
              </a>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}
    </>
  );
};
