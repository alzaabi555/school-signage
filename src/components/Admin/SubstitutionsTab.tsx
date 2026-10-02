import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Substitution, Period, SubstitutionStatus, ClassScheduleItem } from '../../types';
import { INITIAL_CLASSES, INITIAL_TEACHERS, INITIAL_SUBJECTS, INITIAL_PERIODS } from '../../data/initialData';
import { OFFICIAL_TEACHERS_BY_SUBJECT } from '../../data/officialTimetableData';
import { normalizePeriodId, SCHOOL_WEEK_DAYS, normalizeDayName, normalizeClassName } from '../../utils/excelUtils';
import { getTeachersBySubject } from '../../utils/teachersUtils';
import { saveFemaleTeachersToFirestore, saveCustomSubjectsToFirestore } from '../../services/firebase';
import { TeachersBySubjectModal } from './TeachersBySubjectModal';
import { PrintableSubstitutionReport } from './PrintableSubstitutionReport';
import { SubstitutionQrModal } from '../Modals/SubstitutionQrModal';
import { formatAcknowledgmentTime } from '../../utils/qrUtils';
import {
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Send,
  User,
  BookOpen,
  Calendar,
  Layers,
  Edit2,
  X,
  Settings,
  Sparkles,
  Search,
  UserCheck,
  Check,
  Clock,
  Filter,
  CheckSquare,
  Users,
  Printer,
  QrCode,
  CheckCircle2,
} from 'lucide-react';

interface SubstitutionsTabProps {
  substitutions: Substitution[];
  periods: Period[];
  timetable?: ClassScheduleItem[];
  onAddSubstitution: (sub: Omit<Substitution, 'id'>) => Promise<void>;
  onBulkAddSubstitutions?: (subs: Omit<Substitution, 'id'>[]) => Promise<void>;
  onDeleteSubstitution: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: SubstitutionStatus) => Promise<void>;
  onClearAllSubstitutions?: () => Promise<void>;
  onBulkReplaceTimetable?: (items: ClassScheduleItem[]) => Promise<any> | void;
  isSubmitting: boolean;
  gasUrl?: string;
}

const STORAGE_CUSTOM_SUBJECTS = 'school_signage_custom_subjects';
const STORAGE_DELETED_SUBJECTS = 'school_signage_deleted_subjects';
const STORAGE_FEMALE_TEACHERS = 'school_signage_female_teachers';

// المواد الثانوية غير المعنية بصفوف المدرسة (5، 6، 7، 8)
const IRRELEVANT_SUBJECTS = new Set([
  'فيزياء',
  'كيمياء',
  'أحياء',
  'تقنية رقمية',
  'علوم إسلامية',
  'علم الأرض والفضاء',
  'إحصاء',
]);

/**
 * دالة مساعدة لتطبيع وتوحيد النصوص العربية للمقارنة الذكية للمواد وأسماء المعلمين
 */
const normalizeArabicText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // تشكيل
    .replace(/[إأآآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

/**
 * توحيد أسماء المعلمين القديمة والجديدة، خصوصًا الحروف الزائدة في النسخ السابقة.
 */
const canonicalTeacherName = (teacherName: string): string => {
  const cleaned = String(teacherName || '')
    .trim()
    .replace(/^أ\.\s*/, '')
    .replace(/\s+[عر]$/, '')
    .replace(/\s+/g, ' ');

  const aliases: Record<string, string> = {
    [normalizeArabicText('وفاء السعيدي')]: 'وفاء السعيدي',
    [normalizeArabicText('عبير البادي')]: 'عبير البادي',
    [normalizeArabicText('فاطمة الكعبي')]: 'فاطمة الكعبي',
    [normalizeArabicText('أميرة الزيدية')]: 'أميرة الزيدية',
    [normalizeArabicText('ميرة البلوشية')]: 'ميرة البلوشية',
    [normalizeArabicText('السعيدية اليقين')]: 'اليقين السعيدية',
    [normalizeArabicText('اليقين السعيدية')]: 'اليقين السعيدية',
  };
  return aliases[normalizeArabicText(cleaned)] || cleaned;
};

const isSameTeacher = (left: string, right: string): boolean =>
  normalizeArabicText(canonicalTeacherName(left)) ===
  normalizeArabicText(canonicalTeacherName(right));

/**
 * فحص تطابق اسم المادة مع مراعاة أل التعريف وتعدد الصيغ
 */
const canonicalSubjectName = (subjectName: string): string => {
  const normalized = normalizeArabicText(subjectName)
    .replace(/^ماده\s+/, '')
    .replace(/^مادة\s+/, '')
    .replace(/^ال/, '');

  const aliases: Record<string, string> = {
    'رياضيات': 'رياضيات',
    'علوم': 'علوم',
    'لغه عربيه': 'لغة عربية',
    'لغة عربية': 'لغة عربية',
    'عربي': 'لغة عربية',
    'لغه انجليزيه': 'لغة إنجليزية',
    'لغة انجليزية': 'لغة إنجليزية',
    'انجليزي': 'لغة إنجليزية',
    'تربيه اسلاميه': 'التربية الإسلامية',
    'تربيه الاسلاميه': 'التربية الإسلامية',
    'دراسات اجتماعيه': 'الدراسات الاجتماعية',
    'تربيه موسيقيه': 'التربية الموسيقية',
    'تربيه موسقيه': 'التربية الموسيقية',
    'موسيقي': 'التربية الموسيقية',
    'تربيه بدنيه': 'التربية البدنية',
    'بدنيه': 'التربية البدنية',
    'فنون تشكيليه': 'الفنون التشكيلية',
    'فن تشكيلي': 'الفنون التشكيلية',
    'تقنيه معلومات': 'تقنية المعلومات',
    'تقنيه المعلومات': 'تقنية المعلومات',
  };

  return aliases[normalized] || normalized;
};

/**
 * مطابقة صارمة للمادة بعد توحيد صيغها المعروفة.
 * لا تستخدم includes حتى لا تتطابق "علوم" خطأً مع كلمة "معلومات".
 */
const isSubjectMatch = (subjA: string, subjB: string): boolean => {
  if (!subjA || !subjB) return false;
  return canonicalSubjectName(subjA) === canonicalSubjectName(subjB);
};

// مجموعة المهارات الفردية المعتمدة في توزيع الاحتياط.
// تبقى المواد مستقلة في الجدول والتقارير، لكنها تشترك في خيارات البدلاء.
const INDIVIDUAL_SKILLS_SUBJECTS = [
  'التربية الموسيقية',
  'التربية البدنية',
  'الفنون التشكيلية',
  'تقنية المعلومات',
] as const;

const isIndividualSkillsSubject = (subjectName: string): boolean =>
  INDIVIDUAL_SKILLS_SUBJECTS.some((skillSubject) =>
    isSubjectMatch(skillSubject, subjectName)
  );

const isSubstitutionSubjectMatch = (candidateSubject: string, lessonSubject: string): boolean => {
  if (isSubjectMatch(candidateSubject, lessonSubject)) return true;
  return isIndividualSkillsSubject(candidateSubject) && isIndividualSkillsSubject(lessonSubject);
};

const getSubstitutionGroupLabel = (subjectName: string): string =>
  isIndividualSkillsSubject(subjectName)
    ? 'مجموعة المهارات الفردية'
    : `مادة (${subjectName})`;

export const SubstitutionsTab: React.FC<SubstitutionsTabProps> = ({
  substitutions,
  periods,
  timetable = [],
  onAddSubstitution,
  onBulkAddSubstitutions,
  onDeleteSubstitution,
  onUpdateStatus,
  onClearAllSubstitutions,
  onBulkReplaceTimetable,
  isSubmitting,
  gasUrl,
}) => {
  // حالة مراقبة تحديث دليل المعلمين محلياً وسحابياً لإعادة رسم التوزيع فوراً
  const [teachersUpdateTrigger, setTeachersUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setTeachersUpdateTrigger((prev) => prev + 1);
    };
    window.addEventListener('school_signage_teachers_updated', handleUpdate);
    return () => window.removeEventListener('school_signage_teachers_updated', handleUpdate);
  }, []);

  // خريطة المعلمين مصنفين حسب المواد الدراسية المعتمدة (تتحدث فور إضافة أو مزامنة أي معلم أو متدرب)
  const teachersBySubjectMap = useMemo(() => {
    return getTeachersBySubject(timetable);
  }, [timetable, teachersUpdateTrigger]);

  // 1. استخراج أسماء المعلمين تلقائياً من جدول الحصص ومن دليل المعلمين والمتدربين المعتمد
  const extractedTeachers = useMemo(() => {
    const teachersByCanonicalName = new Map<string, string>();
    timetable.forEach((item) => {
      if (item.teacher && item.teacher.trim() && !item.teacher.includes('معلم شاغر')) {
        const displayName = canonicalTeacherName(item.teacher);
        const key = normalizeArabicText(displayName);
        if (key && !teachersByCanonicalName.has(key)) teachersByCanonicalName.set(key, displayName);
      }
    });

    // شمول جميع المعلمين والمتدربين المسجلين في دليل المواد حتى لو لم تكن لهم حصص مجدولة بعد
    Object.values(teachersBySubjectMap).flat().forEach((t) => {
      if (t && t.trim() && !t.includes('شاغر')) {
        const displayName = canonicalTeacherName(t);
        const key = normalizeArabicText(displayName);
        if (key && !teachersByCanonicalName.has(key)) teachersByCanonicalName.set(key, displayName);
      }
    });

    const list = Array.from(teachersByCanonicalName.values()).sort((a, b) => a.localeCompare(b, 'ar'));
    return list.length > 0 ? list : INITIAL_TEACHERS.map(canonicalTeacherName);
  }, [timetable, teachersBySubjectMap]);

  // 2. إدارة وتعديل قائمة المواد الدراسية المعتمدة
  const [customSubjects, setCustomSubjects] = useState<string[]>(() => {
    try {
      const deletedRaw = localStorage.getItem(STORAGE_DELETED_SUBJECTS);
      const deletedSet = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
      IRRELEVANT_SUBJECTS.forEach((s) => deletedSet.add(s));

      const saved = localStorage.getItem(STORAGE_CUSTOM_SUBJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(
            (s) => typeof s === 'string' && s.trim() && !deletedSet.has(s.trim())
          );
          if (filtered.length > 0) {
            return filtered;
          }
        }
      }
    } catch {}

    // القائمة الافتراضية المعتمدة لصفوف المدرسة (5، 6، 7، 8) مع استبعاد المواد الثانوية
    return INITIAL_SUBJECTS.filter((s) => !IRRELEVANT_SUBJECTS.has(s));
  });

  // تحديث قائمة المواد تلقائياً عند تغيير أو رفع جدول إكسل جديد (مع احترام المواد المحذوفة عمداً)
  useEffect(() => {
    if (!timetable || timetable.length === 0) return;
    try {
      const deletedRaw = localStorage.getItem(STORAGE_DELETED_SUBJECTS);
      const deletedSet = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
      IRRELEVANT_SUBJECTS.forEach((s) => deletedSet.add(s));

      const currentSet = new Set(customSubjects);
      let hasNew = false;
      timetable.forEach((t) => {
        if (
          t.subject &&
          t.subject.trim() &&
          !currentSet.has(t.subject.trim()) &&
          !deletedSet.has(t.subject.trim())
        ) {
          currentSet.add(t.subject.trim());
          hasNew = true;
        }
      });
      if (hasNew) {
        const updated = Array.from(currentSet);
        setCustomSubjects(updated);
        localStorage.setItem(STORAGE_CUSTOM_SUBJECTS, JSON.stringify(updated));
      }
    } catch {}
  }, [timetable, customSubjects]);

  const saveSubjects = (newList: string[]) => {
    setCustomSubjects(newList);
    localStorage.setItem(STORAGE_CUSTOM_SUBJECTS, JSON.stringify(newList));
    try {
      const deletedRaw = localStorage.getItem(STORAGE_DELETED_SUBJECTS);
      const deleted = deletedRaw ? JSON.parse(deletedRaw) : [];
      saveCustomSubjectsToFirestore(newList, deleted).catch(() => {});
    } catch {}
  };

  // استخراج الفصول من الجدول (32 فصلاً: 5/1 - 8/7)
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach((t) => {
      if (t.gradeClass && t.gradeClass.trim()) set.add(t.gradeClass.trim());
    });
    const list = Array.from(set);
    return list.length > 0 ? list : INITIAL_CLASSES;
  }, [timetable]);

  // الحصص التدريسية المعتمدة المأخوذة من إعدادات المواقيت
  const teachingPeriods = useMemo((): Period[] => {
    const list = periods.filter((p: Period) => !p.isBreak && /^p[1-8]$/.test(p.id));
    if (list.length > 0) {
      return list;
    }
    return INITIAL_PERIODS.filter((p: Period) => !p.isBreak && /^p[1-8]$/.test(p.id));
  }, [periods]);

  // حقول نموذج الإدخال السريع
  const [subDay, setSubDay] = useState<string>('الأحد');
  const [period, setPeriod] = useState(teachingPeriods[0]?.id || 'p1');
  const [gradeClass, setGradeClass] = useState(availableClasses[0] || '5/1');
  const [absentTeacher, setAbsentTeacher] = useState('');
  const [substituteTeacher, setSubstituteTeacher] = useState('');
  const [subject, setSubject] = useState(customSubjects[0] || 'رياضيات');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<SubstitutionStatus>('مؤكد');

  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [showTeachersModal, setShowTeachersModal] = useState(false);
  const [showPrintReportModal, setShowPrintReportModal] = useState(false);
  const [printReportMode, setPrintReportMode] = useState<'full' | 'assistant'>('full');
  const [selectedQrSub, setSelectedQrSub] = useState<Substitution | null>(null);
  const [showFemaleTeachersManager, setShowFemaleTeachersManager] = useState(false);
  const [femaleTeacherSearch, setFemaleTeacherSearch] = useState('');
  const [femaleTeachers, setFemaleTeachers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FEMALE_TEACHERS);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((name) => typeof name === 'string' && name.trim()) : [];
    } catch {
      return [];
    }
  });
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [editingSubject, setEditingSubject] = useState<{ oldName: string; newName: string } | null>(null);

  const saveFemaleTeachers = (names: string[]) => {
    const uniqueNames = Array.from(new Set(names.map((name) => name.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'ar'));
    setFemaleTeachers(uniqueNames);
    localStorage.setItem(STORAGE_FEMALE_TEACHERS, JSON.stringify(uniqueNames));
    saveFemaleTeachersToFirestore(uniqueNames).catch(() => {});
    try {
      window.dispatchEvent(new CustomEvent('school_signage_female_teachers_updated', { detail: uniqueNames }));
    } catch {}
  };

  const toggleFemaleTeacher = (teacherName: string) => {
    saveFemaleTeachers(
      femaleTeachers.includes(teacherName)
        ? femaleTeachers.filter((name) => name !== teacherName)
        : [...femaleTeachers, teacherName]
    );
  };

  const filteredTeachersForFemaleManager = extractedTeachers.filter((teacherName) =>
    normalizeArabicText(teacherName).includes(normalizeArabicText(femaleTeacherSearch))
  );

  const openPrintReport = (mode: 'full' | 'assistant') => {
    if (mode === 'assistant' && femaleTeachers.length === 0) {
      setShowFemaleTeachersManager(true);
      return;
    }
    setPrintReportMode(mode);
    setShowPrintReportModal(true);
  };


  // معرف الحصة الحالية (p1 إلى p8)
  const currentPeriodId = useMemo(() => normalizePeriodId(period), [period]);
  const currentPeriodName = useMemo(() => teachingPeriods.find((p) => p.id === currentPeriodId)?.name || `الحصة ${currentPeriodId.replace('p', '')}`, [teachingPeriods, currentPeriodId]);

  // فحص الجدول للحصة والصف واليوم المحددين لاقتراح المعلم والمادة تلقائياً
  const scheduledMatch = useMemo(() => {
    return timetable.find(
      (t) =>
        t.day === subDay &&
        String(t.periodId).trim().toLowerCase() === currentPeriodId &&
        t.gradeClass === gradeClass
    );
  }, [timetable, subDay, currentPeriodId, gradeClass]);

  // تعبئة تلقائية لبيانات الحصة عند الضغط على زر الاقتراح
  const handleApplyScheduleMatch = () => {
    if (scheduledMatch) {
      if (scheduledMatch.teacher && !scheduledMatch.teacher.includes('شاغر')) {
        setAbsentTeacher(scheduledMatch.teacher.trim());
      }
      if (scheduledMatch.subject) {
        const foundSubj = customSubjects.find((s) => isSubjectMatch(s, scheduledMatch.subject));
        setSubject(foundSubj || scheduledMatch.subject.trim());
      }
    }
  };

  // =========================================================================
  // المحرك الذكي: فحص احتياط معلمي نفس المادة (المتاحين / الفاضيين في هذه الحصة)
  // =========================================================================
  const sameSubjectAnalysis = useMemo(() => {
    if (!subject || !subject.trim()) {
      return { sameSubjectTeachers: [], freeTeachers: [], busyTeachers: [], totalFreeCount: 0 };
    }

    // 1. استخراج كافة المعلمين الذين يدرسون هذه المادة في المدرسة (عبر دليل المعلمين المعتمد وجدول الحصص)
    const teachersOfSubject = new Set<string>();

    // البحث في دليل المعلمين الموزع حسب المواد
    const matchedKeys = Object.keys(teachersBySubjectMap).filter((subjectKey) =>
      isSubstitutionSubjectMatch(subjectKey, subject)
    );
    matchedKeys.forEach((subjectKey) => {
      (teachersBySubjectMap[subjectKey] || []).forEach((teacherName) => teachersOfSubject.add(teacherName));
    });

    // ومسح جدول الحصص الفعلي أيضاً لضم أي معلمين يدرسون هذه المادة
    timetable.forEach((item) => {
      if (
        item.subject &&
        isSubstitutionSubjectMatch(item.subject, subject) &&
        item.teacher &&
        !item.teacher.includes('شاغر')
      ) {
        teachersOfSubject.add(item.teacher.trim());
      }
    });

    const sameSubjectTeachersList = Array.from(teachersOfSubject);

    // 2. فحص جدول كل معلم في نفس اليوم والحصة المحددة لمعرفة الفاضيين والمشغولين
    const freeTeachers: { name: string }[] = [];
    const busyTeachers: { name: string; busyWith: string }[] = [];

    sameSubjectTeachersList.forEach((teacherName) => {
      // استثناء المعلم الغائب نفسه إذا تم تحديده
      if (absentTeacher.trim() && isSameTeacher(teacherName, absentTeacher)) {
        return;
      }

      // البحث هل المعلم لديه حصة في نفس اليوم ونفس الحصة
      const busyLesson = timetable.find(
        (t) =>
          t.day === subDay &&
          String(t.periodId).trim().toLowerCase() === currentPeriodId &&
          isSameTeacher(t.teacher, teacherName)
      );

      if (busyLesson) {
        busyTeachers.push({
          name: teacherName,
          busyWith: `عنده حصة في فصل ${busyLesson.gradeClass}`,
        });
      } else {
        freeTeachers.push({
          name: teacherName,
        });
      }
    });

    return {
      sameSubjectTeachers: sameSubjectTeachersList,
      freeTeachers,
      busyTeachers,
      totalFreeCount: freeTeachers.length,
    };
  }, [timetable, subject, subDay, currentPeriodId, absentTeacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!period || !gradeClass || !absentTeacher.trim() || !substituteTeacher.trim()) {
      alert('يرجى اختيار مادة الحصة والمعلم الغائب والمعلم البديل والصف');
      return;
    }

    if (!scheduledMatch) { alert('لا توجد حصة أصلية مطابقة لليوم والحصة والفصل'); return; }
    if (!isSameTeacher(scheduledMatch.teacher, absentTeacher)) {
      alert(`المعلم الغائب لا يطابق الجدول. المعلم المسجل هو: ${scheduledMatch.teacher}`); return;
    }
    const substituteConflict = timetable.find((t) => t.day === subDay && String(t.periodId).trim().toLowerCase() === currentPeriodId && isSameTeacher(t.teacher, substituteTeacher) && t.gradeClass !== gradeClass);
    if (substituteConflict) { alert(`المعلم البديل لديه حصة متزامنة في الفصل ${substituteConflict.gradeClass}`); return; }
    const isSameSubject = sameSubjectAnalysis.sameSubjectTeachers.some(
      (st) => isSameTeacher(st, substituteTeacher)
    );

    await onAddSubstitution({
      date: new Date().toISOString().split('T')[0],
      day: subDay,
      period: currentPeriodId,
      gradeClass,
      absentTeacher: canonicalTeacherName(absentTeacher),
      substituteTeacher: canonicalTeacherName(substituteTeacher),
      subject: subject.trim() || 'حصة احتياط',
      status,
      notes: notes.trim()
        ? notes.trim()
        : isSameSubject
        ? isIndividualSkillsSubject(subject)
          ? `احتياط مجموعة المهارات الفردية - الحصة الأصلية (${subject.trim()})`
          : `احتياط تخصص (${subject.trim()})`
        : undefined,
      updatedAt: new Date().toISOString(),
    });

    setNotes('');
    setAbsentTeacher('');
    setSubstituteTeacher('');
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 4000);
  };

  // =========================================================================
  // نظام توزيع حصص المعلم الغائب دفعة واحدة (الوضع الأساسي المعتمد في المدارس)
  // =========================================================================
  const [distributionMode, setDistributionMode] = useState<'batch' | 'single'>('batch');
  const [batchDay, setBatchDay] = useState<string>('الأحد');
  const [batchSubjectFilter, setBatchSubjectFilter] = useState<string>('all');
  const [batchAbsentTeacher, setBatchAbsentTeacher] = useState<string>('');
  const [batchSuccessMsg, setBatchSuccessMsg] = useState<string | null>(null);

  interface BatchLessonRow {
    timetableId: string;
    periodId: string;
    periodName: string;
    gradeClass: string;
    subject: string;
    room?: string;
    substituteTeacher: string;
    notes: string;
    status: SubstitutionStatus;
    included: boolean;
  }

  const [batchLessons, setBatchLessons] = useState<BatchLessonRow[]>([]);
  const batchDraftDirtyRef = useRef(false);
  const batchDraftStorageKey = useMemo(
    () => `school_signage_substitution_draft:${normalizeDayName(batchDay)}:${normalizeArabicText(canonicalTeacherName(batchAbsentTeacher))}`,
    [batchDay, batchAbsentTeacher]
  );


  // استخراج حصص المعلم الغائب المقررة لليوم المحدد من جدول المدرسة مع منع أي تكرار
  const absentTeacherScheduledLessons = useMemo(() => {
    if (!batchAbsentTeacher.trim() || !batchDay) return [];
    const targetDay = normalizeDayName(batchDay);
    const list = timetable.filter(
      (t) => normalizeDayName(t.day) === targetDay && isSameTeacher(t.teacher, batchAbsentTeacher)
    );
    // ضمان عدم تكرار الحصة لنفس الفترة والصف
    const uniqueSlots = new Map<string, ClassScheduleItem>();
    list.forEach((item) => {
      const slotKey = `${normalizePeriodId(item.periodId)}:::${normalizeClassName(item.gradeClass)}`;
      if (!uniqueSlots.has(slotKey)) {
        uniqueSlots.set(slotKey, item);
      }
    });
    return Array.from(uniqueSlots.values()).sort((a, b) =>
      String(a.periodId).localeCompare(String(b.periodId), undefined, { numeric: true })
    );
  }, [timetable, batchAbsentTeacher, batchDay]);

  // مرجع لتتبع المعلم واليوم المختارين لمنع مسح اختيارات البدلاء عند التحديث الدوري في الخلفية
  const lastBatchSelectionKeyRef = useRef<string>('');

  // ترقية الاسم القديم المحفوظ إلى الاسم المعتمد في الجدول المصحح.
  useEffect(() => {
    if (!batchAbsentTeacher.trim()) return;
    const canonicalSelectedName = canonicalTeacherName(batchAbsentTeacher);
    const matchingTeacher = extractedTeachers.find((teacherName) =>
      isSameTeacher(teacherName, canonicalSelectedName)
    );
    if (matchingTeacher && matchingTeacher !== batchAbsentTeacher) {
      setBatchAbsentTeacher(matchingTeacher);
    }
  }, [batchAbsentTeacher, extractedTeachers]);

  // تحديث الحصص مع الحفاظ على مسودة المستخدم حتى مع التحديث الدوري للخلفية.
  useEffect(() => {
    const currentKey = `${normalizeDayName(batchDay)}:::${canonicalTeacherName(batchAbsentTeacher)}`;
    const isNewSelection = lastBatchSelectionKeyRef.current !== currentKey;
    lastBatchSelectionKeyRef.current = currentKey;

    if (!batchAbsentTeacher.trim() || !batchDay) {
      setBatchLessons([]);
      batchDraftDirtyRef.current = false;
      return;
    }

    let storedDraft: BatchLessonRow[] = [];
    try {
      const raw = localStorage.getItem(batchDraftStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      storedDraft = Array.isArray(parsed) ? parsed : [];
    } catch {}

    setBatchLessons((previousRows) => {
      const sourceRows = isNewSelection ? storedDraft : previousRows;
      const previousByKey = new Map(
        sourceRows.map((row) => [
          `${normalizePeriodId(row.periodId)}:::${normalizeClassName(row.gradeClass)}`,
          row,
        ])
      );

      if (absentTeacherScheduledLessons.length === 0) return [];

      return absentTeacherScheduledLessons.map((item) => {
        const rowKey = `${normalizePeriodId(item.periodId)}:::${normalizeClassName(item.gradeClass)}`;
        const existing = previousByKey.get(rowKey);
        const periodObj =
          periods.find((p) => normalizePeriodId(p.id) === normalizePeriodId(item.periodId)) ||
          teachingPeriods.find((p) => normalizePeriodId(p.id) === normalizePeriodId(item.periodId));

        return {
          timetableId: item.id,
          periodId: normalizePeriodId(item.periodId),
          periodName: periodObj?.name || `الحصة ${normalizePeriodId(item.periodId).replace('p', '')}`,
          gradeClass: normalizeClassName(item.gradeClass),
          subject: item.subject || 'حصة احتياط',
          room: item.room || '',
          substituteTeacher: existing?.substituteTeacher || '',
          notes: existing?.notes || '',
          status: existing?.status || 'مؤكد',
          included: existing?.included ?? true,
        };
      });
    });
  }, [absentTeacherScheduledLessons, periods, teachingPeriods, batchDay, batchAbsentTeacher, batchDraftStorageKey]);

  // حفظ المسودة محليًا فور كل اختيار، فلا تفقدها المزامنة الخلفية أو إعادة الرسم.
  useEffect(() => {
    if (!batchAbsentTeacher.trim() || batchLessons.length === 0) return;
    try {
      localStorage.setItem(batchDraftStorageKey, JSON.stringify(batchLessons));
    } catch {}
  }, [batchLessons, batchAbsentTeacher, batchDraftStorageKey]);

  // فحص المتاحين والمشغولين من معلمي نفس المادة لكل حصة بعينها
  const getPeriodTeachersStatus = useCallback(
    (rowSubject: string, periodId: string) => {
      const normPeriod = normalizePeriodId(periodId);
      const teachersOfSubject = new Set<string>();

      const matchedKeys = Object.keys(teachersBySubjectMap).filter((subjectKey) =>
        isSubstitutionSubjectMatch(subjectKey, rowSubject)
      );
      matchedKeys.forEach((subjectKey) => {
        (teachersBySubjectMap[subjectKey] || []).forEach((teacherName) => teachersOfSubject.add(teacherName));
      });

      timetable.forEach((item) => {
        if (
          item.subject &&
          isSubstitutionSubjectMatch(item.subject, rowSubject) &&
          item.teacher &&
          !item.teacher.includes('شاغر')
        ) {
          teachersOfSubject.add(item.teacher.trim());
        }
      });

      const subjectTeachersList = Array.from(teachersOfSubject);

      const freeSubjectTeachers: string[] = [];
      const busySubjectTeachers: { name: string; busyWith: string }[] = [];

      const targetDay = normalizeDayName(batchDay);
      subjectTeachersList.forEach((teacherName) => {
        if (
          batchAbsentTeacher.trim() &&
          isSameTeacher(teacherName, batchAbsentTeacher)
        ) {
          return;
        }

        const busyLesson = timetable.find(
          (t) =>
            normalizeDayName(t.day) === targetDay &&
            normalizePeriodId(t.periodId) === normPeriod &&
            isSameTeacher(t.teacher, teacherName)
        );

        if (busyLesson) {
          busySubjectTeachers.push({
            name: teacherName,
            busyWith: `عنده حصة في ${busyLesson.gradeClass}`,
          });
        } else {
          freeSubjectTeachers.push(teacherName);
        }
      });

      // بقية معلمي المدرسة المتاحين في نفس الحصة
      const allOtherFreeTeachers: string[] = [];
      extractedTeachers.forEach((teacherName) => {
        if (subjectTeachersList.includes(teacherName)) return;
        if (
          batchAbsentTeacher.trim() &&
          isSameTeacher(teacherName, batchAbsentTeacher)
        ) {
          return;
        }

        const isBusy = timetable.some(
          (t) =>
            normalizeDayName(t.day) === targetDay &&
            normalizePeriodId(t.periodId) === normPeriod &&
            isSameTeacher(t.teacher, teacherName)
        );

        if (!isBusy) {
          allOtherFreeTeachers.push(teacherName);
        }
      });

      return {
        freeSubjectTeachers,
        busySubjectTeachers,
        allOtherFreeTeachers,
      };
    },
    [teachersBySubjectMap, timetable, batchDay, batchAbsentTeacher, extractedTeachers]
  );

  // تحديث بيانات حصة معينة في التوزيع الجماعي
  const handleUpdateBatchLesson = (index: number, field: keyof BatchLessonRow, value: unknown) => {
    batchDraftDirtyRef.current = true;
    setBatchLessons((previousRows) =>
      previousRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  // توزيع ذكي مقترح تلقائياً لمعلمي المادة المتاحين
  const handleAutoSuggestAllSubstitutes = () => {
    const assignedCounts: Record<string, number> = {};
    setBatchLessons((prev) =>
      prev.map((lesson) => {
        if (!lesson.included || lesson.substituteTeacher.trim()) {
          if (lesson.substituteTeacher.trim()) {
            assignedCounts[lesson.substituteTeacher] = (assignedCounts[lesson.substituteTeacher] || 0) + 1;
          }
          return lesson;
        }

        const status = getPeriodTeachersStatus(lesson.subject, lesson.periodId);
        const sortedFree = [...status.freeSubjectTeachers].sort(
          (a, b) => (assignedCounts[a] || 0) - (assignedCounts[b] || 0)
        );

        let chosen = sortedFree[0];
        if (!chosen && status.allOtherFreeTeachers.length > 0) {
          const sortedOther = [...status.allOtherFreeTeachers].sort(
            (a, b) => (assignedCounts[a] || 0) - (assignedCounts[b] || 0)
          );
          chosen = sortedOther[0];
        }

        if (chosen) {
          assignedCounts[chosen] = (assignedCounts[chosen] || 0) + 1;
        }

        return {
          ...lesson,
          substituteTeacher: chosen || '',
        };
      })
    );
  };

  // حفظ وتوزيع كافة حصص الاحتياط للمعلم الغائب دفعة واحدة
  const handleSaveBatchSubstitutions = async () => {
    const includedRows = batchLessons.filter((l) => l.included);
    if (includedRows.length === 0) {
      alert('يرجى اختيار وتضمين حصة واحدة على الأقل');
      return;
    }

    const missingSub = includedRows.find((l) => !l.substituteTeacher.trim());
    if (missingSub) {
      alert(`يرجى تحديد المعلم البديل لـ (${missingSub.periodName}) في فصل (${missingSub.gradeClass})`);
      return;
    }

    const targetDay = normalizeDayName(batchDay);
    const busySelection = includedRows.find((row) =>
      timetable.some((t) =>
        normalizeDayName(t.day) === targetDay &&
        normalizePeriodId(t.periodId) === normalizePeriodId(row.periodId) &&
        isSameTeacher(t.teacher, row.substituteTeacher) &&
        normalizeClassName(t.gradeClass) !== normalizeClassName(row.gradeClass)
      )
    );
    if (busySelection) { alert(`المعلم البديل المحدد لـ ${busySelection.periodName} لديه حصة أصلية متزامنة`); return; }
    const itemsToSave: Omit<Substitution, 'id'>[] = includedRows.map((r) => ({
      date: new Date().toISOString().split('T')[0],
      day: targetDay,
      period: normalizePeriodId(r.periodId),
      gradeClass: normalizeClassName(r.gradeClass),
      absentTeacher: canonicalTeacherName(batchAbsentTeacher),
      substituteTeacher: canonicalTeacherName(r.substituteTeacher),
      subject: r.subject.trim() || 'حصة احتياط',
      status: r.status,
      notes: r.notes.trim()
        ? r.notes.trim()
        : isIndividualSkillsSubject(r.subject)
        ? `احتياط مجموعة المهارات الفردية - الحصة الأصلية (${r.subject.trim()})`
        : `احتياط (${r.subject.trim()})`,
      updatedAt: new Date().toISOString(),
    }));

    if (onBulkAddSubstitutions) {
      await onBulkAddSubstitutions(itemsToSave);
    } else {
      for (const item of itemsToSave) {
        await onAddSubstitution(item);
      }
    }

    const savedTeacherName = batchAbsentTeacher;
    batchDraftDirtyRef.current = false;
    try { localStorage.removeItem(batchDraftStorageKey); } catch {}
    setBatchSuccessMsg(`تم بنجاح حفظ وتوزيع عدد (${itemsToSave.length}) حصص احتياط للمعلم الغائب (${savedTeacherName})! انعكس ذلك فوراً على شاشات العرض.`);
    setBatchAbsentTeacher('');
    setBatchLessons([]);
    setTimeout(() => setBatchSuccessMsg(null), 7000);
  };

  // استخراج قائمة المعلمين بحسب مادة الفلتر المحددة مع عدد حصصهم في اليوم المحدد
  const filteredTeachersForBatch = useMemo(() => {
    let teachersList = extractedTeachers;
    if (batchSubjectFilter !== 'all') {
      const teachersOfSubj = new Set<string>();
      const matchedKeys = Object.keys(teachersBySubjectMap).filter((subjectKey) =>
        isSubstitutionSubjectMatch(subjectKey, batchSubjectFilter)
      );
      matchedKeys.forEach((subjectKey) => {
        (teachersBySubjectMap[subjectKey] || []).forEach((teacherName) => teachersOfSubj.add(teacherName));
      });
      timetable.forEach((item) => {
        if (item.subject && isSubstitutionSubjectMatch(item.subject, batchSubjectFilter) && item.teacher && !item.teacher.includes('شاغر')) {
          teachersOfSubj.add(item.teacher.trim());
        }
      });
      teachersList = Array.from(teachersOfSubj).sort((a, b) => a.localeCompare(b, 'ar'));
    }

    const targetDay = normalizeDayName(batchDay);
    return teachersList.map((tName) => {
      const count = timetable.filter(
        (item) => normalizeDayName(item.day) === targetDay && isSameTeacher(item.teacher, tName)
      ).length;
      return {
        name: tName,
        lessonCount: count,
      };
    }).sort((a, b) => b.lessonCount - a.lessonCount || a.name.localeCompare(b.name, 'ar'));
  }, [extractedTeachers, batchSubjectFilter, teachersBySubjectMap, timetable, batchDay]);

  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // إضافة مادة جديدة للقائمة المعتمدة
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubjectInput.trim();
    if (!trimmed) return;

    // إذا كانت المادة مسجلة كمحذوفة، نقوم بإزالتها من المحذوفات لأن المستخدم طلب إضافتها مجدداً
    try {
      const deletedRaw = localStorage.getItem(STORAGE_DELETED_SUBJECTS);
      if (deletedRaw) {
        const deletedSet = new Set<string>(JSON.parse(deletedRaw));
        deletedSet.delete(trimmed);
        localStorage.setItem(STORAGE_DELETED_SUBJECTS, JSON.stringify(Array.from(deletedSet)));
      }
    } catch {}

    if (!customSubjects.includes(trimmed)) {
      const updated = [...customSubjects, trimmed];
      saveSubjects(updated);
      setSubject(trimmed);
    } else {
      setSubject(trimmed);
    }
    setNewSubjectInput('');
    setShowSubjectManager(false);
  };

  // تعديل اسم مادة
  const handleSaveEditSubject = () => {
    if (!editingSubject || !editingSubject.newName.trim()) return;
    const updated = customSubjects.map((s) =>
      s === editingSubject.oldName ? editingSubject.newName.trim() : s
    );
    saveSubjects(updated);
    if (subject === editingSubject.oldName) {
      setSubject(editingSubject.newName.trim());
    }
    setEditingSubject(null);
  };

  // حذف مادة وضمان عدم عودتها إطلاقاً
  const handleDeleteSubject = (subjToDelete: string) => {
    const trimmed = subjToDelete.trim();

    // 1. تسجيلها في قائمة المواد المحذوفة الدائمة حتى لا يعيدها أي فحص للجدول
    try {
      const deletedRaw = localStorage.getItem(STORAGE_DELETED_SUBJECTS);
      const deletedSet = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);
      deletedSet.add(trimmed);
      localStorage.setItem(STORAGE_DELETED_SUBJECTS, JSON.stringify(Array.from(deletedSet)));
    } catch {}

    // 2. إزالتها وتحديث قائمة المواد المعتمدة
    const updated = customSubjects.filter((s) => s.trim() !== trimmed);
    saveSubjects(updated);
    if (subject === trimmed) {
      setSubject(updated[0] || 'رياضيات');
    }
  };

  const filteredSubstitutions = substitutions.filter((s) => {
    if (filterPeriod === 'all') return true;
    return normalizePeriodId(s.period) === normalizePeriodId(filterPeriod);
  });

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden space-y-6">
      {/* داتاليست لاقتراحات أسماء المعلمين المستخرجة من جدول الإكسل */}
      <datalist id="teachers-extracted-list">
        {extractedTeachers.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      {/* داتاليست خاص فقط بمعلمي المادة المحددة لاختيار المعلم البديل (احتياط مواد) */}
      <datalist id="subject-substitute-teachers-list">
        {sameSubjectAnalysis.freeTeachers.map((t) => (
          <option key={`free-${t.name}`} value={t.name} label={`فاضي في ${period}`} />
        ))}
        {sameSubjectAnalysis.busyTeachers.map((t) => (
          <option key={`busy-${t.name}`} value={t.name} label={`مشغول (${t.busyWith})`} />
        ))}
      </datalist>

      {/* 1. نموذج الإدخال الذكي لاحتياط مواد معلمي نفس المادة */}
      <div className="w-full max-w-full min-w-0 overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-3 sm:p-5 md:p-7 shadow-xs">
        {/* قسم الترويسة والشرح التوضيحي ثابت في الأعلى بالكامل ولا يتأثر بتغيير مقاس الشاشة */}
        <div className="w-full min-w-0 mb-6 pb-5 border-b border-slate-100 space-y-4">
          {/* عنوان الصفحة والشرح - يمتد بالعرض الكامل دائماً */}
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 font-['Cairo']">
                تسجيل تكليف احتياط جديد (نفس المادة أو مجموعة المهارات الفردية)
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>إظهار فوري لمعلمي المادة الفاضيين في الحصة</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-4xl">
              اختر مادة الحصة ليظهر معلمو المادة الفاضيون، وإذا كانت الحصة من المهارات الفردية فسيظهر جميع معلمي الموسيقى والبدنية والفنون وتقنية المعلومات ضمن خيارات البدلاء
            </p>
          </div>

          {/* أزرار العمليات السريعة مصفوفة بانتظام تحت الشرح تماماً كالصورة المرفقة */}
          <div className="w-full min-w-0 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => openPrintReport('full')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-xs active:scale-95 cursor-pointer"
              title="طباعة كشاف الاحتياط الكامل"
            >
              <Printer className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="truncate">كشاف المدير (طباعة A4)</span>
            </button>
            <button
              type="button"
              onClick={() => openPrintReport('assistant')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition shadow-xs active:scale-95 cursor-pointer"
              title="طباعة نسخة المديرة المساعدة للمعلمات"
            >
              <Printer className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="truncate">نسخة المديرة المساعدة</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFemaleTeachersManager(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold transition cursor-pointer"
              title="إدارة قائمة المعلمات المعتمدة للتقرير"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">إدارة المعلمات ({femaleTeachers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowTeachersModal(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
              title="دليل المعلمين وتوزيعهم حسب المواد الدراسية"
            >
              <Users className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">دليل المعلمين حسب المواد</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSubjectManager(!showSubjectManager)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">إدارة وتعديل المواد ({customSubjects.length})</span>
            </button>
            {substitutions.length > 0 && onClearAllSubstitutions && (
              confirmClearAll ? (
                <div className="col-span-2 sm:col-span-3 xl:col-span-1 w-full min-w-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-rose-50 border border-rose-300 p-2 rounded-xl shadow-xs animate-in fade-in duration-200">
                  <span className="min-w-0 text-xs text-rose-700 font-bold px-1 break-words">
                    تأكيد مسح كافة سجلات الاحتياط ({substitutions.length})؟
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await onClearAllSubstitutions();
                      setConfirmClearAll(false);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black transition shadow"
                  >
                    نعم، مسح الكل الآن
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(false)}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs transition"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
                  title="مسح كافة سجلات الاحتياط المسجلة"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">مسح الكل ({substitutions.length})</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* نافذة / لوحة إدارة وتعديل المواد الدراسية */}
        {showSubjectManager && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-indigo-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">إدارة وتعديل المواد الدراسية المعتمدة في المدرسة</h3>
              </div>
              <button
                onClick={() => setShowSubjectManager(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* نموذج إضافة مادة جديدة */}
            <form onSubmit={handleAddSubject} className="w-full min-w-0 flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                placeholder="اكتب اسم المادة الدراسية الجديدة (مثال: رياضيات، علوم، لغة عربية، دراسات إسلامية...)"
                className="w-full min-w-0 flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة للمواد المعتمدة</span>
              </button>
            </form>

            {/* قائمة المواد القابلة للتعديل والحذف */}
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
              {customSubjects.map((subj) => (
                <div
                  key={subj}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-xs"
                >
                  {editingSubject?.oldName === subj ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editingSubject.newName}
                        onChange={(e) =>
                          setEditingSubject({ ...editingSubject, newName: e.target.value })
                        }
                        className="bg-white border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-slate-800"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEditSubject}
                        className="text-emerald-600 hover:text-emerald-700 font-bold px-1"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingSubject(null)}
                        className="text-slate-400 hover:text-slate-600 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{subj}</span>
                      <button
                        type="button"
                        onClick={() => setEditingSubject({ oldName: subj, newName: subj })}
                        className="text-slate-400 hover:text-indigo-600 p-0.5"
                        title="تعديل اسم المادة"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubject(subj)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="حذف المادة"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {batchSuccessMsg && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-900 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">{batchSuccessMsg}</span>
            </div>
            <button onClick={() => setBatchSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {showAddSuccess && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>تم تسجيل وإرسال بيانات الاحتياط بنجاح! سيظهر فوراً على الشاشة الذكية.</span>
            </div>
            <button onClick={() => setShowAddSuccess(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* شريط التبديل بين نمط التوزيع الشامل لحصص المعلم الغائب دفعة واحدة ونمط الحصة المفردة */}
        <div className="w-full min-w-0 grid grid-cols-1 sm:grid-cols-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1.5 mb-6">
          <button
            type="button"
            onClick={() => setDistributionMode('batch')}
            className={`w-full min-w-0 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-center leading-tight break-words text-xs md:text-sm font-black transition ${
              distributionMode === 'batch'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>توزيع حصص المعلم الغائب (توزيع شامل دفعة واحدة)</span>
          </button>
          <button
            type="button"
            onClick={() => setDistributionMode('single')}
            className={`w-full min-w-0 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-center leading-tight break-words text-xs md:text-sm font-bold transition ${
              distributionMode === 'single'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-200/60'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حصة مفردة (سريع)</span>
          </button>
        </div>

        {distributionMode === 'batch' ? (
          <div className="space-y-5">
            {/* الخطوة 1: اختيار اليوم والمادة والمعلم الغائب */}
            <div className="p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. اختيار اليوم */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    اليوم الدراسي:
                  </label>
                  <select
                    value={batchDay}
                    onChange={(e) => setBatchDay(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-bold focus:outline-none focus:border-blue-500 shadow-2xs"
                  >
                    {SCHOOL_WEEK_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. تصفية بحسب المادة */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    تصفية المعلمين حسب المادة:
                  </label>
                  <select
                    value={batchSubjectFilter}
                    onChange={(e) => setBatchSubjectFilter(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 shadow-2xs"
                  >
                    <option value="all">كافة المواد الدراسية (جميع المعلمين)</option>
                    {customSubjects.map((s) => (
                      <option key={s} value={s}>
                        مادة: {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. اختيار المعلم الغائب */}
                <div>
                  <label className="block text-xs font-bold text-rose-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-rose-600" />
                      المعلم الغائب:
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      ({filteredTeachersForBatch.length} معلم)
                    </span>
                  </label>
                  <select
                    value={batchAbsentTeacher}
                    onChange={(e) => setBatchAbsentTeacher(e.target.value)}
                    className="w-full bg-white border border-rose-300 rounded-xl px-3.5 py-2.5 text-sm text-rose-800 font-black focus:outline-none focus:border-rose-500 shadow-2xs"
                  >
                    <option value="">-- اختر المعلم الغائب ليوم ({batchDay}) --</option>
                    {filteredTeachersForBatch.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name} {t.lessonCount > 0 ? `(${t.lessonCount} حصص مجدولة اليوم)` : '(لا توجد حصص مجدولة)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* أزرار سريعة لاختيار المعلمين الذين لديهم حصص في هذا اليوم */}
              {filteredTeachersForBatch.filter((t) => t.lessonCount > 0).length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[11px] text-slate-600 font-bold">
                      اختيار سريع لمعلم غائب لديه حصص يوم {batchDay}:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {filteredTeachersForBatch
                      .filter((t) => t.lessonCount > 0)
                      .slice(0, 8)
                      .map((t) => {
                        const isSelected = batchAbsentTeacher === t.name;
                        return (
                          <button
                            key={t.name}
                            type="button"
                            onClick={() => setBatchAbsentTeacher(t.name)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                              isSelected
                                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200 hover:border-rose-300'
                            }`}
                          >
                            <span>{t.name}</span>
                            <span className={`mr-1 px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'}`}>
                              {t.lessonCount} حصص
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* الخطوة 2: عرض جميع حصص المعلم الغائب في هذا اليوم */}
            {!batchAbsentTeacher.trim() ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">
                  اختر المعلم الغائب من القائمة أعلاه
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  ستظهر لك فوراً جميع حصص المعلم المقررة ليوم ({batchDay}) لتوزيعها على المعلمين البدلاء وحفظها دفعة واحدة.
                </p>
              </div>
            ) : batchLessons.length === 0 ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl text-amber-900 text-center">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-1.5" />
                <h4 className="text-sm font-bold">
                  لا توجد حصص مجدولة للمعلم ({batchAbsentTeacher}) في جدول يوم ({batchDay})
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  المعلم ليس لديه حصص رسمية مسجلة في هذا اليوم. يمكنك التبديل إلى نمط "تسجيل حصة مفردة" لإدخال حصة يدوياً إذا رغبت.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* شريط الإحصائيات والإجراء الذكي */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 border border-indigo-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      {batchLessons.length}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 font-['Cairo']">
                        حصص المعلم ({batchAbsentTeacher}) المقررة ليوم {batchDay} ({batchLessons.length} حصص)
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        قم باختيار المعلم البديل لكل حصة أدناه ثم اضغط زر الحفظ الجماعي بالأسفل
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoSuggestAllSubstitutes}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95"
                      title="يوزع الحصص على معلمي المادة، أو على مجموعة المهارات الفردية عند انتماء الحصة إليها"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>توزيع مقترح تلقائي على معلمي المادة الفاضيين</span>
                    </button>
                  </div>
                </div>

                {/* بطاقات الحصص لتوزيع البدلاء */}
                <div className="space-y-3">
                  {batchLessons.map((lesson, idx) => {
                    const status = getPeriodTeachersStatus(lesson.subject, lesson.periodId);
                    return (
                      <div
                        key={lesson.timetableId || idx}
                        className={`p-4 rounded-2xl border transition-all ${
                          lesson.included
                            ? lesson.substituteTeacher.trim()
                              ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-200'
                              : 'bg-white border-slate-300 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                          {/* رقم الحصة والصف والمادة */}
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={lesson.included}
                                onChange={(e) => handleUpdateBatchLesson(idx, 'included', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-700">تضمين</span>
                            </label>

                            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                              {lesson.periodName}
                            </span>

                            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                              فصل {lesson.gradeClass}
                            </span>

                            {lesson.room && (
                              <span className="text-[11px] text-slate-500">
                                ({lesson.room})
                              </span>
                            )}

                            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              مادة: {lesson.subject}
                            </span>
                          </div>

                          {/* مؤشر توفر معلمي نفس المادة */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-emerald-600" />
                              <span>{status.freeSubjectTeachers.length} فاضيين من {isIndividualSkillsSubject(lesson.subject) ? 'مجموعة المهارات الفردية' : 'نفس المادة'}</span>
                            </span>
                          </div>
                        </div>

                        {/* اختيار المعلم البديل والملاحظات */}
                        {lesson.included && (
                          <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {/* اختيار المعلم البديل */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-emerald-700">
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  المعلم البديل المكلف بالحصة:
                                </span>
                                {lesson.substituteTeacher && (
                                  <span className="text-[10px] text-emerald-600 font-bold">
                                    ✓ تم الاختيار
                                  </span>
                                )}
                              </label>

                              <div className="flex gap-2">
                                <select
                                  value={lesson.substituteTeacher}
                                  onChange={(e) => handleUpdateBatchLesson(idx, 'substituteTeacher', e.target.value)}
                                  className="w-full min-w-0 flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-800 font-bold focus:outline-none focus:border-emerald-500 shadow-2xs"
                                >
                                  <option value="">-- اختر المعلم البديل لهذه الحصة --</option>
                                  {status.freeSubjectTeachers.length > 0 && (
                                    <optgroup label={`✓ ${getSubstitutionGroupLabel(lesson.subject)} - المتاحون في ${lesson.periodName}`}>
                                      {status.freeSubjectTeachers.map((t) => (
                                        <option key={t} value={t}>
                                          ✓ {t} (فاضي ومتاح)
                                        </option>
                                      ))}
                                    </optgroup>
                                  )}

                                  {status.busySubjectTeachers.length > 0 && (
                                    <optgroup label={`⚠️ ${getSubstitutionGroupLabel(lesson.subject)} - المشغولون بحصة رسمية`}>
                                      {status.busySubjectTeachers.map((t) => (
                                        <option key={t.name} value={t.name} disabled>
                                          ⚠️ {t.name} ({t.busyWith})
                                        </option>
                                      ))}
                                    </optgroup>
                                  )}

                                  {status.allOtherFreeTeachers.length > 0 && (
                                    <optgroup label={`بقية معلمي المدرسة المتاحون في ${lesson.periodName}`}>
                                      {status.allOtherFreeTeachers.map((t) => (
                                        <option key={t} value={t}>
                                          {t}
                                        </option>
                                      ))}
                                    </optgroup>
                                  )}
                                </select>
                              </div>

                              {/* أزرار سريعة لمعلمي نفس المادة المتاحين بنقرة واحدة */}
                              {status.freeSubjectTeachers.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                  <span className="text-[10px] text-slate-500">متاحون بنقرة:</span>
                                  {status.freeSubjectTeachers.slice(0, 4).map((ft) => (
                                    <button
                                      key={ft}
                                      type="button"
                                      onClick={() => handleUpdateBatchLesson(idx, 'substituteTeacher', ft)}
                                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                                        lesson.substituteTeacher === ft
                                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                      }`}
                                    >
                                      {ft}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* الملاحظات أو مهام الحصة */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                ملاحظات أو مهام الحصة (اختياري):
                              </label>
                              <input
                                type="text"
                                value={lesson.notes}
                                onChange={(e) => handleUpdateBatchLesson(idx, 'notes', e.target.value)}
                                placeholder="مثال: حل ورقة العمل 2، متابعة الكتاب ص 40..."
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* زر الحفظ الجماعي لكافة حصص المعلم الغائب دفعة واحدة */}
                <div className="pt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="text-xs text-slate-600">
                    عدد الحصص المشمولة بالتوزيع: <strong className="text-indigo-700 font-black">{batchLessons.filter((l) => l.included).length}</strong> من أصل {batchLessons.length} حصص
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveBatchSubstitutions}
                    disabled={isSubmitting || batchLessons.filter((l) => l.included).length === 0}
                    className="w-full sm:w-auto min-w-0 flex items-center justify-center gap-2 px-3 sm:px-6 py-3 text-center leading-tight break-words bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl text-sm shadow-md transition active:scale-95 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'جاري حفظ وتوزيع الحصص...'
                        : `حفظ وتوزيع كافة حصص الاحتياط للمعلم الغائب (${batchLessons.filter((l) => l.included).length} حصص) دفعة واحدة`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* اختيار اليوم */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                اليوم:
              </label>
              <select
                value={subDay}
                onChange={(e) => setSubDay(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition font-bold"
              >
                {SCHOOL_WEEK_DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* اختيار الحصة */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                الحصة الدراسية:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-bold"
              >
                {teachingPeriods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.startTime} - {p.endTime})
                  </option>
                ))}
              </select>
            </div>

            {/* الصف والفصل (5/1 إلى 8/7) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                الصف والفصل (32 فصلاً):
              </label>
              <div className="relative">
                <select
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-bold"
                >
                  <optgroup label="الصف 5 (من 1 إلى 8)">
                    {availableClasses.filter((c) => c.startsWith('5')).map((c) => (
                      <option key={c} value={c}>فصل {c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="الصف 6 (من 1 إلى 9)">
                    {availableClasses.filter((c) => c.startsWith('6')).map((c) => (
                      <option key={c} value={c}>فصل {c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="الصف 7 (من 1 إلى 8)">
                    {availableClasses.filter((c) => c.startsWith('7')).map((c) => (
                      <option key={c} value={c}>فصل {c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="الصف 8 (من 1 إلى 7)">
                    {availableClasses.filter((c) => c.startsWith('8')).map((c) => (
                      <option key={c} value={c}>فصل {c}</option>
                    ))}
                  </optgroup>
                  {availableClasses.filter((c) => !c.match(/^[5-8]\//)).length > 0 && (
                    <optgroup label="فصول أخرى">
                      {availableClasses.filter((c) => !c.match(/^[5-8]\//)).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>

            {/* المادة الدراسية */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  مادة الحصة (قائمة منسدلة):
                </label>
                <button
                  type="button"
                  onClick={() => setShowSubjectManager(true)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 font-bold"
                  title="إضافة مادة جديدة للقائمة"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة مادة</span>
                </button>
              </div>
              <div className="relative">
                <select
                  value={subject}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setShowSubjectManager(true);
                    } else {
                      setSubject(e.target.value);
                      setSubstituteTeacher('');
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="" disabled>-- اختر المادة من القائمة --</option>
                  {customSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="__add_new__" className="text-indigo-600 font-bold bg-indigo-50">
                    ➕ إضافة مادة جديدة إلى القائمة...
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* شريط الاكتشاف التلقائي لبيانات الحصة من الجدول المدرسي */}
          {scheduledMatch && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-700">
                  الحصة بالجدول المدرسي: <strong className="text-slate-900 font-bold">{scheduledMatch.subject}</strong> — المعلم الأساسي: <strong className="text-indigo-700 font-bold">{scheduledMatch.teacher}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyScheduleMatch}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3 h-3" />
                <span>تعبئة الغائب والمادة تلقائياً</span>
              </button>
            </div>
          )}

          <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* المعلم الغائب */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  المعلم الغائب:
                </label>
                <button
                  type="button"
                  onClick={() => setShowTeachersModal(true)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                >
                  <Users className="w-3 h-3" />
                  <span>دليل معلمي المواد</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="teachers-extracted-list"
                    value={absentTeacher}
                    onChange={(e) => setAbsentTeacher(e.target.value)}
                    placeholder="اكتب اسم المعلم أو اختر من القائمة..."
                    className="w-full min-w-0 flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-rose-700 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition font-bold"
                  />
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) setAbsentTeacher(e.target.value);
                    }}
                    className="w-32 bg-slate-100 border border-slate-300 rounded-xl px-2 text-xs text-slate-700 focus:outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="">قائمة سريعة</option>
                    {sameSubjectAnalysis.sameSubjectTeachers.length > 0 && (
                      <optgroup label={`معلمو مادة (${subject})`}>
                        {sameSubjectAnalysis.sameSubjectTeachers.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {Object.entries(teachersBySubjectMap).map(([subj, teachers]) => {
                      if (isSubstitutionSubjectMatch(subj, subject)) return null;
                      return (
                        <optgroup key={subj} label={`مادة: ${subj}`}>
                          {teachers.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>

                {/* أزرار سريعة لمعلمي نفس المادة */}
                {sameSubjectAnalysis.sameSubjectTeachers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[10px] text-slate-500">{getSubstitutionGroupLabel(subject)}:</span>
                    {sameSubjectAnalysis.sameSubjectTeachers.slice(0, 6).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAbsentTeacher(t)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                          absentTeacher === t
                            ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* المعلم البديل المكلف */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  المعلم البديل المكلف:
                </label>
                <span className="text-[10px] text-emerald-700 font-bold">
                  {sameSubjectAnalysis.freeTeachers.length} فاضيين من {isIndividualSkillsSubject(subject) ? 'مجموعة المهارات الفردية' : 'نفس المادة'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="subject-substitute-teachers-list"
                    value={substituteTeacher}
                    onChange={(e) => setSubstituteTeacher(e.target.value)}
                    placeholder="اختر معلم المادة من البطاقات أدناه أو القائمة..."
                    className="w-full min-w-0 flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-emerald-800 font-bold placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) setSubstituteTeacher(e.target.value);
                    }}
                    className="w-36 bg-slate-100 border border-slate-300 rounded-xl px-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="">{getSubstitutionGroupLabel(subject)}</option>
                    {sameSubjectAnalysis.freeTeachers.length > 0 && (
                      <optgroup label={`المتاحون من ${getSubstitutionGroupLabel(subject)} في ${period}`}>
                        {sameSubjectAnalysis.freeTeachers.map((t) => (
                          <option key={t.name} value={t.name}>
                            ✓ {t.name} (فاضي ومتاح)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {sameSubjectAnalysis.busyTeachers.length > 0 && (
                      <optgroup label={`المشغولون من ${getSubstitutionGroupLabel(subject)} في ${period}`}>
                        {sameSubjectAnalysis.busyTeachers.map((t) => (
                          <option key={t.name} value={t.name} disabled>
                            ⚠️ {t.name} ({t.busyWith})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* لوحة ظهور جميع معلمين المادة الفاضين في الحصة بعد اختيار المادة */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-slate-50 to-blue-50/70 border border-emerald-200/90 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-800 font-['Cairo'] flex items-center gap-2">
                  <span>{getSubstitutionGroupLabel(subject)} - الفاضيون في {period} ليوم {subDay}:</span>
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{sameSubjectAnalysis.freeTeachers.length} معلمين فاضيين (متاحين الآن)</span>
                </span>
              </div>
            </div>

            {isIndividualSkillsSubject(subject) && (
              <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-200 text-[11px] text-violet-800 font-bold leading-relaxed">
                الحصة الأصلية: {subject}. خيارات البديل تشمل جميع معلمي مجموعة المهارات الفردية: التربية الموسيقية، التربية البدنية، الفنون التشكيلية، وتقنية المعلومات، بشرط أن يكون المعلم فاضيًا في الحصة المحددة.
              </div>
            )}
            {/* عرض بطاقات جميع معلمي المادة الفاضيين */}
            {sameSubjectAnalysis.freeTeachers.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[11px] text-slate-600 block font-medium">
                  اضغط على أي معلم فاضي ليتم اختياره وتكليفه بالاحتياط فوراً بنقرة واحدة:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {sameSubjectAnalysis.freeTeachers.map((t) => {
                    const isChosen = substituteTeacher === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSubstituteTeacher(t.name)}
                        className={`p-3 rounded-2xl text-right transition border flex items-center justify-between gap-2 ${
                          isChosen
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border-emerald-200 hover:border-emerald-400 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isChosen ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-black text-xs block truncate">{t.name}</span>
                            <span className={`text-[10px] block ${isChosen ? 'text-emerald-100' : 'text-emerald-700 font-semibold'}`}>
                              فاضي في {period}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isChosen ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-700 text-[10px] font-bold text-white border border-emerald-400">
                              <Check className="w-3 h-3" />
                              <span>مكلف</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              اختيار
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : sameSubjectAnalysis.sameSubjectTeachers.length > 0 ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>كافة معلمي {getSubstitutionGroupLabel(subject)} المسجلين مشغولون بحصص دراسية في {period}:</span>
                </div>
                <p className="text-[11px] text-amber-800 pr-5 leading-relaxed">
                  جميع معلمي {getSubstitutionGroupLabel(subject)} البالغ عددهم ({sameSubjectAnalysis.sameSubjectTeachers.length}) لديهم حصص رسمية في {period} ليوم {subDay}.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs">
                <p className="font-bold text-slate-800">
                  ℹ️ لم يتم العثور بعد على معلمين مسجلين لمادة ({subject}) في جدول الحصص المرفوع.
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  يمكنك مراجعة دليل المعلمين وتوزيعهم حسب المواد أو كتابة اسم المعلم مباشرة.
                </p>
              </div>
            )}

            {/* عرض معلمي المادة المشغولين لمعرفة جداولهم مع إمكانية اختيارهم عند اللزوم */}
            {sameSubjectAnalysis.busyTeachers.length > 0 && (
              <div className="pt-2.5 border-t border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-600 font-bold block">
                    المشغولون من {getSubstitutionGroupLabel(subject)} في {period} ({sameSubjectAnalysis.busyTeachers.length} معلمين):
                  </span>
                  <span className="text-[10px] text-slate-400">
                    يمكن النقر على أي معلم لاختياره عند الحاجة
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sameSubjectAnalysis.busyTeachers.map((t) => {
                    const isChosen = substituteTeacher === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        disabled
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] cursor-not-allowed flex items-center gap-1.5 transition ${
                          isChosen
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                            : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-300 shadow-2xs'
                        }`}
                        title={`مشغول: ${t.busyWith}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isChosen ? 'bg-white' : 'bg-rose-500'}`} />
                        <span className="font-medium">{t.name}:</span>
                        <span className={`text-[10px] font-bold ${isChosen ? 'text-amber-100' : 'text-rose-600'}`}>{t.busyWith}</span>
                        {isChosen && <Check className="w-3 h-3 mr-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="w-full min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* حالة التكليف */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                حالة الاحتياط:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubstitutionStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              >
                <option value="مؤكد">مؤكد (تم التكليف والإبلاغ)</option>
                <option value="قيد الانتظار">قيد الانتظار (بانتظار التأكيد)</option>
                <option value="تم الحضور">تم الحضور (المعلم داخل الصف)</option>
              </select>
            </div>

            {/* ملاحظات إضافية */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات أو مهام الحصة (تظهر أسفل البطاقة):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: متابعة درس الرياضيات، حل ورقة العمل 3..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* زر الحفظ والإرسال */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-0 flex items-center justify-center gap-2 px-3 sm:px-6 py-3 text-center leading-tight break-words bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl text-sm shadow-md transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : 'اعتماد ونشر الاحتياط على الشاشة'}</span>
            </button>
          </div>
        </form>
        )}
      </div>

      {/* 2. جدول وسجلات الاحتياط المسجلة */}
      <div className="w-full max-w-full min-w-0 overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-3 sm:p-5 md:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800 font-['Cairo']">
                سجلات الاحتياط لليوم الدراسي
              </h3>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono">
                {substitutions.length} تكليفات
              </span>
            </div>
            <p className="text-xs text-slate-500">
              جميع التكليفات المسجلة لصفوف المدرسة الـ 32 (معتمدة على شاشات العرض)
            </p>
          </div>

          {/* فلترة الحصص */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">تصفية:</span>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">كافة الحصص (1 إلى 8)</option>
              {teachingPeriods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredSubstitutions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">لا توجد سجلات احتياط حالياً</p>
            <p className="text-xs text-slate-500 mt-1">
              جميع معلمي الفصول الـ 32 حاضرون — يمكنك تسجيل أي تكليف من النموذج أعلاه
            </p>
          </div>
        ) : (
          <div className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain">
            <table className="min-w-[980px] w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 rounded-r-xl">الحصة</th>
                  <th className="py-3 px-4">الصف</th>
                  <th className="py-3 px-4">المادة</th>
                  <th className="py-3 px-4">المعلم الغائب</th>
                  <th className="py-3 px-4">المعلم البديل المكلف</th>
                  <th className="py-3 px-4">نوع الاحتياط</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4">الملاحظات</th>
                  <th className="py-3 px-4 text-center rounded-l-xl">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubstitutions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-indigo-700 whitespace-nowrap">
                      {sub.period}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-800 whitespace-nowrap">
                      فصل {sub.gradeClass}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {sub.subject}
                    </td>
                    <td className="py-3 px-4 text-rose-600 font-bold whitespace-nowrap">
                      {sub.absentTeacher}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-black whitespace-nowrap">
                      {sub.substituteTeacher}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                        احتياط مادة ({sub.subject})
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={sub.status}
                        onChange={(e) => onUpdateStatus(sub.id, e.target.value as SubstitutionStatus)}
                        className={`text-xs px-2 py-1 rounded-lg border font-bold bg-white focus:outline-none ${
                          sub.status === 'مؤكد'
                            ? 'text-emerald-700 border-emerald-300'
                            : sub.status === 'تم الحضور'
                            ? 'text-emerald-800 border-emerald-400 bg-emerald-50'
                            : 'text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="مؤكد">مؤكد</option>
                        <option value="قيد الانتظار">قيد الانتظار</option>
                        <option value="تم الحضور">تم الحضور (مستلم)</option>
                        <option value="ملغي">ملغي</option>
                      </select>
                      {sub.acknowledgedAt && (
                        <span className="block text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>مؤكد {formatAcknowledgmentTime(sub.acknowledgedAt)}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {sub.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedQrSub(sub)}
                          className="px-2.5 py-1 text-indigo-700 hover:text-white hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
                          title="عرض باركود التكليف ومسحه بالجوال أو نسخ الرابط"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>باركود 📷</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSubstitution(sub.id)}
                          className="px-2.5 py-1 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
                          title="حذف هذا السجل فوراً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* نافذة دليل وتوزيع المعلمين حسب المواد الدراسية */}
      {showTeachersModal && (
        <TeachersBySubjectModal
          isOpen={showTeachersModal}
          onClose={() => setShowTeachersModal(false)}
          timetable={timetable}
          onBulkReplaceTimetable={onBulkReplaceTimetable}
          gasUrl={gasUrl}
          onTeachersUpdated={() => setTeachersUpdateTrigger((p) => p + 1)}
          onSelectTeacherForSubstitution={(teacherName, subj, role) => {
            if (role === 'absent') {
              setAbsentTeacher(teacherName);
              setSubject(subj);
            } else {
              setSubstituteTeacher(teacherName);
            }
            setShowTeachersModal(false);
          }}
        />
      )}

      {showFemaleTeachersManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-x-hidden">
          <div className="w-[calc(100vw-1rem)] sm:w-full max-w-3xl max-h-[88vh] min-w-0 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-start justify-between gap-2 bg-violet-50 min-w-0">
              <div>
                <h3 className="text-base font-black text-violet-900">إدارة قائمة المعلمات</h3>
                <p className="text-xs text-slate-600 mt-1">حدد أسماء المعلمات مرة واحدة من القائمة الرسمية المستخرجة من جدول الحصص. تستخدم القائمة فقط لتصفية نسخة المديرة المساعدة.</p>
              </div>
              <button type="button" onClick={() => setShowFemaleTeachersManager(false)} className="p-2 rounded-xl text-slate-500 hover:bg-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="w-full min-w-0 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-center">
                <div className="relative col-span-2 sm:col-span-1 flex-1 min-w-0 sm:min-w-[220px]">
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input value={femaleTeacherSearch} onChange={(e) => setFemaleTeacherSearch(e.target.value)} placeholder="بحث عن اسم..." className="w-full pr-10 pl-3 py-2 border border-slate-300 rounded-xl text-sm" />
                </div>
                <button type="button" onClick={() => saveFemaleTeachers([...femaleTeachers, ...filteredTeachersForFemaleManager])} className="px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold">تحديد الظاهر</button>
                <button type="button" onClick={() => saveFemaleTeachers(femaleTeachers.filter((name) => !filteredTeachersForFemaleManager.includes(name)))} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">إلغاء تحديد الظاهر</button>
              </div>
              <div className="text-xs font-bold text-violet-800">تم تحديد {femaleTeachers.length} من أصل {extractedTeachers.length} اسمًا</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredTeachersForFemaleManager.map((teacherName) => {
                const selected = femaleTeachers.includes(teacherName);
                return (
                  <button key={teacherName} type="button" onClick={() => toggleFemaleTeacher(teacherName)} className={`p-3 rounded-xl border text-right text-xs font-bold transition flex items-center justify-between gap-2 ${selected ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'}`}>
                    <span className="truncate">{teacherName}</span>
                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${selected ? 'bg-white text-violet-700 border-white' : 'border-slate-300'}`}>{selected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
            <div className="p-3 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-50">
              <span className="text-xs text-slate-500">تُحفظ القائمة تلقائيًا على هذا الجهاز.</span>
              <button type="button" onClick={() => setShowFemaleTeachersManager(false)} className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-black">حفظ وإغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تقرير كشاف الاحتياط الجاهز للطباعة A4 */}
      {showPrintReportModal && (
        <PrintableSubstitutionReport
          isOpen={showPrintReportModal}
          onClose={() => setShowPrintReportModal(false)}
          substitutions={substitutions}
          selectedDay={batchDay || 'الأحد'}
          reportMode={printReportMode}
          femaleTeachers={femaleTeachers}
        />
      )}

      {/* نافذة باركود QR لتأكيد استلام التكليف */}
      {selectedQrSub && (
        <SubstitutionQrModal
          substitution={selectedQrSub}
          isOpen={Boolean(selectedQrSub)}
          onClose={() => setSelectedQrSub(null)}
          onManualConfirm={(subId) => onUpdateStatus(subId, 'تم الحضور')}
        />
      )}
    </div>
  );
};
