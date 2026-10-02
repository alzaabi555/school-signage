import * as XLSX from 'xlsx';
import { ClassScheduleItem } from '../types';
import { OFFICIAL_TEACHERS_BY_SUBJECT, OFFICIAL_SUBJECTS_LIST } from '../data/officialTimetableData';
import { normalizeTeacherNameCanonical } from './excelUtils';
import { saveTeachersGuideToFirestore } from '../services/firebase';

export const STORAGE_TEACHERS_BY_SUBJECT = 'school_signage_teachers_by_subject';

export interface TeacherStat {
  teacher: string;
  subject: string;
  totalPeriods: number;
  classes: string[];
  days: string[];
}

/**
 * استخراج وتوزيع المعلمين تلقائياً وبدقة 100% من جدول الحصص الفعلي دون فقدان أي حصة
 * يحدد لكل معلم المادة التي يدرّس فيها أكبر نصاب من الحصص تلقائياً
 */
export function autoDistributeTeachersFromTimetable(timetable: ClassScheduleItem[] = []): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  OFFICIAL_SUBJECTS_LIST.forEach((subj) => {
    result[subj] = [];
  });

  const items = timetable && timetable.length > 0 ? timetable : [];
  const teacherSubjectCounts: Record<string, Record<string, number>> = {};

  items.forEach((item) => {
    const teacher = item.teacher?.trim();
    const subject = item.subject?.trim();
    if (!teacher || !subject || teacher.includes('شاغر') || teacher.includes('معلم الحصة')) {
      return;
    }

    if (!teacherSubjectCounts[teacher]) {
      teacherSubjectCounts[teacher] = {};
    }

    // مطابقة اسم المادة مع المواد المعتمدة
    const matchedSubject = OFFICIAL_SUBJECTS_LIST.find(
      (s) => s === subject || subject.includes(s) || s.includes(subject)
    ) || subject;

    teacherSubjectCounts[teacher][matchedSubject] = (teacherSubjectCounts[teacher][matchedSubject] || 0) + 1;
  });

  // لكل معلم، نحدد المادة التي يدرّس فيها أكبر عدد من الحصص
  Object.entries(teacherSubjectCounts).forEach(([teacher, counts]) => {
    let bestSubject = '';
    let maxCount = -1;

    Object.entries(counts).forEach(([subj, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestSubject = subj;
      }
    });

    if (bestSubject) {
      if (!result[bestSubject]) {
        result[bestSubject] = [];
      }
      if (!result[bestSubject].includes(teacher)) {
        result[bestSubject].push(teacher);
      }
    }
  });

  // إضافة أي معلمين رسميين لم يظهروا في الحصص
  Object.entries(OFFICIAL_TEACHERS_BY_SUBJECT).forEach(([subj, teachers]) => {
    teachers.forEach((t) => {
      const alreadyAssigned = Object.values(result).some((list) => list.includes(t));
      if (!alreadyAssigned) {
        if (!result[subj]) result[subj] = [];
        result[subj].push(t);
      }
    });
  });

  // ترتيب المعلمين أبجدياً داخل كل مادة
  Object.keys(result).forEach((subj) => {
    result[subj].sort((a, b) => a.localeCompare(b, 'ar'));
  });

  return result;
}

/**
 * نقل معلم من مادته الحالية إلى مادة دراسية أخرى فوراً دون المساس بحصصه أو فصوله في الجدول
 */
export function transferTeacherToSubject(
  teacher: string,
  newSubject: string,
  timetable: ClassScheduleItem[] = []
): Record<string, string[]> {
  const current = getTeachersBySubject(timetable);
  const cleanTeacher = teacher.trim();
  const cleanSubject = newSubject.trim();

  if (!cleanTeacher || !cleanSubject) return current;

  // إزالة المعلم من كافة المواد لتفادي الازدواجية
  Object.keys(current).forEach((subj) => {
    current[subj] = current[subj].filter((t) => t !== cleanTeacher);
  });

  if (!current[cleanSubject]) {
    current[cleanSubject] = [];
  }

  current[cleanSubject].push(cleanTeacher);
  current[cleanSubject].sort((a, b) => a.localeCompare(b, 'ar'));

  saveTeachersBySubject(current);
  return current;
}

/**
 * نقل معلم إلى مادة دراسية مع خيار تحديث مسمى المادة في جميع حصصه بالجدول المدرسي دون حذف أي حصة
 */
export function transferTeacherWithTimetableUpdate(
  teacher: string,
  newSubject: string,
  timetable: ClassScheduleItem[],
  updateTimetableLessons: boolean = true
): {
  updatedMapping: Record<string, string[]>;
  updatedTimetable: ClassScheduleItem[];
  affectedCount: number;
} {
  const cleanTeacher = teacher.trim();
  const cleanSubject = newSubject.trim();
  const updatedMapping = transferTeacherToSubject(cleanTeacher, cleanSubject, timetable);

  let affectedCount = 0;
  let updatedTimetable = timetable;

  if (updateTimetableLessons && timetable && timetable.length > 0) {
    updatedTimetable = timetable.map((item) => {
      if (item.teacher?.trim() === cleanTeacher) {
        affectedCount += 1;
        return {
          ...item,
          subject: cleanSubject,
        };
      }
      return item;
    });
  }

  return {
    updatedMapping,
    updatedTimetable,
    affectedCount,
  };
}

/**
 * تحديث جماعي لتوزيع المعلمين على المواد مع الحفاظ على جميع حصصهم بالجدول
 */
export function batchUpdateTeachersSubjects(
  assignments: Record<string, string>, // { [teacherName]: newSubject }
  timetable: ClassScheduleItem[],
  updateTimetableLessons: boolean = false
): {
  updatedMapping: Record<string, string[]>;
  updatedTimetable: ClassScheduleItem[];
} {
  let mapping = getTeachersBySubject(timetable);
  let updatedTimetable = [...timetable];

  Object.entries(assignments).forEach(([teacher, newSubject]) => {
    const cleanTeacher = teacher.trim();
    const cleanSubject = newSubject.trim();
    if (!cleanTeacher || !cleanSubject) return;

    // إزالة من الأقسام السابقة
    Object.keys(mapping).forEach((s) => {
      mapping[s] = mapping[s].filter((t) => t !== cleanTeacher);
    });

    if (!mapping[cleanSubject]) {
      mapping[cleanSubject] = [];
    }
    mapping[cleanSubject].push(cleanTeacher);

    if (updateTimetableLessons) {
      updatedTimetable = updatedTimetable.map((item) => {
        if (item.teacher?.trim() === cleanTeacher) {
          return { ...item, subject: cleanSubject };
        }
        return item;
      });
    }
  });

  Object.keys(mapping).forEach((s) => {
    mapping[s].sort((a, b) => a.localeCompare(b, 'ar'));
  });

  saveTeachersBySubject(mapping);
  return { updatedMapping: mapping, updatedTimetable };
}

/**
 * جلب قائمة وتوزيع المعلمين حسب المواد الدراسية، مع دمج التوزيع الرسمي والتعديلات المحفوظة محلياً وحصص الجدول
 */
export function getTeachersBySubject(timetable: ClassScheduleItem[] = []): Record<string, string[]> {
  let result: Record<string, string[]> = {};

  // 1. فحص التخزين المحلي لتعديلات المستخدم والمعلمين المضافين والمتدربين
  try {
    const customRaw = localStorage.getItem(STORAGE_TEACHERS_BY_SUBJECT);
    if (customRaw) {
      const customData: Record<string, string[]> = JSON.parse(customRaw);
      if (customData && typeof customData === 'object' && Object.keys(customData).length > 0) {
        result = { ...customData };
      }
    }
  } catch (err) {
    console.error('Error loading custom teachers by subject', err);
  }

  // 2. إذا لم يكن محفوظاً، يتم استخراجه وتوزيعه تلقائياً وبدقة من واقع حصص الجدول
  if (Object.keys(result).length === 0) {
    result = autoDistributeTeachersFromTimetable(timetable);
  } else {
    // التأكد من شمولية كافة المواد
    OFFICIAL_SUBJECTS_LIST.forEach((subj) => {
      if (!result[subj]) result[subj] = [];
    });

    // دمج أي معلمين واردين بالجدول لم يتم تسجيلهم بعد في التوزيع
    if (timetable && timetable.length > 0) {
      const allKnown = new Set(Object.values(result).flat());
      timetable.forEach((item) => {
        const t = normalizeTeacherNameCanonical(item.teacher || '');
        const s = item.subject?.trim();
        if (t && s && !allKnown.has(t) && !t.includes('شاغر')) {
          if (!result[s]) result[s] = [];
          if (!result[s].includes(t)) {
            result[s].push(t);
            allKnown.add(t);
          }
        }
      });
    }
  }

  return result;
}

/**
 * حفظ قائمة المعلمين حسب المواد في التخزين المحلي وإشعار واجهة المستخدم فوراً
 */
export function saveTeachersBySubject(data: Record<string, string[]>): void {
  try {
    localStorage.setItem(STORAGE_TEACHERS_BY_SUBJECT, JSON.stringify(data));
    saveTeachersGuideToFirestore(data).catch(() => {});
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('school_signage_teachers_updated', { detail: data }));
      }, 0);
    }
  } catch (err) {
    console.error('Error saving teachers by subject', err);
  }
}

/**
 * دمج المعلمين المستلمين من السحابة في التوزيع المحلي للمواد
 * يضمن ظهور المعلمين الجدد والمتدربين المضافين من أي جهاز آخر فوراً
 */
export function mergeRemoteTeachersIntoLocal(
  remoteTeachers: Array<Record<string, unknown>>,
  timetable: ClassScheduleItem[] = []
): Record<string, string[]> {
  const current = getTeachersBySubject(timetable);
  if (!remoteTeachers || !Array.isArray(remoteTeachers) || remoteTeachers.length === 0) {
    return current;
  }

  let hasChanges = false;
  remoteTeachers.forEach((row) => {
    const rawName = String(row['المعلم'] || row['teacher'] || row['name'] || '').trim();
    const rawSubj = String(row['المادة'] || row['subject'] || '').trim();
    if (!rawName || !rawSubj) return;

    const teacher = normalizeTeacherNameCanonical(rawName);
    const subject = rawSubj;

    if (!current[subject]) {
      current[subject] = [];
    }

    // إزالة المعلم من أي مادة أخرى إذا تغيرت مادته في السحابة
    Object.keys(current).forEach((s) => {
      if (s !== subject && current[s].includes(teacher)) {
        current[s] = current[s].filter((t) => t !== teacher);
        hasChanges = true;
      }
    });

    if (!current[subject].includes(teacher)) {
      current[subject].push(teacher);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    saveTeachersBySubject(current);
  }
  return current;
}

/**
 * تسطيح خريطة المعلمين حسب المواد إلى مصفوفة صفوف متوافقة مع Google Sheets
 */
export function flattenTeachersMapForRemote(
  teachersMap: Record<string, string[]>
): Array<{ id: string; teacher: string; subject: string; type: string; notes: string }> {
  const rows: Array<{ id: string; teacher: string; subject: string; type: string; notes: string }> = [];
  let counter = 1;
  Object.entries(teachersMap).forEach(([subject, teachers]) => {
    teachers.forEach((t) => {
      const clean = t.trim();
      if (!clean) return;
      const isTrainee = clean.includes('متدرب');
      rows.push({
        id: `TCH-${counter++}`,
        teacher: clean,
        subject,
        type: isTrainee ? 'معلم متدرب' : 'معلم أساسي',
        notes: '',
      });
    });
  });
  return rows;
}

/**
 * إضافة معلم إلى مادة دراسية محددة
 */
export function addTeacherToSubject(teacher: string, subject: string, timetable: ClassScheduleItem[] = []): Record<string, string[]> {
  const current = getTeachersBySubject(timetable);
  const cleanTeacher = teacher.trim();
  const cleanSubject = subject.trim();

  if (!cleanTeacher || !cleanSubject) return current;

  if (!current[cleanSubject]) {
    current[cleanSubject] = [];
  }

  // إزالة المعلم من أي مادة سابقة إذا وجدت لتفادي التكرار
  Object.keys(current).forEach((subj) => {
    current[subj] = current[subj].filter((t) => t !== cleanTeacher);
  });

  current[cleanSubject].push(cleanTeacher);
  saveTeachersBySubject(current);
  return current;
}

/**
 * حذف أو فك ارتباط معلم من مادة دراسية
 */
export function removeTeacherFromSubject(teacher: string, subject: string, timetable: ClassScheduleItem[] = []): Record<string, string[]> {
  const current = getTeachersBySubject(timetable);
  if (current[subject]) {
    current[subject] = current[subject].filter((t) => t !== teacher);
    saveTeachersBySubject(current);
  }
  return current;
}

/**
 * حساب إحصائيات المعلمين من الجدول (عدد الحصص الأسبوعية، الفصول المسندة، الأيام)
 */
export function calculateTeacherStats(timetable: ClassScheduleItem[], teachersBySubject: Record<string, string[]>): Record<string, TeacherStat> {
  const stats: Record<string, TeacherStat> = {};

  // خريطة لتحديد مادة كل معلم
  const teacherSubjectMap: Record<string, string> = {};
  Object.entries(teachersBySubject).forEach(([subj, teachers]) => {
    teachers.forEach((t) => {
      teacherSubjectMap[t] = subj;
    });
  });

  // تهيئة الإحصائيات لجميع المعلمين
  Object.entries(teachersBySubject).forEach(([subj, teachers]) => {
    teachers.forEach((t) => {
      stats[t] = {
        teacher: t,
        subject: subj,
        totalPeriods: 0,
        classes: [],
        days: [],
      };
    });
  });

  // مسح جدول الحصص الفعلي
  timetable.forEach((item) => {
    const teacher = item.teacher?.trim();
    if (!teacher || teacher.includes('شاغر')) return;

    if (!stats[teacher]) {
      stats[teacher] = {
        teacher,
        subject: teacherSubjectMap[teacher] || item.subject || 'مادة عامة',
        totalPeriods: 0,
        classes: [],
        days: [],
      };
    }

    stats[teacher].totalPeriods += 1;

    if (item.gradeClass && !stats[teacher].classes.includes(item.gradeClass)) {
      stats[teacher].classes.push(item.gradeClass);
    }

    if (item.day && !stats[teacher].days.includes(item.day)) {
      stats[teacher].days.push(item.day);
    }
  });

  // ترتيب الفصول تصاعدياً
  Object.values(stats).forEach((stat) => {
    stat.classes.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  });

  return stats;
}

/**
 * تصدير قائمة المعلمين وتوزيع المواد إلى ملف Excel احترافي
 */
export function exportTeachersBySubjectToExcel(
  teachersBySubject: Record<string, string[]>,
  stats: Record<string, TeacherStat>
) {
  const workbook = XLSX.utils.book_new();

  // 1. ورقة توزيع المعلمين حسب المواد (ملخص شامل)
  const rowsBySubject: Record<string, unknown>[] = [];
  let counter = 1;

  Object.entries(teachersBySubject).forEach(([subject, teachers]) => {
    teachers.forEach((teacher) => {
      const s = stats[teacher];
      rowsBySubject.push({
        'م': counter++,
        'المادة الدراسية': subject,
        'اسم المعلم': teacher,
        'نصاب الحصص الأسبوعي': s ? `${s.totalPeriods} حصة` : 'غير محدد',
        'الفصول المسندة': s && s.classes.length > 0 ? s.classes.join(' ، ') : 'غير مسجل بجدول',
        'عدد الفصول': s ? s.classes.length : 0,
        'أيام التدريس': s && s.days.length > 0 ? s.days.join(' ، ') : 'جميع الأيام',
      });
    });
  });

  const wsSubject = XLSX.utils.json_to_sheet(rowsBySubject);
  wsSubject['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 35 },
    { wch: 12 },
    { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(workbook, wsSubject, 'قائمة المعلمين وتوزيع المواد');

  // 2. ورقة إحصائية ملخصة لكل مادة
  const subjectSummaryRows = Object.entries(teachersBySubject).map(([subject, teachers], idx) => {
    const totalSubjectLessons = teachers.reduce((sum, t) => sum + (stats[t]?.totalPeriods || 0), 0);
    return {
      'م': idx + 1,
      'المادة الدراسية': subject,
      'عدد معلمي المادة': teachers.length,
      'إجمالي الحصص الأسبوعية للمادة': `${totalSubjectLessons} حصة`,
      'متوسط نصاب المعلم': teachers.length > 0 ? (totalSubjectLessons / teachers.length).toFixed(1) : 0,
      'أسماء معلمي المادة': teachers.join(' ، '),
    };
  });

  const wsSummary = XLSX.utils.json_to_sheet(subjectSummaryRows);
  wsSummary['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 16 },
    { wch: 25 },
    { wch: 18 },
    { wch: 60 },
  ];
  XLSX.utils.book_append_sheet(workbook, wsSummary, 'ملخص أقسام المواد الدراسية');

  XLSX.writeFile(workbook, 'قائمة_المعلمين_وتوزيع_المواد_الدراسية.xlsx');
}

/**
 * نقل فصل دراسي كامل من معلم إلى معلم آخر
 * يفيد في حال أُسند فصل لمعلم عن طريق الخطأ أو حدث تعديل في توزيع الفصول
 */
export function transferClassBetweenTeachers(
  sourceTeacher: string,
  targetTeacher: string,
  gradeClass: string,
  timetable: ClassScheduleItem[],
  options?: { targetSubject?: string }
): {
  updatedTimetable: ClassScheduleItem[];
  transferredCount: number;
} {
  const cleanSource = sourceTeacher.trim();
  const cleanTarget = targetTeacher.trim();
  const cleanClass = gradeClass.trim();

  if (!cleanSource || !cleanTarget || !cleanClass) {
    return { updatedTimetable: timetable, transferredCount: 0 };
  }

  let transferredCount = 0;
  const updatedTimetable = timetable.map((item) => {
    if (
      item.teacher?.trim() === cleanSource &&
      item.gradeClass?.trim() === cleanClass
    ) {
      transferredCount++;
      return {
        ...item,
        teacher: cleanTarget,
        ...(options?.targetSubject ? { subject: options.targetSubject.trim() } : {}),
      };
    }
    return item;
  });

  return { updatedTimetable, transferredCount };
}

