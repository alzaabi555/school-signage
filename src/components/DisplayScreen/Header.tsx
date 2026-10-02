import React, { useState, useEffect } from 'react';
import { SchoolSettings, PeriodProgress } from '../../types';
import { formatFullArabicDate } from '../../utils/timeUtils';
import { playSchoolChime } from '../../utils/soundUtils';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Settings,
  Clock,
  Calendar,
  Wifi,
  WifiOff,
  RotateCw,
  Sparkles,
  Smartphone,
  Lock,
  LayoutGrid,
  GraduationCap,
} from 'lucide-react';
import { DisplayAudienceMode } from '../../utils/femaleTeachersUtils';

interface HeaderProps {
  settings: SchoolSettings;
  periodProgress: PeriodProgress;
  effectiveTime: Date;
  isSimulatedTime: boolean;
  onResetTime: () => void;
  onOpenSimulator: () => void;
  onSwitchToAdmin: () => void;
  onSwitchToMobileMode?: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  isOnline: boolean;
  audienceMode?: DisplayAudienceMode;
  onToggleAudienceMode?: (mode: DisplayAudienceMode) => void;
  femaleTeachersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  periodProgress,
  effectiveTime,
  isSimulatedTime,
  onResetTime,
  onOpenSimulator,
  onSwitchToAdmin,
  onSwitchToMobileMode,
  onManualRefresh,
  isRefreshing,
  isOnline,
  audienceMode = 'general',
  onToggleAudienceMode,
  femaleTeachersCount = 0,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(settings.playChimeOnPeriodChange);
  const dateInfo = formatFullArabicDate(effectiveTime);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen error:', e);
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playSchoolChime();
    }
  };

  return (
    <header className="relative bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-5 md:px-6 py-2.5 flex items-center justify-between shadow-xs z-20">
      {/* الجانب الأيمن: شعار واسم المدرسة وحالة الاتصال */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white text-slate-800 shadow-md shadow-indigo-600/10 border border-slate-200/90 p-1 shrink-0">
          <SchoolLogo className="w-9 h-9" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 font-['Cairo']">
              {settings.schoolName?.replace('(32 فصلاً)', '').trim() || 'الإبداع للبنين'}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              الشاشة الذكية
            </span>
          </div>
        </div>

        {/* محدد نمط العرض: الوضع العام أو وضع المديرة المساعدة */}
        {onToggleAudienceMode && (
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => onToggleAudienceMode('general')}
              className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                audienceMode === 'general'
                  ? 'bg-white text-indigo-900 font-black shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="الوضع العام: عرض جدول الحصص والاحتياط لكافة معلمي ومعلمات المدرسة"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
              <span>الوضع العام</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleAudienceMode('assistant')}
              className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                audienceMode === 'assistant'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="وضع المديرة المساعدة: عرض حصص واحتياط المعلمات فقط"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>وضع المديرة المساعدة</span>
              {femaleTeachersCount !== undefined && femaleTeachersCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  audienceMode === 'assistant' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {femaleTeachersCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* المنتصف: حالة الحصة الجارية مع وميض بصري */}
      <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-slate-200/90 rounded-full px-4 py-1.5 shadow-xs">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700">
          <span>الحالة الحالية:</span>
          <span className="text-indigo-700 font-black text-sm md:text-base">
            {periodProgress.activePeriod ? periodProgress.activePeriod.name : (
              periodProgress.state === 'before_school' ? 'الاستعداد لطابور الصباح' :
              periodProgress.state === 'after_school' ? 'نهاية اليوم الدراسي' : 'فترة استراحة'
            )}
          </span>
          {periodProgress.state === 'in_period' && periodProgress.activePeriod && (
            <>
              <span className="text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded-md font-mono border border-slate-200 font-bold">
                {periodProgress.activePeriod.startTime} - {periodProgress.activePeriod.endTime}
              </span>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-mono border border-emerald-200 font-black">
                متبقٍ {periodProgress.formattedRemaining}
              </span>
            </>
          )}
        </div>
      </div>

      {/* الجانب الأيسر: الساعة الحية، التاريخ الهجري والميلادي، وأزرار التحكم */}
      <div className="flex items-center gap-3">
        {/* التقويم والساعة بشكل مدمج وصغير */}
        <div className="text-left bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 flex items-center gap-2.5 shadow-xs">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-bold">
              <Calendar className="w-3 h-3 text-indigo-600" />
              <span>{dateInfo.dayName}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              {dateInfo.gregorian}
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200"></div>

          <div className="flex items-center gap-1.5 font-mono text-base font-black text-slate-900 tabular-nums tracking-wide">
            <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>{dateInfo.formattedTime}</span>
          </div>
        </div>

        {/* أزرار التحكم السريع بالشاشة الكبيرة */}
        <div className="flex items-center gap-1.5">
          {/* محاكي الوقت إذا كان مفعلاً */}
          {isSimulatedTime && (
            <button
              onClick={onResetTime}
              className="px-2.5 py-1.5 text-xs bg-amber-50 text-amber-800 border border-amber-300 rounded-xl hover:bg-amber-100 font-bold transition shadow-xs"
              title="العودة للوقت الحقيقي"
            >
              وقت تجريبي ↺
            </button>
          )}

          {/* زر فتح محاكي الوقت */}
          <button
            onClick={onOpenSimulator}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition border border-slate-200 shadow-xs"
            title="محاكي الوقت وتجربة الحصص"
          >
            <Clock className="w-4 h-4 text-indigo-600" />
          </button>

          {/* زر جرس الحصة */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl transition border shadow-xs ${
              soundEnabled
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-100'
            }`}
            title={soundEnabled ? 'تنبيه الجرس مفعل' : 'تنبيه الجرس مكتوم'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* زر التحديث اليدوي مع مؤشر المزامنة */}
          <button
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition border border-slate-200 shadow-xs disabled:opacity-50"
            title="تحديث البيانات فوراً"
          >
            <RotateCw className={`w-4 h-4 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* مؤشر حالة الاتصال بـ Google Sheets */}
          <div
            className={`p-2 rounded-xl border shadow-xs flex items-center justify-center ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
            title={isOnline ? 'متصل بـ Google Apps Script' : 'الوضع المحلي المستقل (أوفلاين)'}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>

          {/* زر ملء الشاشة للـ TV Kiosk */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition border border-slate-200 shadow-xs"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة (Kiosk Mode)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-600" /> : <Maximize2 className="w-4 h-4 text-slate-600" />}
          </button>

          {/* زر التبديل إلى وضع الهاتف المحمول */}
          {onSwitchToMobileMode && (
            <button
              onClick={onSwitchToMobileMode}
              className="flex items-center gap-1.5 px-2.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl transition border border-slate-200 shadow-xs active:scale-95 text-xs font-bold"
              title="تفعيل وضع الهاتف المحمول لسهولة التصفح"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">وضع الجوال</span>
            </button>
          )}

          {/* زر الانتقال إلى لوحة تحكم المشرفين محمي برمز أمان */}
          <button
            onClick={onSwitchToAdmin}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl shadow-sm font-bold text-xs border border-indigo-600 transition active:scale-95 cursor-pointer"
            title="لوحة الإدارة والإدخال (محمية برمز أمان للمشرف)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">لوحة الإدارة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
