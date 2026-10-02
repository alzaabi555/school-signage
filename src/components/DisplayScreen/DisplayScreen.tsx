import React, { useState, useEffect } from 'react';
import { PeriodProgress, ClassScheduleItem, Substitution, DutyItem, Announcement, SchoolSettings, Period } from '../../types';
import { Header } from './Header';
import { MainPeriodSection } from './MainPeriodSection';
import { SideSection } from './SideSection';
import { TickerBar } from './TickerBar';
import { TimeSimulatorControl } from './TimeSimulatorControl';
import { getArabicDayName } from '../../utils/timeUtils';
import { SCHOOL_WEEK_DAYS } from '../../utils/excelUtils';
import {
  DisplayAudienceMode,
  getStoredAudienceMode,
  setStoredAudienceMode,
  getStoredFemaleTeachers,
} from '../../utils/femaleTeachersUtils';

interface DisplayScreenProps {
  settings: SchoolSettings;
  periodProgress: PeriodProgress;
  timetable: ClassScheduleItem[];
  substitutions: Substitution[];
  duties: DutyItem[];
  daySubjectDuties?: Record<string, { subject: string; departmentLead: string; notes?: string }>;
  announcements: Announcement[];
  periods: Period[];
  effectiveTime: Date;
  isSimulatedTime: boolean;
  onSetSimulatedTime: (date: Date) => void;
  onResetTime: () => void;
  onSwitchToAdmin: () => void;
  onSwitchToMobileMode?: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  isOnline: boolean;
  femaleTeachers?: string[];
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({
  settings,
  periodProgress,
  timetable,
  substitutions,
  duties,
  daySubjectDuties,
  announcements,
  periods,
  effectiveTime,
  isSimulatedTime,
  onSetSimulatedTime,
  onResetTime,
  onSwitchToAdmin,
  onSwitchToMobileMode,
  onManualRefresh,
  isRefreshing,
  isOnline,
  femaleTeachers,
}) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [audienceMode, setAudienceMode] = useState<DisplayAudienceMode>(getStoredAudienceMode);
  const [femaleTeachersList, setFemaleTeachersList] = useState<string[]>(() => {
    return femaleTeachers && femaleTeachers.length > 0 ? femaleTeachers : getStoredFemaleTeachers();
  });

  useEffect(() => {
    if (femaleTeachers && femaleTeachers.length > 0) {
      setFemaleTeachersList(femaleTeachers);
    }
  }, [femaleTeachers]);

  const handleToggleAudienceMode = (mode: DisplayAudienceMode) => {
    setAudienceMode(mode);
    setStoredAudienceMode(mode);
  };

  const realDayName = getArabicDayName(effectiveTime);
  
  // اليوم الافتراضي: إذا كان اليوم عطلة (جمعة أو سبت) يبدأ من الأحد، وإلا اليوم الحالي
  const defaultDay = (realDayName === 'الجمعة' || realDayName === 'السبت') ? 'الأحد' : realDayName;
  const [selectedDay, setSelectedDay] = useState<string>(defaultDay);

  // تحديث اليوم المختار تلقائياً عند تغير اليوم الفعلي (إلا إذا اختار المستخدم يوماً آخر للمعاينة)
  useEffect(() => {
    if (SCHOOL_WEEK_DAYS.includes(realDayName)) {
      setSelectedDay(realDayName);
    }
  }, [realDayName]);

  // منع شاشات التلفزيون الذكية والأجهزة من النوم أو الإغلاق التلقائي (Screen Wake Lock API)
  useEffect(() => {
    let wakeLockSentinel: any = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && (navigator as any).wakeLock) {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        }
      } catch {
        // إذا كان النظام لا يدعم WakeLock أو رفضه المتصفح يتم التخطي بهدوء
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockSentinel && typeof wakeLockSentinel.release === 'function') {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#f8fafc] text-slate-800 overflow-hidden font-['Cairo',sans-serif] select-none">
      {/* 1. الترويسة العلوية للشاشة */}
      <Header
        settings={settings}
        periodProgress={periodProgress}
        effectiveTime={effectiveTime}
        isSimulatedTime={isSimulatedTime}
        onResetTime={onResetTime}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onSwitchToAdmin={onSwitchToAdmin}
        onSwitchToMobileMode={onSwitchToMobileMode}
        onManualRefresh={onManualRefresh}
        isRefreshing={isRefreshing}
        isOnline={isOnline}
        audienceMode={audienceMode}
        onToggleAudienceMode={handleToggleAudienceMode}
        femaleTeachersCount={femaleTeachersList.length}
      />

      {/* شريط تنبيه سريع على شاشات الجوال في حال الرغبة بالانتقال لوضع الهاتف المتكامل */}
      {onSwitchToMobileMode && (
        <div className="lg:hidden bg-gradient-to-r from-indigo-600 to-blue-700 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold shrink-0 shadow-sm">
          <span>📱 تتصفح من شاشة صغيرة؟</span>
          <button
            onClick={onSwitchToMobileMode}
            className="px-2.5 py-1 bg-white text-indigo-900 rounded-lg shadow font-black text-[11px] active:scale-95 transition"
          >
            تفعيل وضع الجوال للمدير ⬅
          </button>
        </div>
      )}

      {/* 2. جسم الشاشة الرئيسي: جدول الـ 32 فصلاً حسب اليوم المحدد وقسم الاحتياط اليومي الكامل */}
      <main className="flex-1 p-2 md:p-3 flex flex-col lg:flex-row gap-3 overflow-hidden">
        {/* القسم الرئيسي: جدول الحصة الجارية لليوم المحدد والـ 32 فصلاً */}
        <div className="w-full lg:flex-[2.6] min-w-0 h-full flex flex-col overflow-hidden">
          <MainPeriodSection
            periodProgress={periodProgress}
            timetable={timetable}
            substitutions={substitutions}
            currentDayName={selectedDay}
            realDayName={realDayName}
            onSelectDay={setSelectedDay}
            periods={periods}
            effectiveTime={effectiveTime}
            audienceMode={audienceMode}
            femaleTeachers={femaleTeachersList}
            onToggleAudienceMode={handleToggleAudienceMode}
          />
        </div>

        {/* القسم الجانبي: بطاقات الاحتياط اليومي (مستغلاً كامل المساحة بعد حذف قسم المناوبة) */}
        <div className="w-full lg:flex-1 min-w-0 h-full flex flex-col overflow-hidden">
          <SideSection
            substitutions={substitutions}
            currentDayName={selectedDay}
            activePeriodName={periodProgress.state === 'in_period' ? periodProgress.activePeriod?.name : undefined}
            effectiveTime={effectiveTime}
            audienceMode={audienceMode}
            femaleTeachers={femaleTeachersList}
          />
        </div>
      </main>

      {/* 3. شريط الأخبار والإعلانات المدرسية المتحرك أسفل الشاشة */}
      <TickerBar announcements={announcements} />

      {/* 4. نافذة محاكي الوقت */}
      <TimeSimulatorControl
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        periods={periods}
        onSetSimulatedTime={onSetSimulatedTime}
        onResetToRealTime={onResetTime}
        isSimulated={isSimulatedTime}
      />
    </div>
  );
};
