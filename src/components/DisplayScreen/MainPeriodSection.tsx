import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PeriodProgress, ClassScheduleItem, Substitution, Period } from '../../types';
import {
  SCHOOL_WEEK_DAYS,
  SCHOOL_32_CLASSES,
  normalizePeriodId,
  normalizeDayName,
  normalizeClassName,
} from '../../utils/excelUtils';
import { getArabicDayName } from '../../utils/timeUtils';
import {
  User,
  AlertCircle,
  GraduationCap,
  Calendar,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  LayoutGrid,
  Search,
  UserCheck,
  Building,
  CheckCircle2,
  Sparkles,
  Layers,
  X,
  Clock,
} from 'lucide-react';
import {
  DisplayAudienceMode,
  buildFemaleTeachersCanonicalSet,
  isFemaleClassLesson,
  isFemaleSubstitution,
  getStoredFemaleTeachers,
} from '../../utils/femaleTeachersUtils';

interface MainPeriodSectionProps {
  periodProgress: PeriodProgress;
  timetable: ClassScheduleItem[];
  substitutions: Substitution[];
  currentDayName: string;
  realDayName?: string;
  onSelectDay?: (day: string) => void;
  periods?: Period[];
  effectiveTime?: Date;
  audienceMode?: DisplayAudienceMode;
  femaleTeachers?: string[];
  onToggleAudienceMode?: (mode: DisplayAudienceMode) => void;
}

/**
 * دالة لتحديد نسق وألوان المادة الدراسية لسهولة التمييز البصري الفوري
 */
export function getSubjectStyle(subject: string) {
  const s = subject || '';
  if (s.includes('إسلامية')) {
    return {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      headerBg: 'bg-emerald-600 text-white',
      accent: 'emerald',
      cardBg: 'bg-emerald-50/30 border-emerald-200/80',
      iconColor: 'text-emerald-600',
    };
  }
  if (s.includes('عربية')) {
    return {
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      headerBg: 'bg-amber-600 text-white',
      accent: 'amber',
      cardBg: 'bg-amber-50/30 border-amber-200/80',
      iconColor: 'text-amber-600',
    };
  }
  if (s.includes('رياضيات')) {
    return {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      headerBg: 'bg-blue-600 text-white',
      accent: 'blue',
      cardBg: 'bg-blue-50/30 border-blue-200/80',
      iconColor: 'text-blue-600',
    };
  }
  if (s.includes('علوم')) {
    return {
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      headerBg: 'bg-purple-600 text-white',
      accent: 'purple',
      cardBg: 'bg-purple-50/30 border-purple-200/80',
      iconColor: 'text-purple-600',
    };
  }
  if (s.includes('إنجليزية')) {
    return {
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      headerBg: 'bg-sky-600 text-white',
      accent: 'sky',
      cardBg: 'bg-sky-50/30 border-sky-200/80',
      iconColor: 'text-sky-600',
    };
  }
  if (s.includes('دراسات') || s.includes('اجتماعية')) {
    return {
      badge: 'bg-orange-50 text-orange-800 border-orange-200',
      headerBg: 'bg-orange-600 text-white',
      accent: 'orange',
      cardBg: 'bg-orange-50/30 border-orange-200/80',
      iconColor: 'text-orange-600',
    };
  }
  if (s.includes('تقنية') || s.includes('حاسوب') || s.includes('معلومات')) {
    return {
      badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      headerBg: 'bg-cyan-600 text-white',
      accent: 'cyan',
      cardBg: 'bg-cyan-50/30 border-cyan-200/80',
      iconColor: 'text-cyan-600',
    };
  }
  if (s.includes('بدنية') || s.includes('رياضة')) {
    return {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      headerBg: 'bg-rose-600 text-white',
      accent: 'rose',
      cardBg: 'bg-rose-50/30 border-rose-200/80',
      iconColor: 'text-rose-600',
    };
  }
  if (s.includes('فنون') || s.includes('تشكيلية')) {
    return {
      badge: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
      headerBg: 'bg-fuchsia-600 text-white',
      accent: 'fuchsia',
      cardBg: 'bg-fuchsia-50/30 border-fuchsia-200/80',
      iconColor: 'text-fuchsia-600',
    };
  }
  if (s.includes('موسيقية') || s.includes('مهارات موسيقية')) {
    return {
      badge: 'bg-teal-50 text-teal-800 border-teal-200',
      headerBg: 'bg-teal-600 text-white',
      accent: 'teal',
      cardBg: 'bg-teal-50/30 border-teal-200/80',
      iconColor: 'text-teal-600',
    };
  }
  return {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    headerBg: 'bg-indigo-600 text-white',
    accent: 'indigo',
    cardBg: 'bg-slate-50 border-slate-200/80',
    iconColor: 'text-indigo-600',
  };
}

export const MainPeriodSection: React.FC<MainPeriodSectionProps> = ({
  periodProgress,
  timetable,
  substitutions,
  currentDayName,
  realDayName,
  onSelectDay,
  effectiveTime = new Date(),
  audienceMode = 'general',
  femaleTeachers: initialFemaleTeachers,
  onToggleAudienceMode,
}) => {
  const { activePeriod, nextPeriod } = periodProgress;

  const femaleTeachers = useMemo(() => {
    return initialFemaleTeachers && initialFemaleTeachers.length > 0
      ? initialFemaleTeachers
      : getStoredFemaleTeachers();
  }, [initialFemaleTeachers]);

  const femaleCanonicalSet = useMemo(() => {
    return buildFemaleTeachersCanonicalSet(femaleTeachers);
  }, [femaleTeachers]);

  // وضع العرض: 'classes' (شبكة الفصول 32) أو 'subjects' (عرض الحصص حسب المواد الدراسية)
  const [viewMode, setViewMode] = useState<'classes' | 'subjects'>('classes');

  // تحديد الحصة المستهدفة للعرض. الاختيار اليدوي مؤقت ثم يعود العرض للحصة الحية.
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const manualSelectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectivePeriodId = selectedPeriodId || (
    activePeriod && !activePeriod.isBreak
      ? activePeriod.id
      : (nextPeriod && !nextPeriod.isBreak ? nextPeriod.id : 'p1')
  );

  // قائمة الحصص الموثوقة كما كانت في الملف الأصلي، للحفاظ على الفصل الصريح بين p7 وp8.
  const teachingPeriodsList = useMemo(
    () => [
      { id: 'p1', name: 'الحصة 1' },
      { id: 'p2', name: 'الحصة 2' },
      { id: 'p3', name: 'الحصة 3' },
      { id: 'p4', name: 'الحصة 4' },
      { id: 'p5', name: 'الحصة 5' },
      { id: 'p6', name: 'الحصة 6' },
      { id: 'p7', name: 'الحصة 7' },
      { id: 'p8', name: 'الحصة 8' },
    ],
    []
  );

  const handleSelectPeriod = (periodId: string) => {
    setSelectedPeriodId(periodId);

    if (manualSelectionTimerRef.current) {
      clearTimeout(manualSelectionTimerRef.current);
    }

    // استعراض يدوي مؤقت، ثم العودة تلقائيًا إلى الحصة الحية بعد 30 ثانية.
    manualSelectionTimerRef.current = setTimeout(() => {
      setSelectedPeriodId(null);
    }, 30000);
  };

  const handleReturnToLivePeriod = () => {
    if (manualSelectionTimerRef.current) {
      clearTimeout(manualSelectionTimerRef.current);
      manualSelectionTimerRef.current = null;
    }
    setSelectedPeriodId(null);
  };

  useEffect(() => {
    return () => {
      if (manualSelectionTimerRef.current) {
        clearTimeout(manualSelectionTimerRef.current);
      }
    };
  }, []);

  const substitutionTimestamp = (sub: Substitution): number => {
    const parsed = Date.parse(String(sub.updatedAt || sub.date || ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // مطابقة موحدة: اليوم + الحصة + الفصل، ثم اختيار أحدث تكليف غير ملغي.
  const getSubstitutionForClass = useCallback((gradeClass: string) => {
    const exactPeriodId = normalizePeriodId(effectivePeriodId);
    const targetClass = normalizeClassName(gradeClass);
    const targetDay = normalizeDayName(currentDayName);
    return substitutions
      .filter((sub) => {
        if (sub.status === 'ملغي') return false;
        if (normalizeClassName(sub.gradeClass) !== targetClass) return false;
        if (normalizePeriodId(sub.period) !== exactPeriodId) return false;
        const explicitDay = normalizeDayName(sub.day || '');
        if (explicitDay) return explicitDay === targetDay;
        if (!sub.date) return false;
        const parsed = new Date(sub.date);
        return !Number.isNaN(parsed.getTime()) && normalizeDayName(getArabicDayName(parsed)) === targetDay;
      })
      .sort((a, b) => substitutionTimestamp(b) - substitutionTimestamp(a))[0];
  }, [effectivePeriodId, currentDayName, substitutions]);

  // عرض جميع الفصول الرسمية مع بيانات الجدول الحقيقية فقط.
  // إذا كانت بيانات فصل ناقصة لا يتم اختلاق مادة أو معلم، بل تظهر حالة واضحة للمراجعة.
  const currentPeriodClasses = useMemo(() => {
    // مطابقة مباشرة تمنع دمج الحصة السابعة p7 مع الحصة الثامنة p8، مع تطبيع اسم اليوم ومعرف الحصة
    const exactPeriodId = normalizePeriodId(effectivePeriodId);
    const targetDay = normalizeDayName(currentDayName);
    const actualLessons = timetable.filter((item) => {
      const itemDay = normalizeDayName(item.day);
      const itemPeriodId = normalizePeriodId(item.periodId);
      return itemDay === targetDay && itemPeriodId === exactPeriodId;
    });

    const byClass = new Map<string, ClassScheduleItem>();
    actualLessons.forEach((lesson) => {
      const cNorm = normalizeClassName(lesson.gradeClass);
      if (cNorm && !byClass.has(cNorm)) {
        byClass.set(cNorm, lesson);
      }
    });

    if (audienceMode === 'assistant') {
      const assistantClasses: ClassScheduleItem[] = [];
      const handledClasses = new Set<string>();

      actualLessons.forEach((lesson) => {
        const sub = getSubstitutionForClass(lesson.gradeClass);
        if (isFemaleClassLesson(lesson, femaleCanonicalSet, sub)) {
          assistantClasses.push(lesson);
          handledClasses.add(normalizeClassName(lesson.gradeClass));
        }
      });

      // إضافة أي فصل مسجل له احتياط يخص المعلمات في هذه الحصة
      substitutions.forEach((sub) => {
        if (sub.status === 'ملغي') return;
        if (normalizePeriodId(sub.period) !== exactPeriodId) return;
        const subDay = normalizeDayName(sub.day || '');
        if (subDay && subDay !== targetDay) return;
        const cNorm = normalizeClassName(sub.gradeClass);
        if (!handledClasses.has(cNorm) && isFemaleSubstitution(sub, femaleCanonicalSet)) {
          handledClasses.add(cNorm);
          assistantClasses.push({
            id: `sub-lesson-${targetDay}-${exactPeriodId}-${sub.gradeClass}`,
            day: targetDay,
            periodId: exactPeriodId,
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

    return SCHOOL_32_CLASSES.map((gradeClass) => {
      const cNorm = normalizeClassName(gradeClass);
      return byClass.get(cNorm) || {
        id: `missing-${targetDay}-${exactPeriodId}-${gradeClass}`,
        day: targetDay,
        periodId: exactPeriodId,
        gradeClass,
        subject: '',
        teacher: '',
        room: '',
      };
    });
  }, [timetable, effectivePeriodId, currentDayName, audienceMode, femaleCanonicalSet, substitutions]);

  const todayDateKey = useMemo(() => {
    const year = effectiveTime.getFullYear();
    const month = String(effectiveTime.getMonth() + 1).padStart(2, '0');
    const day = String(effectiveTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [effectiveTime]);
  // محدد فلترة الصف الدراسي في وضع الفصول (الكل، 5، 6، 7، 8)
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | '5' | '6' | '7' | '8'>('all');

  // محدد فلترة المادة الدراسية في وضع المواد
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // حقل البحث السريع (معلم، صف، مادة)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // تحويل مسمى الحصة في سجل الاحتياط إلى معرف الجدول
  const getExactSubstitutionPeriodId = (value: unknown): string => normalizePeriodId(value);

  const normalizeDateKey = (value: unknown): string => {
    if (!value) return '';
    const raw = String(value).trim();
    const directMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (directMatch) return `${directMatch[1]}-${directMatch[2]}-${directMatch[3]}`;

    const parsedDate = new Date(raw);
    if (Number.isNaN(parsedDate.getTime())) return '';

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // تجميع الحصص حسب المواد الدراسية لسهولة العثور على المعلم وحصته
  const subjectGroups = useMemo(() => {
    const map = new Map<string, ClassScheduleItem[]>();
    currentPeriodClasses.forEach((item) => {
      const subj = item.subject || 'أخرى';
      const list = map.get(subj) || [];
      list.push(item);
      map.set(subj, list);
    });

    const groups = Array.from(map.entries()).map(([subject, classes]) => {
      // ترتيب الفصول تصاعدياً داخل كل مادة (5/1, 5/2... 8/7)
      const sortedClasses = [...classes].sort((a, b) =>
        a.gradeClass.localeCompare(b.gradeClass, undefined, { numeric: true })
      );
      return {
        subject,
        classes: sortedClasses,
      };
    });

    // ترتيب المجموعات تنازلياً حسب عدد الفصول ثم أبجدياً
    return groups.sort((a, b) => b.classes.length - a.classes.length || a.subject.localeCompare(b.subject));
  }, [currentPeriodClasses]);

  // تصفية المواد بحسب المادة المحددة والبحث
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
            const sub = getSubstitutionForClass(c.gradeClass);
            const teacherMatch = c.teacher.toLowerCase().includes(q);
            const classMatch = c.gradeClass.toLowerCase().includes(q);
            const subMatch = sub ? sub.substituteTeacher.toLowerCase().includes(q) : false;
            return teacherMatch || classMatch || subMatch;
          });

          if (matchesSubject) return g;
          if (matchedClasses.length > 0) return { ...g, classes: matchedClasses };
          return null;
        })
        .filter(Boolean) as { subject: string; classes: ClassScheduleItem[] }[];
    }

    return result;
  }, [subjectGroups, selectedSubjectFilter, searchQuery, substitutions, todayDateKey]);

  // تصفية الفصول بحسب الصف المختار والبحث
  const filteredByGradeClasses = useMemo(() => {
    let list = currentPeriodClasses;
    if (selectedGradeFilter !== 'all') {
      list = list.filter((item) => item.gradeClass.startsWith(selectedGradeFilter + '/'));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((item) => {
        const sub = getSubstitutionForClass(item.gradeClass);
        return (
          item.gradeClass.toLowerCase().includes(q) ||
          item.teacher.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          (sub && sub.substituteTeacher.toLowerCase().includes(q))
        );
      });
    }
    return list;
  }, [currentPeriodClasses, selectedGradeFilter, searchQuery, substitutions, todayDateKey]);

  // إعدادات العرض لشبكة الفصول
  const itemsPerPage = audienceMode === 'assistant' ? 32 : 16; 
  const [currentPage, setCurrentPage] = useState<number>(0);
  const totalPages = selectedGradeFilter === 'all' && !searchQuery
    ? Math.max(1, Math.ceil(filteredByGradeClasses.length / itemsPerPage))
    : 1;

  // مؤقت التبديل التلقائي بدون لمس (Auto-Paging يغير بين الصفحة 1 و 2 كل 10 ثوانٍ)
  const [pageCountdown, setPageCountdown] = useState<number>(10);

  // تشغيل مؤقت التقليب الدوري المستقل كل 10 ثوانٍ ومؤقت الثواني التنازلي
  useEffect(() => {
    if (totalPages <= 1 || viewMode === 'subjects') return;

    // المؤقت الرئيسي لتبديل الصفحة كل 10 ثوانٍ بشكل قطعي ومباشر
    const pageTimer = setInterval(() => {
      setCurrentPage((prev) => (prev === 0 ? 1 : 0));
      setPageCountdown(10);
    }, 10000);

    // مؤقت الثواني التنازلي (10، 9، 8...)
    const countdownTimer = setInterval(() => {
      setPageCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(pageTimer);
      clearInterval(countdownTimer);
    };
  }, [totalPages, viewMode]);

  // حماية: إعادة ضبط الصفحة للصفحة الأولى فقط عند تغيير اليوم أو الحصة أو الفلتر
  const lastStateKeyRef = useRef<string>(`${effectivePeriodId}-${currentDayName}-${selectedGradeFilter}-${viewMode}`);
  useEffect(() => {
    const currentKey = `${effectivePeriodId}-${currentDayName}-${selectedGradeFilter}-${viewMode}`;
    if (lastStateKeyRef.current !== currentKey) {
      lastStateKeyRef.current = currentKey;
      setCurrentPage(0);
      setPageCountdown(10);
    }
  }, [effectivePeriodId, currentDayName, selectedGradeFilter, viewMode]);

  // الفصول المعروضة في الصفحة الحالية
  const displayedClasses = selectedGradeFilter === 'all' && !searchQuery
    ? filteredByGradeClasses.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : filteredByGradeClasses;

  const handleNextPage = () => {
    setCurrentPage((curr) => (curr + 1) % totalPages);
    setPageCountdown(10);
  };

  const handlePrevPage = () => {
    setCurrentPage((curr) => (curr - 1 + totalPages) % totalPages);
    setPageCountdown(10);
  };

  return (
    <section className="flex-1 flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 p-2 md:p-2.5 shadow-xs overflow-hidden relative">
      {/* 1. الشريط العلوي: اختيار اليوم + اختيار الحصة + زر التبديل بين وضع الفصول ووضع المواد */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 mb-1.5 border-b border-slate-200 shrink-0">
        {/* اختيار اليوم */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold text-slate-700 ml-0.5">اليوم:</span>
          {SCHOOL_WEEK_DAYS.map((day) => {
            const isSelected = day === currentDayName;
            const isRealToday = day === realDayName;

            return (
              <button
                key={day}
                onClick={() => onSelectDay && onSelectDay(day)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <span>{day}</span>
                {isRealToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* أزرار الحصص ومحدد نمط العرض (فصول vs مواد) */}
        <div className="flex items-center gap-1.5">
          {/* محدد نمط العرض: عرض الفصول الدراسية أو عرض حسب المواد الدراسية */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('classes')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'classes'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="عرض الحصص موزعة حسب الفصول الدراسية (32 فصلاً)"
            >
              <LayoutGrid className="w-3 h-3 text-indigo-600" />
              <span>عرض الفصول (32)</span>
            </button>

            <button
              onClick={() => setViewMode('subjects')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'subjects'
                  ? 'bg-white text-emerald-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="عرض الحصص مصنفة حسب المواد الدراسية لسهولة العثور على المعلم"
            >
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>عرض المواد</span>
              <span className="text-[9px] px-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                {subjectGroups.length}
              </span>
            </button>
          </div>

          {/* محدد الحصص السريع */}
          <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {teachingPeriodsList.map((p) => {
              const isSelected = effectivePeriodId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPeriod(p.id)}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={p.name}
                >
                  {p.name.replace('الحصة ', 'ح')}
                </button>
              );
            })}
            {selectedPeriodId && (
              <button
                type="button"
                onClick={handleReturnToLivePeriod}
                className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition"
                title="العودة إلى الحصة الجارية"
              >
                مباشر
              </button>
            )}
          </div>

          {/* مؤشر الصفحة التلقائي في وضع الفصول فقط */}
          {viewMode === 'classes' && totalPages > 1 && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-lg text-xs shadow-xs">
              <button
                onClick={handlePrevPage}
                className="text-slate-500 hover:text-slate-900 p-0.5 transition"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className={`font-black px-1.5 py-0.2 rounded ${
                  currentPage === 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  صفحة {currentPage + 1}/{totalPages}
                </span>
                <span className="text-slate-500 text-[9px]">
                  {currentPage === 0 ? '(1-16)' : '(17-32)'}
                </span>
                <span className="text-amber-800 font-bold text-[9px] flex items-center gap-0.5 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                  <RotateCcw className="w-2.5 h-2.5 animate-spin text-amber-600" />
                  <span>{pageCountdown}ث</span>
                </span>
              </div>

              <button
                onClick={handleNextPage}
                className="text-slate-500 hover:text-slate-900 p-0.5 transition"
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. شريط التصفية والبحث المتخصص بحسب نمط العرض */}
      {viewMode === 'classes' ? (
        /* شريط اختيار صفوف المدرسة في وضع الفصول (5، 6، 7، 8) */
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 mb-1 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-slate-500 pl-0.5">المرحلة:</span>
            <button
              onClick={() => setSelectedGradeFilter('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                selectedGradeFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              كافة الفصول (32)
            </button>
            <button
              onClick={() => setSelectedGradeFilter('5')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                selectedGradeFilter === '5'
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100'
              }`}
            >
              الصف 5 (5/1 - 5/8)
            </button>
            <button
              onClick={() => setSelectedGradeFilter('6')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                selectedGradeFilter === '6'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              الصف 6 (6/1 - 6/9)
            </button>
            <button
              onClick={() => setSelectedGradeFilter('7')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                selectedGradeFilter === '7'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              الصف 7 (7/1 - 7/8)
            </button>
            <button
              onClick={() => setSelectedGradeFilter('8')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                selectedGradeFilter === '8'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              الصف 8 (8/1 - 8/7)
            </button>
          </div>

          {/* حقل بحث مصغر */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث عن معلم أو مادة أو صف..."
              className="bg-slate-50 border border-slate-200 rounded-lg pr-8 pl-5 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white w-44"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2 top-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* شريط تصنيف المواد في وضع المواد الدراسية */
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 mb-1 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
            <span className="text-[10px] font-bold text-slate-500 pl-1 shrink-0">تصفية المادة:</span>
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border shrink-0 ${
                selectedSubjectFilter === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
              }`}
            >
              جميع المواد ({subjectGroups.length})
            </button>

            {subjectGroups.map((group) => {
              const style = getSubjectStyle(group.subject);
              const isSelected = selectedSubjectFilter === group.subject;
              return (
                <button
                  key={group.subject}
                  onClick={() => setSelectedSubjectFilter(group.subject)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition border shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? `${style.headerBg} shadow-xs`
                      : `${style.badge} hover:opacity-85`
                  }`}
                >
                  <span>{group.subject}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-slate-700'
                  }`}>
                    {group.classes.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* حقل بحث سريع عن المعلم وحصته */}
          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم المعلم أو الحصة..."
              className="bg-slate-50 border border-slate-200 rounded-lg pr-8 pl-5 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white w-44 md:w-52 font-bold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2 top-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {viewMode === 'classes' && (
        <div className="mb-1.5 flex items-center justify-between gap-1.5 text-[10px] font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            {audienceMode === 'assistant' ? (
              <span className="px-2.5 py-0.5 rounded-lg bg-violet-100 text-violet-900 border border-violet-300 font-black flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-600" />
                <span>وضع المديرة المساعدة: {currentPeriodClasses.length} حصة لمعلمات المدرسة</span>
              </span>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200">{currentPeriodClasses.filter((item) => item.teacher).length} حصة فعلية</span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">{currentPeriodClasses.filter((item) => getSubstitutionForClass(item.gradeClass)).length} احتياط</span>
                <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">{currentPeriodClasses.filter((item) => !item.teacher).length} بحاجة للمراجعة</span>
              </>
            )}
          </div>

          {onToggleAudienceMode && (
            <button
              type="button"
              onClick={() => onToggleAudienceMode(audienceMode === 'assistant' ? 'general' : 'assistant')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1 border ${
                audienceMode === 'assistant'
                  ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>{audienceMode === 'assistant' ? 'العودة للوضع العام' : 'وضع المديرة المساعدة'}</span>
            </button>
          )}
        </div>
      )}

      {/* 3. جسم العرض الرئيسي: إما شبكة الفصول (32 فصلاً) أو مصنفة حسب المواد الدراسية */}
      {viewMode === 'classes' ? (
        /* أ) شبكة الفصول الدراسية بتناسق مثالي يمنع اقتطاع أي بطاقة في الشاشات الذكية */
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {displayedClasses.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/70 rounded-2xl border-2 border-dashed border-slate-200 text-center">
              <GraduationCap className="w-12 h-12 text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">
                {audienceMode === 'assistant'
                  ? 'لا توجد حصص دراسية مجدولة للمعلمات في هذه الحصة'
                  : 'لا توجد فصول مطابقة للبحث أو الفلتر'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {audienceMode === 'assistant'
                  ? 'قد تكون هذه الحصة فترة فراغ للمعلمات أو خارج أوقات الحصص'
                  : 'يرجى اختيار حصة أخرى أو إزالة الفلاتر'}
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-4 gap-1.5 xl:gap-2">
              {displayedClasses.map((item, idx) => {
              const sub = getSubstitutionForClass(item.gradeClass);
              const subjectStyle = getSubjectStyle(item.subject);
              const isConfirmed = Boolean(sub && (sub.status === 'تم الحضور' || sub.acknowledgedAt));

              return (
                <div
                  key={item.id}
                  className={`relative min-h-0 overflow-hidden rounded-xl px-2.5 py-1.5 transition-all duration-200 border flex flex-col justify-center gap-1.5 ${
                    isConfirmed
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-xs ring-1 ring-emerald-300/60'
                      : sub
                      ? 'bg-amber-50/90 border-amber-300 shadow-xs ring-1 ring-amber-300/60'
                      : 'bg-white border-slate-200/90 hover:border-indigo-400 hover:shadow-xs shadow-2xs'
                  }`}
                >
                  {/* الصف الدراسي والمادة ورقم الفصل وشارة الاحتياط بدون فراغ زائد */}
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    {/* وسم اسم الصف وشارة الاحتياط */}
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center gap-1 bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded-md border border-slate-200/90 font-mono font-black text-xs shrink-0 shadow-2xs">
                        <GraduationCap className="w-3 h-3 text-indigo-600 shrink-0" />
                        <span className="whitespace-nowrap tracking-tight">{item.gradeClass}</span>
                      </div>
                      {sub && (
                        isConfirmed ? (
                          <span className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-emerald-600 text-white shadow-xs flex items-center gap-0.5 shrink-0 ring-1 ring-emerald-300">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-200" />
                            <span>تم الحضور</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md text-[8.5px] font-black bg-amber-500 text-white shadow-xs flex items-center gap-0.5 animate-pulse shrink-0">
                            <AlertCircle className="w-2.5 h-2.5 text-white" />
                            <span>احتياط</span>
                          </span>
                        )
                      )}
                    </div>

                    {/* المادة الدراسية: ملونة بحسب تخصص المادة وتتكيف بانسيابية */}
                    <span
                      title={item.subject}
                      className={`text-[10px] md:text-[11px] px-1.5 py-0.5 rounded-md font-black min-w-0 text-right leading-tight truncate ${subjectStyle.badge}`}
                    >
                      {item.subject}
                    </span>
                  </div>

                  {/* بيانات المعلم الأساسي أو المعلم البديل متقاربة ومتناسقة دون مسافة فاصلة كبيرة */}
                  <div className="bg-slate-50/80 rounded-lg px-2 py-1 border border-slate-100 min-h-0">
                    {sub ? (
                      <div className="space-y-0.5 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[9px]">الغائب:</span>
                          <span className="text-rose-600 line-through font-medium truncate max-w-[120px] text-[9.5px]">
                            {sub.absentTeacher || item.teacher}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-800 font-bold flex items-center gap-0.5 shrink-0 text-[9px]">
                            <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            البديل:
                          </span>
                          <span className="text-emerald-700 font-black truncate max-w-[130px] text-[11px]" title={sub.substituteTeacher}>
                            أ. {sub.substituteTeacher}
                          </span>
                        </div>
                      </div>
                    ) : item.teacher ? (
                      <div>
                        <span className="text-[9px] text-slate-500 flex items-center gap-1 leading-none mb-0.5">
                          <User className="w-3 h-3 text-indigo-600 shrink-0" />
                          المعلم:
                        </span>
                        <span className="block text-xs md:text-[13px] font-black text-slate-900 leading-tight truncate" title={item.teacher}>
                          {item.teacher}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-1.5 py-0.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] font-black">لا توجد حصة مسجلة</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      ) : (
        /* ب) ميزة عرض الحصص مصنفة حسب المواد الدراسية لسهولة العثور على المعلم وحصته */
        <div className="flex-1 overflow-y-auto scrollbar-thin pr-0.5 space-y-3">
          {filteredSubjectGroups.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              لا توجد حصص مطابقة لمعايير البحث في هذه الحصة ({effectivePeriodId}).
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredSubjectGroups.map((group) => {
                const style = getSubjectStyle(group.subject);

                return (
                  <div
                    key={group.subject}
                    className={`rounded-2xl border p-3 flex flex-col justify-between shadow-2xs transition hover:shadow-xs ${style.cardBg}`}
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

                    {/* قائمة الحصص والمعلمين لهذه المادة في هذه الحصة */}
                    <div className="space-y-1.5">
                      {group.classes.map((cls) => {
                        const sub = getSubstitutionForClass(cls.gradeClass);
                        const isConfirmed = Boolean(sub && (sub.status === 'تم الحضور' || sub.acknowledgedAt));

                        return (
                          <div
                            key={cls.id}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition ${
                              isConfirmed
                                ? 'bg-emerald-50/95 border-emerald-300 ring-1 ring-emerald-300/50'
                                : sub
                                ? 'bg-amber-50/95 border-amber-300 ring-1 ring-amber-300/50'
                                : 'bg-white border-slate-200/80 hover:border-slate-300'
                            }`}
                          >
                            {/* وسم الصف الدراسي - واضح جداً وبخط عريض لا ينقطع */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="flex items-center gap-1 bg-slate-100 text-slate-900 px-2 py-0.5 rounded-md border border-slate-200 font-mono font-black text-xs shadow-2xs">
                                <GraduationCap className="w-3 h-3 text-indigo-600 shrink-0" />
                                <span className="whitespace-nowrap">{cls.gradeClass}</span>
                              </div>
                            </div>

                            {/* اسم المعلم والقاعة أو المعلم البديل */}
                            <div className="flex-1 min-w-0 text-right">
                              {sub ? (
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1 text-xs font-black text-emerald-800 truncate">
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="truncate">البديل: أ. {sub.substituteTeacher}</span>
                                    {isConfirmed ? (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-600 text-white font-bold shrink-0 flex items-center gap-0.5">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        تم الحضور
                                      </span>
                                    ) : (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-white font-bold shrink-0">
                                        احتياط
                                      </span>
                                    )}
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
                              <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
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
          )}
        </div>
      )}
    </section>
  );
};
