import {
  Substitution,
  DutyItem,
  Period,
  Announcement,
  ClassScheduleItem,
  DaySubjectDuty,
  AppStateData,
} from '../types';
import {
  normalizePeriodId,
  VALID_TEACHING_PERIOD_IDS,
  normalizeTeacherNameCanonical,
  normalizeDayName,
  normalizeClassName,
  deduplicateTimetable,
} from '../utils/excelUtils';
import { getArabicDayName, sanitizeAndDeduplicatePeriods } from '../utils/timeUtils';
import {
  getTeachersBySubject,
  saveTeachersBySubject,
  mergeRemoteTeachersIntoLocal,
  flattenTeachersMapForRemote,
} from '../utils/teachersUtils';
import {
  INITIAL_PERIODS,
  INITIAL_TIMETABLE,
  INITIAL_SUBSTITUTIONS,
  INITIAL_DUTIES,
  INITIAL_DAY_SUBJECT_DUTIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SETTINGS,
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'school_signage_settings',
  SUBSTITUTIONS: 'school_signage_substitutions',
  DELETED_SUBSTITUTIONS: 'school_signage_deleted_subs',
  DUTIES: 'school_signage_duties',
  DAY_SUBJECT_DUTIES: 'school_signage_day_subject_duties',
  PERIODS: 'school_signage_periods',
  ANNOUNCEMENTS: 'school_signage_announcements',
  TIMETABLE: 'school_signage_timetable',
  TEACHERS_BY_SUBJECT: 'school_signage_teachers_by_subject',
  LAST_SYNC: 'school_signage_last_sync',
};

export function recordDeletedSubstitutionId(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_SUBSTITUTIONS);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    set.add(id);
    localStorage.setItem(STORAGE_KEYS.DELETED_SUBSTITUTIONS, JSON.stringify(Array.from(set)));
  } catch {}
}

export function recordAllDeletedSubstitutionIds(ids: string[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_SUBSTITUTIONS);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    ids.forEach((id) => set.add(id));
    localStorage.setItem(STORAGE_KEYS.DELETED_SUBSTITUTIONS, JSON.stringify(Array.from(set)));
  } catch {}
}

export function getDeletedSubstitutionIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_SUBSTITUTIONS);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set<string>();
  }
}

export type { AppStateData } from '../types';

/**
 * تحميل البيانات من التخزين المحلي (Local Storage) كنسخة احتياطية سريعة
 */
export function loadLocalData(): AppStateData {
  try {
    const savedSubs = localStorage.getItem(STORAGE_KEYS.SUBSTITUTIONS);
    const savedDuties = localStorage.getItem(STORAGE_KEYS.DUTIES);
    const savedPeriods = localStorage.getItem(STORAGE_KEYS.PERIODS);
    const savedAnnouncements = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    const savedTimetable = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);

    let schoolName = 'الإبداع للبنين';
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.schoolName && !parsed.schoolName.includes('النخبة') && !parsed.schoolName.includes('32 فصلاً')) {
          schoolName = parsed.schoolName;
        } else {
          parsed.schoolName = 'الإبداع للبنين';
          parsed.ministryBadge = '';
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
      } catch {
        // fallback
      }
    }

    let finalTimetable = INITIAL_TIMETABLE;
    if (savedTimetable) {
      try {
        const parsed = JSON.parse(savedTimetable);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validRows = parsed
            .filter(
              (t: any) =>
                t &&
                t.day &&
                t.gradeClass &&
                t.teacher &&
                VALID_TEACHING_PERIOD_IDS.has(normalizePeriodId(t.periodId))
            )
            .map((t: any) => ({
              ...t,
              periodId: normalizePeriodId(t.periodId),
              teacher: normalizeTeacherNameCanonical(t.teacher),
            }));
          const cleanRows = deduplicateTimetable(validRows);
          if (cleanRows.length > 0) {
            finalTimetable = cleanRows;
            // تنظيف فوري للتخزين المحلي إن كان يحتوي على تكرارات سابقة
            if (cleanRows.length !== validRows.length) {
              try {
                localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(cleanRows));
              } catch {}
            }
          }
        }
      } catch (err) {
        console.warn('Could not parse saved timetable from localStorage', err);
      }
    }

    const deletedSubIds = getDeletedSubstitutionIds();
    let finalSubs: Substitution[] = [];
    if (savedSubs) {
      try {
        const parsed = JSON.parse(savedSubs);
        if (Array.isArray(parsed)) {
          finalSubs = parsed
            .filter((s: Substitution) => s && s.id && s.gradeClass && s.absentTeacher && !deletedSubIds.has(s.id))
            .map((s: Substitution) => ({
              ...s,
              day: normalizeDayName(s.day),
              period: normalizePeriodId(s.period),
              gradeClass: normalizeClassName(s.gradeClass),
            }));
        }
      } catch {
        finalSubs = [];
      }
    }

    let finalDuties: DutyItem[] = [];
    if (savedDuties) {
      try {
        const parsed = JSON.parse(savedDuties);
        // إزالة البيانات الوهمية السابقة المبدئية
        if (Array.isArray(parsed)) {
          finalDuties = parsed.filter(d => !d.id.startsWith('duty-'));
        }
      } catch {
        finalDuties = [];
      }
    }

    let finalPeriods = INITIAL_PERIODS;
    if (savedPeriods) {
      try {
        const parsed = JSON.parse(savedPeriods);
        if (Array.isArray(parsed) && parsed.length > 0) {
          finalPeriods = sanitizeAndDeduplicatePeriods(parsed);
          try {
            localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(finalPeriods));
          } catch {}
        }
      } catch {
        finalPeriods = INITIAL_PERIODS;
        try {
          localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(INITIAL_PERIODS));
        } catch {}
      }
    } else {
      try {
        localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(INITIAL_PERIODS));
      } catch {}
    }

    const savedDayDuties = localStorage.getItem(STORAGE_KEYS.DAY_SUBJECT_DUTIES);
    let finalDayDuties = INITIAL_DAY_SUBJECT_DUTIES;
    if (savedDayDuties) {
      try {
        const parsed = JSON.parse(savedDayDuties);
        if (parsed && typeof parsed === 'object') {
          finalDayDuties = { ...INITIAL_DAY_SUBJECT_DUTIES, ...parsed };
        }
      } catch {
        finalDayDuties = INITIAL_DAY_SUBJECT_DUTIES;
      }
    }

    return {
      substitutions: finalSubs,
      duties: finalDuties,
      daySubjectDuties: finalDayDuties,
      periods: finalPeriods,
      announcements: savedAnnouncements ? JSON.parse(savedAnnouncements) : INITIAL_ANNOUNCEMENTS,
      timetable: finalTimetable,
      teachersBySubject: getTeachersBySubject(finalTimetable),
      schoolName: schoolName || INITIAL_SETTINGS.schoolName,
      lastSyncTime: lastSync || null,
    };
  } catch (e) {
    console.warn('Error reading from localStorage, using initial mock data', e);
    return {
      substitutions: INITIAL_SUBSTITUTIONS,
      duties: INITIAL_DUTIES,
      daySubjectDuties: INITIAL_DAY_SUBJECT_DUTIES,
      periods: INITIAL_PERIODS,
      announcements: INITIAL_ANNOUNCEMENTS,
      timetable: INITIAL_TIMETABLE,
      teachersBySubject: getTeachersBySubject(INITIAL_TIMETABLE),
      schoolName: INITIAL_SETTINGS.schoolName,
      lastSyncTime: null,
    };
  }
}

/**
 * حفظ البيانات في التخزين المحلي
 */
export function saveLocalData(data: Partial<AppStateData>) {
  try {
    if (data.substitutions !== undefined) localStorage.setItem(STORAGE_KEYS.SUBSTITUTIONS, JSON.stringify(data.substitutions));
    if (data.duties !== undefined) localStorage.setItem(STORAGE_KEYS.DUTIES, JSON.stringify(data.duties));
    if (data.daySubjectDuties !== undefined) localStorage.setItem(STORAGE_KEYS.DAY_SUBJECT_DUTIES, JSON.stringify(data.daySubjectDuties));
    if (data.periods !== undefined) {
      const cleanPeriods = sanitizeAndDeduplicatePeriods(data.periods);
      localStorage.setItem(STORAGE_KEYS.PERIODS, JSON.stringify(cleanPeriods));
    }
    if (data.announcements !== undefined) localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(data.announcements));
    if (data.timetable !== undefined) localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(data.timetable));
    if (data.teachersBySubject !== undefined) saveTeachersBySubject(data.teachersBySubject);
    if (data.lastSyncTime !== undefined && data.lastSyncTime !== null) localStorage.setItem(STORAGE_KEYS.LAST_SYNC, data.lastSyncTime);
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

/**
 * استدعاء Google Apps Script لجلب كافة البيانات (Silent Polling)
 */
export async function fetchRemoteData(gasUrl: string): Promise<AppStateData | null> {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    return null;
  }

  const url = `${gasUrl.trim()}${gasUrl.includes('?') ? '&' : '?'}action=getAllData&_t=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`خطأ في استجابة الخادم: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (result.status !== 'success') {
    throw new Error(result.message || 'فشل في استلام البيانات من Google Apps Script');
  }

  // تحويل وتطبيع الحقول
  const rawSubstitutions: Substitution[] = (result.substitutions || [])
    .map((row: Record<string, unknown>, idx: number) => {
      const rawDate = String(row['التاريخ'] || row['date'] || '').trim();
      let sanitizedDate = rawDate;
      let derivedDay = String(row['اليوم'] || row['day'] || '').trim();

      if (rawDate) {
        try {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dayNum = String(d.getDate()).padStart(2, '0');
            sanitizedDate = `${year}-${month}-${dayNum}`;
            if (!derivedDay) {
              derivedDay = getArabicDayName(d);
            }
          }
        } catch {}
      }

      if (!sanitizedDate) {
        sanitizedDate = new Date().toISOString().split('T')[0];
      }
      if (!derivedDay) {
        try {
          derivedDay = getArabicDayName(new Date());
        } catch {
          derivedDay = 'الأحد';
        }
      }

      const normalizedDay = normalizeDayName(derivedDay);
      const normalizedPeriod = normalizePeriodId(String(row['الحصة'] || row['period'] || ''));
      const normalizedGradeClass = normalizeClassName(String(row['الصف'] || row['gradeClass'] || ''));

      return {
        id: String(row['المعرف'] || row['id'] || `SUB-${Date.now()}-${idx}`),
        date: sanitizedDate,
        day: normalizedDay,
        period: normalizedPeriod,
        gradeClass: normalizedGradeClass,
        absentTeacher: normalizeTeacherNameCanonical(String(row['المعلم_الغائب'] || row['absentTeacher'] || '').trim()),
        substituteTeacher: normalizeTeacherNameCanonical(String(row['المعلم_البديل'] || row['substituteTeacher'] || '').trim()),
        subject: String(row['المادة'] || row['subject'] || '').trim() || 'حصة احتياط',
        status: (row['الحالة'] || row['status'] || 'مؤكد') as Substitution['status'],
        notes: String(row['ملاحظات'] || row['notes'] || '').trim(),
        updatedAt: String(row['وقت_التحديث'] || row['updatedAt'] || '').trim(),
      };
    })
    .filter((s: Substitution) => s.gradeClass && s.absentTeacher);

  // إزالة التكرار مع الاحتفاظ بالسجل الأحدث فعليًا لكل يوم وحصة وفصل.
  const uniqueSubsMap = new Map<string, Substitution>();
  const toTimestamp = (sub: Substitution): number => {
    const parsed = Date.parse(String(sub.updatedAt || sub.date || ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  rawSubstitutions.forEach((sub) => {
    if (sub.status === 'ملغي') return;
    const key = `${sub.day}:::${sub.period}:::${sub.gradeClass}`;
    const current = uniqueSubsMap.get(key);
    if (!current || toTimestamp(sub) >= toTimestamp(current)) uniqueSubsMap.set(key, sub);
  });
  const parsedSubstitutions: Substitution[] = Array.from(uniqueSubsMap.values());

  const parsedDuties: DutyItem[] = (result.duties || []).map((row: Record<string, unknown>, idx: number) => ({
    id: String(row['المعرف'] || row['id'] || `duty-${idx}`),
    day: String(row['اليوم'] || row['day'] || 'الخميس'),
    location: String(row['الموقع_والمهمة'] || row['location'] || ''),
    leadTeacher: String(row['المشرف_الرئيسي'] || row['leadTeacher'] || ''),
    assistants: String(row['المعاونون'] || row['assistants'] || ''),
    timeSlot: String(row['وقت_المناوبة'] || row['timeSlot'] || ''),
    subject: String(row['المادة_أو_القسم'] || row['المادة_المناوبة'] || row['subject'] || ''),
    notes: String(row['ملاحظات'] || row['notes'] || ''),
  }));

  const sanitizeTime = (val: unknown, fallback: string): string => {
    if (!val) return fallback;
    const str = String(val).trim();

    // معالجة تواريخ Google Sheets الافتراضية سنة 1899 المحملة بفرق توقيت مسقط
    if (str.includes('1899-') && (str.includes('T') || str.includes('Z'))) {
      try {
        const d = new Date(str);
        if (!isNaN(d.getTime())) {
          const sec = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();
          const localSec = sec + 13272; // فرق توقيت مسقط الشمسي سنة 1899 (+03:41:12) في جداول Google Sheets
          const localH = Math.floor(localSec / 3600) % 24;
          const localM = Math.round((localSec % 3600) / 60);
          return `${String(localH).padStart(2, '0')}:${String(localM).padStart(2, '0')}`;
        }
      } catch {}
    }

    // إذا كان نص الوقت صريحاً ومباشراً HH:mm
    const directMatch = str.match(/^(\d{1,2}):(\d{2})$/);
    if (directMatch) {
      const h = parseInt(directMatch[1], 10);
      return `${String(h).padStart(2, '0')}:${directMatch[2]}`;
    }

    // استخراج النمط سواء كان منفرداً أو ضمن نص تاريخ (مثل "07:10:00" أو "7:10 AM")
    const match = str.match(/(?:^|\s|T)(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(AM|PM|ص|م))?/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const modifier = match[3];
      if (modifier) {
        const isPM = modifier.toUpperCase() === 'PM' || modifier === 'م';
        const isAM = modifier.toUpperCase() === 'AM' || modifier === 'ص';
        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
      }
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    return fallback;
  };

  const rawPeriodsList = (result.periods && result.periods.length > 0)
    ? result.periods
    : INITIAL_PERIODS;

  const rawMappedPeriods: Period[] = rawPeriodsList.map((row: Record<string, unknown>, idx: number) => {
    const rawId = String(row['المعرف'] || row['id'] || '').trim();
    const rowName = String(row['اسم_الفترة'] || row['اسم الفترة'] || row['name'] || '').trim();

    const rawStart = row['وقت_البدء'] ?? row['وقت البدء'] ?? row['startTime'] ?? row['البدء'];
    const rawEnd = row['وقت_الانتهاء'] ?? row['وقت الانتهاء'] ?? row['endTime'] ?? row['الانتهاء'];
    const rawBreak = row['هل_هي_فسحة'] ?? row['هل هي فسحة'] ?? row['isBreak'] ?? row['فسحة'];

    const isBreak =
      String(rawBreak).toLowerCase().includes('نعم') ||
      String(rawBreak).toLowerCase().includes('true') ||
      rawBreak === true ||
      rowName.includes('فسح') ||
      rowName.includes('طابور');

    return {
      id: rawId || (rowName.includes('طابور') ? 'p0' : isBreak ? 'b1' : `p${idx}`),
      name: rowName,
      startTime: sanitizeTime(rawStart, '07:10'),
      endTime: sanitizeTime(rawEnd, '07:45'),
      isBreak,
      order: Number(row['الترتيب'] || row['order'] || idx),
    };
  });

  const parsedPeriods: Period[] = sanitizeAndDeduplicatePeriods(rawMappedPeriods);

  const parsedAnnouncements: Announcement[] = (result.announcements && result.announcements.length > 0)
    ? result.announcements.map((row: Record<string, unknown>, idx: number) => ({
        id: String(row['المعرف'] || row['id'] || `ann-${idx}`),
        text: String(row['نص_الإعلان'] || row['text'] || ''),
        type: (row['النوع'] || row['type'] || 'info') as Announcement['type'],
        active: String(row['نشط'] || row['active']).toLowerCase().includes('نعم') || row['active'] === true,
        createdAt: String(row['تاريخ_الإنشاء'] || row['createdAt'] || new Date().toISOString()),
      }))
    : INITIAL_ANNOUNCEMENTS;

  const parsedTimetableRows: ClassScheduleItem[] = (result.timetable || []).map(
    (row: Record<string, unknown>, idx: number) => ({
      id: String(row['المعرف'] || row['id'] || `tt-${idx}`),
      day: String(row['اليوم'] || row['day'] || '').trim(),
      periodId: normalizePeriodId(row['معرف_الحصة'] || row['periodId']),
      gradeClass: String(row['الصف'] || row['gradeClass'] || '').trim(),
      subject: String(row['المادة'] || row['subject'] || '').trim(),
      teacher: normalizeTeacherNameCanonical(String(row['المعلم'] || row['teacher'] || '').trim()),
      room: String(row['القاعة'] || row['room'] || '').trim(),
    })
  );
  const validRemoteTimetable = parsedTimetableRows.filter(
    (item) => item.day && item.gradeClass && item.teacher && VALID_TEACHING_PERIOD_IDS.has(item.periodId)
  );

  let parsedTimetable: ClassScheduleItem[];
  if (validRemoteTimetable.length > 0) {
    parsedTimetable = deduplicateTimetable(validRemoteTimetable);
  } else {
    // الاحتفاظ بالجدول المحلي المحفوظ إن وجد لمنع مسحه بالجدول الافتراضي القديم
    const local = loadLocalData();
    parsedTimetable = (local.timetable && local.timetable.length > 0) ? deduplicateTimetable(local.timetable) : INITIAL_TIMETABLE;
  }

  // دمج وتحديث قائمة معلمي المواد والمتدربين من السحابة إذا كانت متوفرة
  let teachersBySubject = getTeachersBySubject(parsedTimetable);
  if (result.teachers && Array.isArray(result.teachers) && result.teachers.length > 0) {
    teachersBySubject = mergeRemoteTeachersIntoLocal(result.teachers, parsedTimetable);
  }

  const lastSyncTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const fetchedState: AppStateData = {
    substitutions: parsedSubstitutions,
    duties: parsedDuties.length > 0 ? parsedDuties : INITIAL_DUTIES,
    daySubjectDuties: (result.daySubjectDuties && typeof result.daySubjectDuties === 'object' && Object.keys(result.daySubjectDuties).length > 0)
      ? result.daySubjectDuties
      : INITIAL_DAY_SUBJECT_DUTIES,
    periods: parsedPeriods,
    announcements: parsedAnnouncements,
    timetable: parsedTimetable,
    teachersBySubject,
    schoolName: result.schoolName || INITIAL_SETTINGS.schoolName,
    lastSyncTime,
  };

  // حفظ في التخزين المحلي لتسريع التحميل مستقبلاً
  saveLocalData(fetchedState);

  return fetchedState;
}

export interface RemotePostResult {
  success: boolean;
  message: string;
  id?: string;
  count?: number;
  operation?: string;
}

/**
 * مزامنة ورفع دليل المعلمين وتوزيع المواد بالكامل إلى Google Sheets
 */
export async function syncTeachersMapToRemote(
  gasUrl: string,
  teachersMap: Record<string, string[]>
): Promise<RemotePostResult> {
  const payload = flattenTeachersMapForRemote(teachersMap);
  return sendRemotePost(gasUrl, 'save_teachers', payload);
}

/**
 * إضافة معلم جديد / متدرب إلى السحابة في Google Sheets
 */
export async function addTeacherToRemote(
  gasUrl: string,
  teacher: { teacher: string; subject: string; type?: string; notes?: string }
): Promise<RemotePostResult> {
  return sendRemotePost(gasUrl, 'add_teacher', teacher);
}

/**
 * إرسال طلب POST إلى Google Apps Script
 * نستخدم Content-Type: text/plain لتفادي تعقيدات CORS Preflight OPTIONS في Apps Script
 */
export async function sendRemotePost(
  gasUrl: string,
  action: string,
  data: unknown
): Promise<RemotePostResult> {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    return {
      success: true,
      message: 'تم الحفظ في الذاكرة المحلية (لم يتم ضبط رابط Google Apps Script بعد)',
      count: Array.isArray(data) ? data.length : undefined,
      operation: 'replace',
    };
  }

  const payload = {
    action,
    data,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(gasUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`خطأ بالاتصال: ${response.status}`);
    }

    const result = await response.json();
    const isSuccess = result.status === 'success' || result.success === true;
    return {
      success: isSuccess,
      message: result.message || (isSuccess ? 'تمت العملية بنجاح' : 'فشلت العملية في السحابة'),
      id: result.id,
      count: typeof result.count === 'number' ? result.count : undefined,
      operation: result.operation,
    };
  } catch (error) {
    console.warn('POST to GAS failed', error);
    return {
      success: false,
      message: `تعذر الاتصال بـ Google Apps Script: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
