import {
  SchoolSettings,
  ClassScheduleItem,
  Substitution,
  DutyItem,
  Period,
  Announcement,
  AppStateData,
} from '../types';
import {
  STORAGE_FEMALE_TEACHERS,
  STORAGE_DISPLAY_AUDIENCE_MODE,
  getStoredFemaleTeachers,
} from './femaleTeachersUtils';
import { STORAGE_TEACHERS_BY_SUBJECT, getTeachersBySubject } from './teachersUtils';
import { saveLocalData, loadLocalData } from '../services/apiService';
import { uploadAllStateToFirestore } from '../services/firebase';

export interface FullSchoolBackup {
  version: '2.0';
  exportDate: string; // ISO 8601
  exportDateFormatted: string; // Arabic formatted date
  schoolName: string;
  appTitle: string;
  counts: {
    timetableLessons: number;
    substitutions: number;
    duties: number;
    periods: number;
    announcements: number;
    femaleTeachers: number;
    subjectsInGuide: number;
  };
  data: {
    settings: SchoolSettings;
    timetable: ClassScheduleItem[];
    substitutions: Substitution[];
    duties: DutyItem[];
    daySubjectDuties?: Record<string, { subject: string; departmentLead: string; notes?: string }>;
    periods: Period[];
    announcements: Announcement[];
    femaleTeachers: string[];
    teachersGuide: Record<string, string[]>;
    customSubjects: string[];
    deletedSubjects: string[];
    audienceMode?: string;
  };
}

export interface BackupValidationResult {
  isValid: boolean;
  error?: string;
  backup?: FullSchoolBackup;
  summary?: {
    schoolName: string;
    exportDate: string;
    counts: FullSchoolBackup['counts'];
  };
}

/**
 * إنشاء كائن النسخة الاحتياطية الشاملة لكافة بيانات التطبيق ومدخلاته
 */
export function generateFullBackupData(
  stateData: AppStateData,
  settings: SchoolSettings,
  femaleTeachersList?: string[]
): FullSchoolBackup {
  // 1. المعلمات
  const femaleTeachers = femaleTeachersList && femaleTeachersList.length > 0
    ? femaleTeachersList
    : getStoredFemaleTeachers();

  // 2. دليل المعلمين حسب المواد
  const teachersGuide = getTeachersBySubject(stateData.timetable);

  // 3. المواد المخصصة والمحذوفة
  let customSubjects: string[] = [];
  let deletedSubjects: string[] = [];
  try {
    const rawCustom = localStorage.getItem('school_signage_custom_subjects');
    if (rawCustom) customSubjects = JSON.parse(rawCustom);
    const rawDeleted = localStorage.getItem('school_signage_deleted_subjects');
    if (rawDeleted) deletedSubjects = JSON.parse(rawDeleted);
  } catch {}

  // 4. وضع العرض
  let audienceMode = 'general';
  try {
    audienceMode = localStorage.getItem(STORAGE_DISPLAY_AUDIENCE_MODE) || 'general';
  } catch {}

  const now = new Date();
  const formattedDate = now.toLocaleDateString('ar-OM', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const cleanSchoolName = settings.schoolName?.trim() || 'الإبداع للبنين';

  return {
    version: '2.0',
    exportDate: now.toISOString(),
    exportDateFormatted: formattedDate,
    schoolName: cleanSchoolName,
    appTitle: 'نظام الشاشات والجدول المدرسي الذكي',
    counts: {
      timetableLessons: stateData.timetable?.length || 0,
      substitutions: stateData.substitutions?.length || 0,
      duties: stateData.duties?.length || 0,
      periods: stateData.periods?.length || 0,
      announcements: stateData.announcements?.length || 0,
      femaleTeachers: femaleTeachers.length,
      subjectsInGuide: Object.keys(teachersGuide).length,
    },
    data: {
      settings: { ...settings },
      timetable: [...(stateData.timetable || [])],
      substitutions: [...(stateData.substitutions || [])],
      duties: [...(stateData.duties || [])],
      daySubjectDuties: stateData.daySubjectDuties ? { ...stateData.daySubjectDuties } : undefined,
      periods: [...(stateData.periods || [])],
      announcements: [...(stateData.announcements || [])],
      femaleTeachers,
      teachersGuide,
      customSubjects,
      deletedSubjects,
      audienceMode,
    },
  };
}

/**
 * تنزيل ملف النسخة الاحتياطية JSON محلياً على جهاز المستخدم مع دعم أجهزة الأندرويد والمتصفحات
 */
export async function downloadBackupFile(backup: FullSchoolBackup): Promise<void> {
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });

  // تسمية الملف باسم المدرسة والتاريخ بدقة
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeSchoolName = backup.schoolName.replace(/[\/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_');
  const filename = `نسخة_احتياطية_${safeSchoolName}_${dateStr}.json`;

  const isMobileOrAndroid = typeof navigator !== 'undefined' && (/android/i.test(navigator.userAgent) || Boolean((window as unknown as { Capacitor?: unknown }).Capacitor));
  if (isMobileOrAndroid && typeof navigator !== 'undefined' && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: 'application/json' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `نسخة احتياطية: ${backup.schoolName}`,
          text: `ملف النسخة الاحتياطية لمدرسة ${backup.schoolName}`,
        });
        return;
      }
    } catch (shareErr) {
      if (shareErr instanceof Error && shareErr.name === 'AbortError') return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 2000);
}

/**
 * التحقق من صحة ملف النسخة الاحتياطية JSON قبل الاسترداد
 */
export function validateBackupJson(jsonString: string): BackupValidationResult {
  try {
    if (!jsonString || !jsonString.trim()) {
      return { isValid: false, error: 'الملف فارغ ولا يحتوي على بيانات.' };
    }

    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'تنسيق الملف غير صالح كملف JSON.' };
    }

    // دعم النسخة الحديثة أو القديمة إن وجدت
    const data = parsed.data || parsed;

    if (!data.timetable && !data.substitutions && !data.settings && !data.periods) {
      return {
        isValid: false,
        error: 'الملف المحدد لا يحتوي على بيانات جدول أو إعدادات مدرسية معترف بها.',
      };
    }

    // إعداد كائن كامل موحد
    const backup: FullSchoolBackup = {
      version: parsed.version || '2.0',
      exportDate: parsed.exportDate || new Date().toISOString(),
      exportDateFormatted: parsed.exportDateFormatted || 'غير محدد',
      schoolName: parsed.schoolName || data.settings?.schoolName || 'مدرسة غير محددة',
      appTitle: parsed.appTitle || 'نظام الشاشات والجدول المدرسي الذكي',
      counts: {
        timetableLessons: Array.isArray(data.timetable) ? data.timetable.length : 0,
        substitutions: Array.isArray(data.substitutions) ? data.substitutions.length : 0,
        duties: Array.isArray(data.duties) ? data.duties.length : 0,
        periods: Array.isArray(data.periods) ? data.periods.length : 0,
        announcements: Array.isArray(data.announcements) ? data.announcements.length : 0,
        femaleTeachers: Array.isArray(data.femaleTeachers) ? data.femaleTeachers.length : 0,
        subjectsInGuide: data.teachersGuide && typeof data.teachersGuide === 'object'
          ? Object.keys(data.teachersGuide).length
          : 0,
      },
      data: {
        settings: data.settings || {},
        timetable: Array.isArray(data.timetable) ? data.timetable : [],
        substitutions: Array.isArray(data.substitutions) ? data.substitutions : [],
        duties: Array.isArray(data.duties) ? data.duties : [],
        daySubjectDuties: data.daySubjectDuties || undefined,
        periods: Array.isArray(data.periods) ? data.periods : [],
        announcements: Array.isArray(data.announcements) ? data.announcements : [],
        femaleTeachers: Array.isArray(data.femaleTeachers) ? data.femaleTeachers : [],
        teachersGuide: data.teachersGuide || {},
        customSubjects: Array.isArray(data.customSubjects) ? data.customSubjects : [],
        deletedSubjects: Array.isArray(data.deletedSubjects) ? data.deletedSubjects : [],
        audienceMode: data.audienceMode || 'general',
      },
    };

    return {
      isValid: true,
      backup,
      summary: {
        schoolName: backup.schoolName,
        exportDate: backup.exportDateFormatted,
        counts: backup.counts,
      },
    };
  } catch (err) {
    return {
      isValid: false,
      error: `حدث خطأ أثناء قراءة الملف: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * تطبيق وحفظ النسخة الاحتياطية في المتصفح محلياً ومزامنتها سحابياً
 */
export async function applyRestoredBackup(
  backup: FullSchoolBackup,
  options: { syncToFirebase?: boolean } = { syncToFirebase: true }
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = backup;

    // 1. حفظ الإعدادات
    if (data.settings && Object.keys(data.settings).length > 0) {
      localStorage.setItem('school_signage_settings', JSON.stringify(data.settings));
    }

    // 2. تجميع حالة التطبيق
    const nextStateData: AppStateData = {
      substitutions: data.substitutions || [],
      duties: data.duties || [],
      daySubjectDuties: data.daySubjectDuties,
      periods: data.periods && data.periods.length > 0 ? data.periods : (loadLocalData().periods || []),
      announcements: data.announcements || [],
      timetable: data.timetable || [],
      lastSyncTime: new Date().toISOString(),
    };

    // حفظها محلياً
    saveLocalData(nextStateData);

    // 3. حفظ المعلمات
    if (data.femaleTeachers && Array.isArray(data.femaleTeachers)) {
      localStorage.setItem(STORAGE_FEMALE_TEACHERS, JSON.stringify(data.femaleTeachers));
      try {
        window.dispatchEvent(
          new CustomEvent('school_signage_female_teachers_updated', { detail: data.femaleTeachers })
        );
      } catch {}
    }

    // 4. حفظ دليل المعلمين حسب المواد
    if (data.teachersGuide && typeof data.teachersGuide === 'object') {
      localStorage.setItem(STORAGE_TEACHERS_BY_SUBJECT, JSON.stringify(data.teachersGuide));
      try {
        window.dispatchEvent(
          new CustomEvent('school_signage_teachers_updated', { detail: data.teachersGuide })
        );
      } catch {}
    }

    // 5. حفظ المواد المخصصة والمحذوفة
    if (data.customSubjects && Array.isArray(data.customSubjects)) {
      localStorage.setItem('school_signage_custom_subjects', JSON.stringify(data.customSubjects));
    }
    if (data.deletedSubjects && Array.isArray(data.deletedSubjects)) {
      localStorage.setItem('school_signage_deleted_subjects', JSON.stringify(data.deletedSubjects));
    }

    // 6. وضع العرض
    if (data.audienceMode) {
      localStorage.setItem(STORAGE_DISPLAY_AUDIENCE_MODE, data.audienceMode);
    }

    // 7. مزامنة فورية إلى Firebase Firestore إذا كان الخيار مفعلاً
    if (options.syncToFirebase) {
      try {
        await uploadAllStateToFirestore(
          {
            substitutions: nextStateData.substitutions,
            duties: nextStateData.duties,
            periods: nextStateData.periods,
            announcements: nextStateData.announcements,
            timetable: nextStateData.timetable,
          },
          data.settings
        );
      } catch (fbErr) {
        console.warn('Firebase sync warning during restore:', fbErr);
      }
    }

    return {
      success: true,
      message: `تم بنجاح استرداد كافة البيانات (${backup.counts.timetableLessons} حصة، ${backup.counts.substitutions} احتياط، ${backup.counts.duties} مناوبة، ${backup.counts.femaleTeachers} معلمة) وتحديث التخزين المحلي والسحابي!`,
    };
  } catch (error) {
    return {
      success: false,
      message: `فشل استرداد النسخة الاحتياطية: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
