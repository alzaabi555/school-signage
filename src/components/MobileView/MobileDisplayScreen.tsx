import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  PeriodProgress,
  ClassScheduleItem,
  Substitution,
  DutyItem,
  Announcement,
  SchoolSettings,
  Period,
} from '../../types';
import { getArabicDayName, formatFullArabicDate } from '../../utils/timeUtils';
import { SCHOOL_WEEK_DAYS, normalizePeriodId, normalizeDayName, normalizeClassName } from '../../utils/excelUtils';
import { INITIAL_DAY_SUBJECT_DUTIES } from '../../data/initialData';
import { getSubjectStyle } from '../DisplayScreen/MainPeriodSection';
import {
  LayoutGrid,
  Users,
  ShieldCheck,
  Megaphone,
  Clock,
  Tv,
  Settings,
  Search,
  RotateCw,
  Sparkles,
  BookOpen,
  MapPin,
  CheckCircle,
  AlertCircle,
  Coffee,
  ChevronLeft,
  GraduationCap,
  UserCheck,
  User,
  X,
  Layers,
  Building,
  Printer,
  AlertTriangle,
  Lock,
  Code2,
} from 'lucide-react';
import { playSchoolChime } from '../../utils/soundUtils';
import { PWAInstallButton } from '../PWAInstallButton';
import { SchoolLogo } from '../common/SchoolLogo';
import { PrintableSubstitutionReport } from '../Admin/PrintableSubstitutionReport';
import {
  DisplayAudienceMode,
  getStoredAudienceMode,
  setStoredAudienceMode,
  buildFemaleTeachersCanonicalSet,
  isFemaleClassLesson,
  isFemaleSubstitution,
  getStoredFemaleTeachers,
} from '../../utils/femaleTeachersUtils';

interface MobileDisplayScreenProps {
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
  onSwitchToTvMode: () => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
  isOnline: boolean;
  femaleTeachers?: string[];
}

type MobileTab = 'classes' | 'substitutions' | 'duties' | 'more';
type ViewMode = 'classes' | 'subjects';

interface MobileClassCardProps {
  item: ClassScheduleItem;
  sub?: Substitution;
  subjectStyle: { badge: string; text?: string; bg?: string };
}

const MobileClassCard = React.memo<MobileClassCardProps>(({ item, sub, subjectStyle }) => {
  return (
    <div
      className={`p-2 sm:p-2.5 rounded-xl border transition relative flex flex-col justify-between shadow-2xs ${
        sub
          ? 'bg-amber-50/90 border-amber-300 shadow-sm ring-1 ring-amber-300/80'
          : 'bg-white border-slate-200 hover:border-indigo-300'
      }`}
    >
      <div>
        {/* اسم الفصل ورقم القاعة */}
        <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-100 gap-0.5">
          <div className="flex items-center gap-0.5 bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded-md border border-slate-200/90 font-mono font-black text-[11px] shrink-0 shadow-2xs">
            <GraduationCap className="w-3 h-3 text-indigo-600 shrink-0" />
            <span className="whitespace-nowrap tracking-tight">{item.gradeClass}</span>
          </div>
          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-medium truncate shrink-0">
            {item.room || 'قاعة'}
          </span>
        </div>

        {/* اسم المادة الدراسية */}
        <div className="mb-1">
          <span
            className={`inline-block text-[10px] font-black px-1.5 py-0.5 rounded-md truncate max-w-full leading-tight ${subjectStyle.badge}`}
            title={item.subject}
          >
            {item.subject}
          </span>
        </div>

        {/* اسم المعلم الأصلي */}
        <div className="flex items-center gap-0.5 text-[10px] text-slate-700 mb-1 truncate font-bold">
          <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
          <span className="truncate" title={item.teacher}>{item.teacher}</span>
        </div>
      </div>

      {/* شريط الاحتياط إذا كان مكلفاً */}
      {sub ? (
        <div className="mt-1 pt-1 border-t border-amber-300 text-[9px] bg-amber-100/80 -mx-2 -mb-2 p-1.5 rounded-b-xl">
          <div className="flex items-center justify-between text-amber-900 font-bold mb-0.5">
            <span className="text-[8.5px] text-amber-800 shrink-0">احتياط:</span>
            <span className="text-[8px] text-rose-600 line-through truncate max-w-[50px]">
              {sub.absentTeacher || item.teacher}
            </span>
          </div>
          <p className="font-black text-emerald-800 text-[9.5px] truncate" title={sub.substituteTeacher}>
            أ. {sub.substituteTeacher}
          </p>
        </div>
      ) : (
        <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span>نظامية</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        </div>
      )}
    </div>
  );
});
MobileClassCard.displayName = 'MobileClassCard';

export const MobileDisplayScreen: React.FC<MobileDisplayScreenProps> = ({
  settings,
  periodProgress,
  timetable,
  substitutions,
  duties,
  daySubjectDuties,
  announcements,
  periods,
  effectiveTime,
  onSwitchToAdmin,
  onSwitchToTvMode,
  onManualRefresh,
  isRefreshing,
  femaleTeachers: initialFemaleTeachers,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('classes');
  const [viewMode, setViewMode] = useState<ViewMode>('classes');
  const [soundEnabled, setSoundEnabled] = useState(settings.playChimeOnPeriodChange);
  const [audienceMode, setAudienceMode] = useState<DisplayAudienceMode>(getStoredAudienceMode);

  const femaleTeachers = useMemo(() => {
    return initialFemaleTeachers && initialFemaleTeachers.length > 0
      ? initialFemaleTeachers
      : getStoredFemaleTeachers();
  }, [initialFemaleTeachers]);

  const femaleCanonicalSet = useMemo(() => {
    return buildFemaleTeachersCanonicalSet(femaleTeachers);
  }, [femaleTeachers]);

  const handleToggleAudienceMode = (mode: DisplayAudienceMode) => {
    setAudienceMode(mode);
    setStoredAudienceMode(mode);
  };

  const realDayName = getArabicDayName(effectiveTime);
  const dateInfo = formatFullArabicDate(effectiveTime);

  // اليوم الافتراضي
  const defaultDay = (realDayName === 'الجمعة' || realDayName === 'السبت') ? 'الأحد' : realDayName;
  const [selectedDay, setSelectedDay] = useState<string>(defaultDay);
  const [showPrintReport, setShowPrintReport] = useState<boolean>(false);
  const [printReportMode, setPrintReportMode] = useState<'full' | 'assistant'>('full');

  // تحديث اليوم التلقائي
  useEffect(() => {
    if (SCHOOL_WEEK_DAYS.includes(realDayName)) {
      setSelectedDay(realDayName);
    }
  }, [realDayName]);

  // قائمة الحصص التدريسية
  const teachingPeriods = useMemo(() => {
    return periods.filter((p) => !p.isBreak && /^p[1-8]$/.test(p.id));
  }, [periods]);

  // الحصة المختارة للعرض (الافتراضية: الحصة النشطة الحالية، أو الحصة الأولى)
  const defaultPeriodId = periodProgress.activePeriod && !periodProgress.activePeriod.isBreak
    ? periodProgress.activePeriod.id
    : (teachingPeriods[0]?.id || 'p1');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(defaultPeriodId);
  const [isManualPeriodSelection, setIsManualPeriodSelection] = useState(false);
  const manualSelectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectPeriodTemporarily = (periodId: string) => {
    setSelectedPeriodId(periodId);
    setIsManualPeriodSelection(true);
    if (manualSelectionTimerRef.current) clearTimeout(manualSelectionTimerRef.current);
    manualSelectionTimerRef.current = setTimeout(() => {
      const liveId = periodProgress.activePeriod && !periodProgress.activePeriod.isBreak && /^p[1-8]$/.test(periodProgress.activePeriod.id)
        ? periodProgress.activePeriod.id : (teachingPeriods[0]?.id || 'p1');
      setSelectedPeriodId(liveId);
      setIsManualPeriodSelection(false);
    }, 30000);
  };

  const returnToLivePeriod = () => {
    if (manualSelectionTimerRef.current) clearTimeout(manualSelectionTimerRef.current);
    const liveId = periodProgress.activePeriod && !periodProgress.activePeriod.isBreak && /^p[1-8]$/.test(periodProgress.activePeriod.id)
      ? periodProgress.activePeriod.id : (teachingPeriods[0]?.id || 'p1');
    setSelectedPeriodId(liveId);
    setIsManualPeriodSelection(false);
  };

  useEffect(() => {
    if (!isManualPeriodSelection && periodProgress.activePeriod && !periodProgress.activePeriod.isBreak && /^p[1-8]$/.test(periodProgress.activePeriod.id)) {
      setSelectedPeriodId(periodProgress.activePeriod.id);
    }
  }, [periodProgress.activePeriod?.id, isManualPeriodSelection]);

  useEffect(() => () => {
    if (manualSelectionTimerRef.current) clearTimeout(manualSelectionTimerRef.current);
  }, []);

  // فلتر الصفوف والبحث للفصول
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // استخراج قائمة الصفوف المتاحة (5، 6، 7، 8، 9، 10)
  const gradeLevels = useMemo(() => {
    const grades = new Set<string>();
    timetable.forEach((t) => {
      const match = t.gradeClass.match(/^(\d+)/);
      if (match) grades.add(match[1]);
    });
    return Array.from(grades).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [timetable]);

  const substitutionTimestamp = (sub: Substitution): number => {
    const parsed = Date.parse(String(sub.updatedAt || sub.date || ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  // حصص الاحتياط لليوم المحدد، بأحدث سجل فقط لكل يوم وحصة وفصل.
  const todaySubstitutions = useMemo(() => {
    const targetDay = normalizeDayName(selectedDay);
    const latestBySlot = new Map<string, Substitution>();
    substitutions.forEach((sub) => {
      if (sub.status === 'ملغي') return;
      let matchesDay = false;
      const explicitDay = normalizeDayName(sub.day || '');
      if (explicitDay) matchesDay = explicitDay === targetDay;
      else if (sub.date) {
        const parsed = new Date(sub.date);
        matchesDay = !Number.isNaN(parsed.getTime()) && normalizeDayName(getArabicDayName(parsed)) === targetDay;
      }
      if (!matchesDay) return;

      // في وضع المديرة المساعدة: تصفية الاحتياط ليقتصر على المعلمات فقط
      if (audienceMode === 'assistant' && !isFemaleSubstitution(sub, femaleCanonicalSet)) {
        return;
      }

      const periodId = normalizePeriodId(sub.period);
      const gradeClass = normalizeClassName(sub.gradeClass);
      if (!periodId || !gradeClass) return;
      const key = `${targetDay}:::${periodId}:::${gradeClass}`;
      const current = latestBySlot.get(key);
      if (!current || substitutionTimestamp(sub) >= substitutionTimestamp(current)) latestBySlot.set(key, sub);
    });
    return Array.from(latestBySlot.values());
  }, [substitutions, selectedDay, audienceMode, femaleCanonicalSet]);
  // تجميع حصص الاحتياط بحسب المواد الدراسية في وضع الهاتف (عرض مواد)
  const mobileSubjectSubstitutionGroups = useMemo(() => {
    if (todaySubstitutions.length === 0) return [];

    const map = new Map<string, Substitution[]>();
    todaySubstitutions.forEach((sub) => {
      const subj = sub.subject?.trim() || 'أخرى';
      const list = map.get(subj) || [];
      list.push(sub);
      map.set(subj, list);
    });

    const activeNorm = periodProgress.activePeriod && !periodProgress.activePeriod.isBreak ? normalizePeriodId(periodProgress.activePeriod.id) : '';

    const groups = Array.from(map.entries()).map(([subj, items]) => {
      const sortedItems = [...items].sort((a, b) => {
        const aNorm = normalizePeriodId(a.period);
        const bNorm = normalizePeriodId(b.period);
        if (activeNorm) {
          const isA = aNorm === activeNorm;
          const isB = bNorm === activeNorm;
          if (isA && !isB) return -1;
          if (!isA && isB) return 1;
        }
        return aNorm.localeCompare(bNorm, undefined, { numeric: true });
      });

      const absentTeachers = Array.from(
        new Set(items.map((i) => i.absentTeacher?.trim()).filter(Boolean))
      );

      const hasActivePeriodLesson = items.some(
        (i) => activeNorm && normalizePeriodId(i.period) === activeNorm
      );

      return {
        subject: subj,
        absentTeachers,
        substitutions: sortedItems,
        hasActivePeriodLesson,
      };
    });

    return groups.sort((a, b) => {
      if (a.hasActivePeriodLesson && !b.hasActivePeriodLesson) return -1;
      if (!a.hasActivePeriodLesson && b.hasActivePeriodLesson) return 1;
      return b.substitutions.length - a.substitutions.length;
    });
  }, [todaySubstitutions, periodProgress.activePeriod]);

  // خريطة سريعة O(1) للاحتياط حسب اسم الفصل للحصة المحددة لتسريع العرض الفوري
  const substitutionsByClassMap = useMemo(() => {
    const targetPeriodId = normalizePeriodId(selectedPeriodId);
    const map = new Map<string, Substitution>();
    todaySubstitutions.forEach((sub) => {
      if (normalizePeriodId(sub.period) === targetPeriodId) {
        map.set(normalizeClassName(sub.gradeClass), sub);
      }
    });
    return map;
  }, [todaySubstitutions, selectedPeriodId]);

  // استرجاع الاحتياط في زمن O(1) فوري بدلاً من البحث الخطي المتكرر
  const getSubForClass = useCallback(
    (gradeClass: string): Substitution | undefined => {
      return substitutionsByClassMap.get(normalizeClassName(gradeClass));
    },
    [substitutionsByClassMap]
  );

  // كافة فصول الحصة المحددة لليوم المحدد (نظيفة وفريدة بدون تكرار)
  const currentPeriodClasses = useMemo(() => {
    const targetDay = normalizeDayName(selectedDay);
    const targetPeriod = normalizePeriodId(selectedPeriodId);

    // تصفية الحصص وضمان فصل واحد فقط لكل صف
    const uniqueRawMap = new Map<string, ClassScheduleItem>();
    timetable.forEach((item) => {
      if (normalizeDayName(item.day) !== targetDay) return;
      if (normalizePeriodId(item.periodId) !== targetPeriod) return;
      const cNorm = normalizeClassName(item.gradeClass);
      if (!uniqueRawMap.has(cNorm)) {
        uniqueRawMap.set(cNorm, item);
      }
    });
    const rawClasses = Array.from(uniqueRawMap.values());

    if (audienceMode === 'assistant') {
      const assistantClasses: ClassScheduleItem[] = [];
      const handledClasses = new Set<string>();

      rawClasses.forEach((lesson) => {
        const sub = getSubForClass(lesson.gradeClass);
        if (isFemaleClassLesson(lesson, femaleCanonicalSet, sub)) {
          assistantClasses.push(lesson);
          handledClasses.add(normalizeClassName(lesson.gradeClass));
        }
      });

      // إضافة أي فصل مسجل له احتياط يخص المعلمات في هذه الحصة
      todaySubstitutions.forEach((sub) => {
        if (normalizePeriodId(sub.period) !== targetPeriod) return;
        const cNorm = normalizeClassName(sub.gradeClass);
        if (!handledClasses.has(cNorm) && isFemaleSubstitution(sub, femaleCanonicalSet)) {
          handledClasses.add(cNorm);
          assistantClasses.push({
            id: `sub-mobile-${selectedDay}-${selectedPeriodId}-${sub.gradeClass}`,
            day: selectedDay,
            periodId: selectedPeriodId,
            gradeClass: sub.gradeClass,
            subject: sub.subject || 'احتياط',
            teacher: sub.absentTeacher || '',
            room: '',
          });
        }
      });

      return assistantClasses.sort((a, b) =>
        a.gradeClass.localeCompare(b.gradeClass, 'ar', { numeric: true })
      );
    }

    return rawClasses.sort((a, b) =>
      a.gradeClass.localeCompare(b.gradeClass, 'ar', { numeric: true })
    );
  }, [timetable, selectedDay, selectedPeriodId, audienceMode, femaleCanonicalSet, todaySubstitutions, getSubForClass]);

  // 1. الفصول المصفاة للحصة واليوم المحددين (لوضع شبكة الفصول)
  const filteredClasses = useMemo(() => {
    return currentPeriodClasses.filter((item) => {
      // تصفية حسب الصف
      if (selectedGradeFilter !== 'all') {
        const itemGrade = item.gradeClass.match(/^(\d+)/)?.[1];
        if (itemGrade !== selectedGradeFilter) return false;
      }

      // البحث
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesClass = item.gradeClass.toLowerCase().includes(q);
        const matchesTeacher = item.teacher.toLowerCase().includes(q);
        const matchesSubject = item.subject.toLowerCase().includes(q);
        const matchesRoom = (item.room || '').toLowerCase().includes(q);
        const sub = getSubForClass(item.gradeClass);
        const matchesSubTeacher = sub?.substituteTeacher.toLowerCase().includes(q);
        const matchesAbsent = sub?.absentTeacher.toLowerCase().includes(q);
        return matchesClass || matchesTeacher || matchesSubject || matchesRoom || matchesSubTeacher || matchesAbsent;
      }

      return true;
    }).sort((a, b) => a.gradeClass.localeCompare(b.gradeClass, 'ar', { numeric: true }));
  }, [currentPeriodClasses, selectedGradeFilter, searchQuery, todaySubstitutions]);

  // 2. تصنيف الحصص حسب المواد الدراسية للحصة واليوم المحددين
  const subjectGroups = useMemo(() => {
    const map = new Map<string, ClassScheduleItem[]>();
    currentPeriodClasses.forEach((item) => {
      const subj = (item.subject || 'مادة عامة').trim();
      const list = map.get(subj) || [];
      list.push(item);
      map.set(subj, list);
    });

    const groups = Array.from(map.entries()).map(([subject, classes]) => {
      const sortedClasses = [...classes].sort((a, b) =>
        a.gradeClass.localeCompare(b.gradeClass, 'ar', { numeric: true })
      );
      return {
        subject,
        classes: sortedClasses,
      };
    });

    return groups.sort((a, b) => b.classes.length - a.classes.length || a.subject.localeCompare(b.subject, 'ar'));
  }, [currentPeriodClasses]);

  // التحقق من صلاحية فلتر المادة المحددة عند تبديل الحصة
  useEffect(() => {
    if (selectedSubjectFilter !== 'all') {
      const exists = subjectGroups.some((g) => g.subject === selectedSubjectFilter);
      if (!exists) {
        setSelectedSubjectFilter('all');
      }
    }
  }, [subjectGroups, selectedSubjectFilter]);

  // 3. تصفية مجموعات المواد حسب المادة المحددة والبحث
  const filteredSubjectGroups = useMemo(() => {
    let result = subjectGroups;

    if (selectedSubjectFilter !== 'all') {
      result = result.filter((g) => g.subject === selectedSubjectFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result
        .map((g) => {
          const matchesSubject = g.subject.toLowerCase().includes(q);
          const matchedClasses = g.classes.filter((c) => {
            const sub = getSubForClass(c.gradeClass);
            const teacherMatch = c.teacher.toLowerCase().includes(q);
            const classMatch = c.gradeClass.toLowerCase().includes(q);
            const roomMatch = (c.room || '').toLowerCase().includes(q);
            const subMatch = sub ? sub.substituteTeacher.toLowerCase().includes(q) : false;
            const absentMatch = sub ? sub.absentTeacher.toLowerCase().includes(q) : false;
            return teacherMatch || classMatch || roomMatch || subMatch || absentMatch;
          });

          if (matchesSubject) return g;
          if (matchedClasses.length > 0) return { ...g, classes: matchedClasses };
          return null;
        })
        .filter(Boolean) as { subject: string; classes: ClassScheduleItem[] }[];
    }

    return result;
  }, [subjectGroups, selectedSubjectFilter, searchQuery, todaySubstitutions]);

  // معلومات المناوبة لهذا اليوم
  const activeDayForDuty = (selectedDay === 'الجمعة' || selectedDay === 'السبت') ? 'الخميس' : selectedDay;
  const currentDayDutyInfo = (daySubjectDuties && daySubjectDuties[activeDayForDuty]) || INITIAL_DAY_SUBJECT_DUTIES[activeDayForDuty] || {
    subject: 'القسم المناوب',
    departmentLead: 'مشرف المدرسة',
  };
  const todayDuties = duties.filter((d) => d.day === activeDayForDuty);

  const selectedPeriodObj = periods.find((p) => p.id === selectedPeriodId);

  return (
    <div className="w-full max-w-full min-w-0 min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-800 flex flex-col font-['Cairo',sans-serif] pb-24 selection:bg-indigo-500 selection:text-white">
      {/* 1. الترويسة العلوية المخصصة للهواتف */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 py-2.5 shadow-xs">
        <div className="w-full min-w-0 flex items-center justify-between gap-2">
          {/* اسم المدرسة وشعار مباشر */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-0.5 shadow-xs shrink-0">
              <SchoolLogo className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                  {settings.schoolName?.replace('(32 فصلاً)', '').trim() || 'الإبداع للبنين'}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {dateInfo.dayName} · {dateInfo.gregorian}
              </p>
            </div>
          </div>

          {/* أزرار الإجراءات العلوية السريعة */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* زر التبديل إلى وضع الشاشات الكبيرة الذكية */}
            <button
              onClick={onSwitchToTvMode}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition active:scale-95 shadow-xs"
              title="التبديل إلى وضع الشاشة الكبيرة الذكية (التلفزيون)"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">الشاشة</span>
            </button>

            {/* زر التحديث السريع */}
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200 active:scale-95 transition shadow-xs"
              title="تحديث البيانات"
            >
              <RotateCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* زر لوحة الإدارة محمي برمز أمان */}
            <button
              onClick={onSwitchToAdmin}
              className="p-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 active:scale-95 transition shadow-xs flex items-center justify-center cursor-pointer"
              title="لوحة الإدارة والإدخال (محمية برمز أمان للمشرف)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        </div>
      </header>

      {/* شريط تثبيت التطبيق على الشاشة الرئيسية (PWA) */}
      <div className="px-3.5 pt-3">
        <PWAInstallButton variant="banner" />
      </div>

      {/* 2. بطاقة الحصة الجارية الحية وحالة اليوم المدرسي */}
      <div className="p-3.5 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">
              {periodProgress.activePeriod ? (
                <span>
                  {periodProgress.activePeriod.name}
                  {periodProgress.activePeriod.isBreak ? ' (استراحة/طابور)' : ''}
                </span>
              ) : (
                'خارج أوقات الحصص الرسمية'
              )}
            </span>
          </div>

          {periodProgress.activePeriod && (
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {periodProgress.activePeriod.startTime} - {periodProgress.activePeriod.endTime}
            </span>
          )}
        </div>

        {/* شريط تقدم الحصة الجارية */}
        {periodProgress.activePeriod && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, periodProgress.progressPercent))}%` }}
            ></div>
          </div>
        )}

        {/* معلومات الحصة القادمة */}
        {periodProgress.nextPeriod && (
          <p className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>الحصة التالية: {periodProgress.nextPeriod.name}</span>
            <span className="font-mono text-slate-600 font-bold">تبدأ {periodProgress.nextPeriod.startTime}</span>
          </p>
        )}
      </div>

      {/* محدد نمط عرض الحصص للجوال: الوضع العام أو وضع المديرة المساعدة */}
      <div className="px-3 pt-2 pb-1.5 bg-slate-100/90 border-b border-slate-200">
        <div className="grid grid-cols-2 p-1 bg-slate-200/90 rounded-2xl border border-slate-300/80 text-xs font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleAudienceMode('general')}
            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              audienceMode === 'general'
                ? 'bg-white text-indigo-950 font-black shadow-xs border border-slate-200/90'
                : 'text-slate-600 hover:text-slate-900 active:scale-95'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">الوضع العام (الكل)</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleAudienceMode('assistant')}
            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              audienceMode === 'assistant'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black shadow-xs ring-1 ring-violet-400'
                : 'text-slate-600 hover:text-slate-900 active:scale-95'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">وضع المديرة المساعدة</span>
            {femaleTeachers.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold leading-tight ${
                audienceMode === 'assistant' ? 'bg-white/25 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {femaleTeachers.length}
              </span>
            )}
          </button>
        </div>
        {audienceMode === 'assistant' && (
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-violet-800 font-bold px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-violet-600 shrink-0" />
              <span>مفعل: عرض حصص واحتياط المعلمات فقط ({currentPeriodClasses.length} حصة في {selectedPeriodObj?.name || 'هذه الحصة'})</span>
            </span>
            <button
              onClick={() => handleToggleAudienceMode('general')}
              className="text-[10px] text-slate-500 hover:text-violet-700 underline"
            >
              إلغاء الفرز
            </button>
          </div>
        )}
      </div>

      {/* 3. شريط اختيار اليوم وشريط اختيار الحصة */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
        {/* اختيار يوم الأسبوع */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600">اليوم الدراسي:</span>
            {selectedDay !== realDayName && (
              <button
                onClick={() => setSelectedDay(realDayName)}
                className="text-[10px] text-indigo-600 underline font-bold"
              >
                العودة لليوم الفعلي ({realDayName})
              </button>
            )}
          </div>
          <div className="w-full max-w-full min-w-0 flex items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-1 no-scrollbar">
            {SCHOOL_WEEK_DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const isToday = realDayName === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{day}</span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* اختيار الحصة عند استعراض الفصول والمواد */}
        {activeTab === 'classes' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-600">
                الحصة المعروضة: {selectedPeriodObj ? selectedPeriodObj.name : ''}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {selectedPeriodObj ? `${selectedPeriodObj.startTime} - ${selectedPeriodObj.endTime}` : ''}
              </span>
            </div>
            <div className="w-full max-w-full min-w-0 flex items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-1 no-scrollbar">
              {teachingPeriods.map((p, pIdx) => {
                const isSelected = selectedPeriodId === p.id;
                const isCurrent = periodProgress.activePeriod?.id === p.id;
                return (
                  <button
                    key={`${p.id}-${pIdx}`}
                    onClick={() => selectPeriodTemporarily(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span>{p.name.replace('الحصة ', 'ح ')}</span>
                    {isCurrent && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    )}
                  </button>
                );
              })}
              {isManualPeriodSelection && (
                <button type="button" onClick={returnToLivePeriod} className="px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap bg-emerald-600 text-white shadow-xs">
                  مباشر
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. محتوى التبويب النشط */}
      <main className="w-full max-w-full min-w-0 flex-1 p-3 sm:p-3.5 overflow-x-hidden">
        {/* ===================== تبويب 1: جدول الفصول والمواد ===================== */}
        {activeTab === 'classes' && (
          <div className="w-full min-w-0 space-y-3">
            {/* أزرار التبديل الحصري بين وضع "عرض الفصول" و "عرض حسب المواد الدراسية" في الجوال */}
            <div className="flex items-center p-1 bg-slate-200/80 rounded-2xl border border-slate-300/60 shadow-2xs">
              <button
                onClick={() => setViewMode('classes')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black transition-all ${
                  viewMode === 'classes'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-indigo-600" />
                <span>عرض الفصول ({filteredClasses.length})</span>
              </button>

              <button
                onClick={() => setViewMode('subjects')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-black transition-all ${
                  viewMode === 'subjects'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>عرض حسب المواد ({subjectGroups.length})</span>
              </button>
            </div>

            {/* شريط البحث الموحد والسريع */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  viewMode === 'subjects'
                    ? 'ابحث عن اسم المعلم، المادة، الفصل، أو القاعة...'
                    : 'ابحث عن فصل أو معلم أو مادة أو قاعة...'
                }
                className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-xs font-bold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* ================= وضع 1: شبكة الفصول الدراسية ================= */}
            {viewMode === 'classes' && (
              <>
                {/* أزرار تصفية الصفوف */}
                <div className="w-full max-w-full min-w-0 flex items-center gap-1 overflow-x-auto overscroll-x-contain pb-1 no-scrollbar">
                  <button
                    onClick={() => setSelectedGradeFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      selectedGradeFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    كافة الصفوف
                  </button>
                  {gradeLevels.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGradeFilter(g)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                        selectedGradeFilter === g
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      الصف {g}
                    </button>
                  ))}
                </div>

                {/* إحصائية الحصص المعروضة */}
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>{filteredClasses.length} فصلاً دراسياً معتمداً</span>
                  {todaySubstitutions.length > 0 && (
                    <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {todaySubstitutions.length} حصة احتياط اليوم
                    </span>
                  )}
                </div>

                {/* شبكة بطاقات الفصول (3 أعمدة على الهاتف لتقليل طول الصفحة، مع تناسق كامل لكافة البيانات) */}
                {filteredClasses.length > 0 ? (
                  <div className="w-full min-w-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1.5 sm:gap-2">
                    {filteredClasses.map((item) => {
                      const sub = getSubForClass(item.gradeClass);
                      const subjectStyle = getSubjectStyle(item.subject);

                      return (
                        <MobileClassCard
                          key={item.id}
                          item={item}
                          sub={sub}
                          subjectStyle={subjectStyle}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl shadow-xs">
                    <LayoutGrid className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-bold">لا توجد فصول مطابقة للبحث أو الحصة المحددة</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGradeFilter('all');
                      }}
                      className="mt-2 text-xs text-indigo-600 underline font-bold"
                    >
                      إعادة ضبط الفلاتر
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ================= وضع 2: عرض الحصص حسب المواد الدراسية ================= */}
            {viewMode === 'subjects' && (
              <div className="w-full min-w-0 space-y-3">
                {/* شريط أزرار تصفية المواد الأفقية السريعة */}
                <div className="w-full max-w-full min-w-0 flex items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-1 no-scrollbar">
                  <button
                    onClick={() => setSelectedSubjectFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                      selectedSubjectFilter === 'all'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span>جميع المواد</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      selectedSubjectFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {subjectGroups.length}
                    </span>
                  </button>

                  {subjectGroups.map((group) => {
                    const isSelected = selectedSubjectFilter === group.subject;
                    const style = getSubjectStyle(group.subject);

                    return (
                      <button
                        key={group.subject}
                        onClick={() => setSelectedSubjectFilter(group.subject)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                          isSelected
                            ? `${style.headerBg} shadow-xs`
                            : 'bg-white text-slate-700 border border-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <span>{group.subject}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {group.classes.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* إحصائية المواد والفصول */}
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>
                    {filteredSubjectGroups.length} مواد دراسية نشطة بالحصة ({selectedPeriodObj?.name || selectedPeriodId})
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {filteredSubjectGroups.reduce((acc, curr) => acc + curr.classes.length, 0)} حصة
                  </span>
                </div>

                {/* قائمة بطاقات المواد وقائمة الحصص التابعة لكل مادة */}
                {filteredSubjectGroups.length > 0 ? (
                  <div className="w-full min-w-0 space-y-3">
                    {filteredSubjectGroups.map((group) => {
                      const style = getSubjectStyle(group.subject);

                      return (
                        <div
                          key={group.subject}
                          className={`rounded-2xl border p-3 flex flex-col justify-between shadow-xs transition ${style.cardBg}`}
                        >
                          {/* ترويسة بطاقة المادة */}
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${style.badge}`}>
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <h4 className="text-sm font-black text-slate-900 font-['Cairo']">
                                {group.subject}
                              </h4>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 font-black text-slate-700 shadow-2xs font-mono">
                              {group.classes.length} {group.classes.length === 1 ? 'فصل' : 'فصول'}
                            </span>
                          </div>

                          {/* قائمة فصول ومعلمي هذه المادة */}
                          <div className="space-y-2">
                            {group.classes.map((cls) => {
                              const sub = getSubForClass(cls.gradeClass);

                              return (
                                <div
                                  key={cls.id}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                                    sub
                                      ? 'bg-amber-50/95 border-amber-300 ring-1 ring-amber-300/50'
                                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                                  }`}
                                >
                                  {/* وسم الصف الدراسي - ثابت ولا يُقتطع نهائياً */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <div className="flex items-center gap-1 bg-slate-100 text-slate-900 px-2 py-1 rounded-md border border-slate-200 font-mono font-black text-xs shadow-2xs">
                                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                      <span className="whitespace-nowrap tracking-tight">{cls.gradeClass}</span>
                                    </div>
                                  </div>

                                  {/* اسم المعلم أو المعلم البديل */}
                                  <div className="flex-1 min-w-0 text-right pr-1">
                                    {sub ? (
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-1 text-xs font-black text-emerald-800 truncate">
                                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          <span className="truncate">البديل: أ. {sub.substituteTeacher}</span>
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-white font-bold shrink-0">
                                            احتياط
                                          </span>
                                        </div>
                                        <div className="text-[10px] text-rose-500 line-through truncate">
                                          الغائب: أ. {sub.absentTeacher || cls.teacher}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold truncate">
                                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate" title={cls.teacher}>أ. {cls.teacher}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* القاعة الدراسية */}
                                  <div className="shrink-0 text-left">
                                    <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                                      {cls.room || 'قاعة'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl shadow-xs">
                    <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-bold">لا توجد مواد أو حصص مطابقة للبحث</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSubjectFilter('all');
                      }}
                      className="mt-2 text-xs text-emerald-600 underline font-bold"
                    >
                      إعادة ضبط الفلاتر
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================== تبويب 2: الاحتياط اليومي ===================== */}
        {activeTab === 'substitutions' && (
          <div className="space-y-3">
            <div className="w-full max-w-full min-w-0 overflow-hidden bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-xs font-bold text-amber-900 font-['Cairo']">
                    {audienceMode === 'assistant' ? `احتياط المعلمات (${selectedDay})` : `سجل الاحتياط اليومي (${selectedDay})`}
                  </h3>
                  <p className="text-[10px] text-amber-700">
                    {audienceMode === 'assistant'
                      ? 'متابعة حصص واحتياط المعلمات فقط'
                      : 'متابعة المعلمين الغائبين والبدلاء وتأكيد حضور الحصص'}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto min-w-0 grid grid-cols-2 sm:flex sm:items-center gap-2">
                {/* زر طباعة كشاف الاحتياط لمدير المدرسة والمشرفين على الهاتف */}
                <button type="button" onClick={() => { setPrintReportMode('full'); setShowPrintReport(true); }} className="w-full min-w-0 flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-center leading-tight break-words bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer" title="طباعة كشاف الاحتياط الكامل">
                  <Printer className="w-3.5 h-3.5" /><span>كشاف المدير</span>
                </button>
                <button type="button" onClick={() => { setPrintReportMode('assistant'); setShowPrintReport(true); }} className="w-full min-w-0 flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-center leading-tight break-words bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer" title="طباعة نسخة المديرة المساعدة">
                  <Printer className="w-3.5 h-3.5" /><span>نسخة المساعدة</span>
                </button>

                <span className="col-span-2 sm:col-span-1 justify-self-center text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {todaySubstitutions.length} تكليفات
                </span>
              </div>
            </div>

            {mobileSubjectSubstitutionGroups.length > 0 ? (
              <div className="space-y-3">
                {mobileSubjectSubstitutionGroups.map((group) => {
                  const style = getSubjectStyle(group.subject);
                  return (
                    <div
                      key={group.subject}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                        group.hasActivePeriodLesson
                          ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300 shadow-sm'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* رأس المادة الدراسية في الهاتف */}
                      <div
                        className={`p-2.5 px-3 flex items-center justify-between border-b ${
                          group.hasActivePeriodLesson
                            ? 'bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 border-amber-300 text-amber-950'
                            : 'bg-slate-50/90 border-slate-200 text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${style.badge}`}>
                            مادة: {group.subject}
                          </span>
                          {group.absentTeachers.length > 0 && (
                            <span className="text-[10px] font-bold text-rose-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs">
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                              <span>الغائب: {group.absentTeachers.join('، ')}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {group.hasActivePeriodLesson && (
                            <span className="text-[9px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 animate-pulse">
                              <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                              الآن
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-slate-800 border border-slate-200 font-mono shadow-2xs">
                            {group.substitutions.length} حصص
                          </span>
                        </div>
                      </div>

                      {/* الحصص التابعة لهذه المادة */}
                      <div className="p-2 space-y-2 bg-slate-50/40">
                        {group.substitutions.map((sub) => {
                          const isCurrentPeriod = Boolean(
                            periodProgress.activePeriod && !periodProgress.activePeriod.isBreak &&
                            normalizePeriodId(sub.period) === normalizePeriodId(periodProgress.activePeriod.id)
                          );

                          return (
                            <div
                              key={sub.id}
                              className={`p-3 rounded-xl border transition relative ${
                                isCurrentPeriod
                                  ? 'bg-amber-50/95 border-amber-400 shadow-sm ring-1 ring-amber-300'
                                  : 'bg-white border-slate-200 shadow-2xs'
                              }`}
                            >
                              {/* رأس الحصة */}
                              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                                    {sub.period}
                                  </span>
                                  <span className="text-xs font-black text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                    فصل {sub.gradeClass}
                                  </span>
                                </div>

                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  sub.status === 'تم الحضور'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : sub.status === 'مؤكد'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {sub.status}
                                </span>
                              </div>

                              {/* المعلم الغائب والبديل */}
                              <div className="w-full min-w-0 grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-rose-50/80 p-2 rounded-xl border border-rose-100">
                                  <span className="block text-[10px] text-rose-600 mb-0.5">الغائب:</span>
                                  <p className="font-bold text-rose-800 truncate line-through">{sub.absentTeacher}</p>
                                </div>
                                <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
                                  <span className="block text-[10px] text-emerald-700 mb-0.5 font-bold">البديل المكلف:</span>
                                  <p className="font-black text-emerald-800 truncate">أ. {sub.substituteTeacher}</p>
                                </div>
                              </div>

                              {sub.notes && (
                                <p className="mt-1.5 text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                                  ملاحظة: {sub.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center bg-white border border-slate-200 rounded-3xl shadow-xs">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900 mb-1">لا توجد غيابات أو حصص احتياط</p>
                <p className="text-xs text-slate-500">كافة الحصص والكوادر التدريسية منتظمة ليوم {selectedDay}</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== تبويب 3: المناوبة والإشراف ===================== */}
        {activeTab === 'duties' && (
          <div className="space-y-3">
            {/* بطاقة المادة المناوبة ورئيس القسم لهذا اليوم */}
            <div className="bg-white p-4 rounded-3xl border border-indigo-100 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold block">
                    المادة واللجنة المناوبة ({selectedDay})
                  </span>
                  <h3 className="text-sm font-black text-slate-900 font-['Cairo']">
                    {currentDayDutyInfo.subject}
                  </h3>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-600">المعلم الأول / المشرف المسؤول:</span>
                <span className="text-xs font-bold text-indigo-800">{currentDayDutyInfo.departmentLead}</span>
              </div>
            </div>

            {/* قائمة مواقع المناوبة اليومية والمشرفين */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 mb-2 px-1">
                مواقع الإشراف والمشرفين المناوبين ({todayDuties.length} مواقع)
              </h4>

              {todayDuties.length > 0 ? (
                <div className="space-y-2">
                  {todayDuties.map((duty) => (
                    <div
                      key={duty.id}
                      className="bg-white border border-slate-200 rounded-2xl p-3 space-y-1.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{duty.location}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {duty.timeSlot}
                        </span>
                      </div>

                      <div className="text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-500 block mb-0.5">المشرف المسؤول:</span>
                        <p className="font-bold text-emerald-700">{duty.leadTeacher}</p>
                        {duty.assistants && (
                          <p className="text-[11px] text-slate-600 mt-1">
                            المعاونون: {duty.assistants}
                          </p>
                        )}
                      </div>

                      {duty.notes && (
                        <p className="text-[10px] text-slate-500 px-1">
                          ملاحظات: {duty.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-500">لا توجد مواقع مناوبة مدخلة ليوم {selectedDay}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== تبويب 4: الأخبار والمواقيت ===================== */}
        {activeTab === 'more' && (
          <div className="space-y-4">
            {/* جدول مواقيت الحصص المدرسي */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 font-['Cairo']">
                  جدول مواقيت اليوم المدرسي
                </h3>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {periods.map((p, pIdx) => {
                  const isCurrent = periodProgress.activePeriod?.id === p.id;
                  return (
                    <div
                      key={`${p.id}-${pIdx}`}
                      className={`py-2 px-2 flex items-center justify-between rounded-lg transition ${
                        isCurrent
                          ? 'bg-emerald-50 font-bold text-emerald-800'
                          : p.isBreak
                          ? 'text-amber-800 bg-amber-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {p.isBreak ? <Coffee className="w-3.5 h-3.5 text-amber-600" /> : <BookOpen className="w-3.5 h-3.5 text-indigo-600" />}
                        <span>{p.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                            الآن
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-slate-500">
                        {p.startTime} - {p.endTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* شريط الإعلانات والأخبار */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 font-['Cairo']">
                  الإعلانات والأخبار المدرسية
                </h3>
              </div>

              {announcements.filter((a) => a.active).length > 0 ? (
                <div className="space-y-2">
                  {announcements.filter((a) => a.active).map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1"
                    >
                      <p className="text-slate-900 font-medium leading-relaxed">{ann.text}</p>
                      <span className="text-[10px] text-slate-500 block">{ann.createdAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">لا توجد إعلانات نشطة حالياً</p>
              )}
            </div>

            {/* خيارات النظام */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 space-y-2.5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-600 mb-1">خيارات المشاهدة والتثبيت:</h4>

              {/* زر تثبيت تطبيق الجوال */}
              <PWAInstallButton className="w-full justify-center py-2.5" />

              <button
                onClick={onSwitchToTvMode}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition active:scale-95 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-indigo-600" />
                  <span>التبديل لوضع الشاشة الذكية (التلفزيون)</span>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onSwitchToAdmin}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition active:scale-95 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <span>فتح لوحة الإدارة والإشراف</span>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* بطاقة مبرمج ومطور النظام */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block leading-tight">مشرف النظام:</span>
                    <span className="text-xs font-black text-slate-900 font-['Cairo']">محمد درويش الزعابي</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  الإصدار الذكي
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 5. شريط التنقل السفلي المخصص للهواتف (Bottom Navigation Bar) بتصميم عصري وأنيق */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1.5 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* تبويب الفصول والمواد */}
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'classes'
                ? 'text-indigo-600 bg-indigo-50 font-black shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-0.5">
              <LayoutGrid className="w-4 h-4 mb-0.5" />
              <BookOpen className="w-3.5 h-3.5 mb-0.5 text-emerald-600" />
            </div>
            <span className="text-[10px]">الفصول والمواد</span>
          </button>

          {/* تبويب الاحتياط */}
          <button
            onClick={() => setActiveTab('substitutions')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition relative ${
              activeTab === 'substitutions'
                ? 'text-amber-700 bg-amber-50 font-black shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Users className="w-4 h-4 mb-0.5" />
              {todaySubstitutions.length > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center px-1">
                  {todaySubstitutions.length}
                </span>
              )}
            </div>
            <span className="text-[10px]">الاحتياط</span>
          </button>

          {/* تبويب المناوبة */}
          <button
            onClick={() => setActiveTab('duties')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'duties'
                ? 'text-emerald-700 bg-emerald-50 font-black shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">المناوبة</span>
          </button>

          {/* تبويب المزيد والمواقيت */}
          <button
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'more'
                ? 'text-cyan-700 bg-cyan-50 font-black shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">المواقيت</span>
          </button>
        </div>
      </nav>

      {/* نافذة طباعة كشاف الاحتياط لمدير المدرسة في وضع الهاتف */}
      {showPrintReport && (
        <PrintableSubstitutionReport
          isOpen={showPrintReport}
          onClose={() => setShowPrintReport(false)}
          substitutions={substitutions}
          selectedDay={selectedDay}
          reportMode={printReportMode}
          femaleTeachers={femaleTeachers}
        />
      )}
    </div>
  );
};
