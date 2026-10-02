import * as XLSX from 'xlsx';
import { ClassScheduleItem, Substitution } from '../types';
import {
  OFFICIAL_CLASSES_32,
  OFFICIAL_TEACHERS_LIST,
  OFFICIAL_SUBJECTS_LIST,
  OFFICIAL_TIMETABLE_ITEMS,
  OFFICIAL_TEACHERS_BY_SUBJECT,
} from '../data/officialTimetableData';
import { getTeachersBySubject, calculateTeacherStats } from './teachersUtils';

export const SCHOOL_WEEK_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export const SCHOOL_32_CLASSES: string[] = OFFICIAL_CLASSES_32 && OFFICIAL_CLASSES_32.length > 0 ? OFFICIAL_CLASSES_32 : [
  // الصف 5 (من 1 إلى 8 = 8 فصول)
  '5/1', '5/2', '5/3', '5/4', '5/5', '5/6', '5/7', '5/8',
  // الصف 6 (من 1 إلى 9 = 9 فصول)
  '6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7', '6/8', '6/9',
  // الصف 7 (من 1 إلى 8 = 8 فصول)
  '7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7', '7/8',
  // الصف 8 (من 1 إلى 7 = 7 فصول)
  '8/1', '8/2', '8/3', '8/4', '8/5', '8/6', '8/7',
];

export const SCHOOL_TEACHERS_LIST: string[] = OFFICIAL_TEACHERS_LIST;

export const SCHOOL_SUBJECTS_LIST: string[] = OFFICIAL_SUBJECTS_LIST;

/**
 * قائمة التحويل الصريحة للأسماء القديمة والمحرفة المعروفة
 */
export const KNOWN_TEACHER_EXPLICIT_MAP: Record<string, string> = {
  'وفاء السعيدي ع': 'وفاء السعيدي',
  'عبير البادي ع': 'عبير البادي',
  'فاطمة الكعبي ع': 'فاطمة الكعبي',
  'أميرة الزيدية ر': 'أميرة الزيدية',
  'ميرة البلوشية ر': 'ميرة البلوشية',
  'السعيدية اليقين': 'اليقين السعيدية',
  'اليقين السعيدية': 'اليقين السعيدية',
  'السعيدية اليقين ر': 'اليقين السعيدية',
  'وفاء السعيدية': 'وفاء السعيدي',
  'عبير البادية': 'عبير البادي',
  'فاطمة الكعبية': 'فاطمة الكعبي',
  'أنوا الخنصورية': 'أنوار الخنصورية',
  'أنواالخنصورية': 'أنوار الخنصورية',
  'مانالمعمري': 'مانع المعمري',
  'عمالمحرزي': 'عمر المحرزي',
  'عمالمعمري': 'عمر المعمري',
  'عبيالبادي': 'عبير البادي',
  'ياسالعجمي': 'ياسر العجمي',
  'بدالقاسمي': 'بدر القاسمي',
};

/**
 * دالة مركزية لتوحيد وتطبيع أسماء المعلمين قبل الحفظ
 * تلتزم بـ:
 * - عدم حذف حرف أصلي من أي اسم عشوائياً
 * - استخدام قائمة تحويل صريحة للأسماء المعروفة (وليس حذف عشوائي لآخر حرف)
 * - عدم دمج السجلات المختلفة لتخصصين مختلفين لنفس المعلم (مثل عبدالعزيز السعيدي عربي وتقنية)
 */
export function normalizeTeacherNameCanonical(rawName: unknown): string {
  if (!rawName) return '';
  let name = String(rawName).trim();
  // إزالة التشكيل
  name = name.replace(/[\u064B-\u065F\u0670]/g, '');
  // توحيد المسافات
  name = name.replace(/\s+/g, ' ');

  if (KNOWN_TEACHER_EXPLICIT_MAP[name]) {
    return KNOWN_TEACHER_EXPLICIT_MAP[name];
  }

  // فحص بدون اللقب الشائع (أ. أو معلم) إن وجد لمطابقة القائمة الصريحة
  const stripped = name.replace(/^(?:أ\.|أستاذة|أستاذ|معلم|معلمة)\s+/, '').trim();
  if (KNOWN_TEACHER_EXPLICIT_MAP[stripped]) {
    return KNOWN_TEACHER_EXPLICIT_MAP[stripped];
  }

  return name;
}

/**
 * فحص تطابق اسم المعلم بدقة مع مراعاة الألقاب والصيغ المعتمدة
 */
export function isSameTeacher(left: string, right: string): boolean {
  if (!left || !right) return false;
  return normalizeTeacherNameCanonical(left) === normalizeTeacherNameCanonical(right);
}

export interface TimetableValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalItems: number;
    classesCount: number;
    classesList: string[];
    daysCount: Record<string, number>;
  };
}

/**
 * التحقق الصارم من بيانات الجدول المستورد قبل الحذف أو الاستبدال
 */
export function validateImportedTimetable(
  items: unknown,
  expectedClassesCount: number = 32
): TimetableValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const daysSummary: Record<string, number> = {};

  if (!Array.isArray(items) || items.length === 0) {
    return {
      valid: false,
      errors: ['بيانات الجدول المستورد فارغة أو ليست مصفوفة صالحة.'],
      warnings: [],
      stats: { totalItems: 0, classesCount: 0, classesList: [], daysCount: {} },
    };
  }

  const validPeriodSet = new Set(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']);
  const classesSet = new Set<string>();
  const classSlotMap = new Map<string, number>(); // day + '|' + periodId + '|' + gradeClass
  const exactKeySet = new Set<string>(); // day + '|' + periodId + '|' + gradeClass + '|' + teacher + '|' + subject

  items.forEach((it, idx) => {
    const rowNum = idx + 1;
    if (!it || typeof it !== 'object') {
      errors.push(`السجل رقم ${rowNum}: غير صالح.`);
      return;
    }

    const day = normalizeDayName(String(it.day || ''));
    const periodId = normalizePeriodId(it.periodId);
    const gradeClass = normalizeClassName(String(it.gradeClass || ''));
    const subject = String(it.subject || '').trim();
    const teacher = normalizeTeacherNameCanonical(it.teacher);

    // 7. جميع السجلات تحتوي على: day, periodId, gradeClass, subject, teacher
    if (!day || !periodId || !gradeClass || !subject || !teacher) {
      errors.push(
        `السجل رقم ${rowNum}: يحتوي على حقول ناقصة (اليوم: "${day || 'مفقود'}"، الحصة: "${periodId || 'مفقود'}"، الصف: "${gradeClass || 'مفقود'}"، المادة: "${subject || 'مفقود'}"، المعلم: "${teacher || 'مفقود'}").`
      );
    }

    // 3. جميع معرفات الحصص ضمن: p1, p2, p3, p4, p5, p6, p7, p8
    if (!validPeriodSet.has(periodId)) {
      errors.push(
        `السجل رقم ${rowNum} (الصف ${gradeClass || 'مجهول'}): معرف الحصة (${periodId}) غير صالح، يجب أن يكون حصة تدريسية حصراً بين p1 و p8.`
      );
    }

    // 4. لا توجد قيم p0 أو b1 أو b2 أو break ضمن الجدول التدريسي
    if (periodId === 'p0' || periodId.startsWith('b') || periodId.includes('break')) {
      errors.push(
        `السجل رقم ${rowNum}: تم اكتشاف معرف غير تدريسي (${periodId}) مثل الطابور أو الفسحة ضمن الجدول التدريسي المرفوع.`
      );
    }

    // 8. لا يوجد أي نص داخل المعلم أو المادة يحتوي: [احتياط: أو بدل:
    if (
      teacher.includes('[احتياط:') ||
      teacher.includes('بدل:') ||
      subject.includes('[احتياط:') ||
      subject.includes('بدل:')
    ) {
      errors.push(
        `السجل رقم ${rowNum}: تم اكتشاف نص احتياط أو بدل مدخل داخل اسم المعلم أو المادة ("${teacher}" / "${subject}").`
      );
    }

    if (gradeClass) {
      classesSet.add(gradeClass);
    }
    if (day) {
      daysSummary[day] = (daysSummary[day] || 0) + 1;
    }

    // 5. لا يوجد أكثر من سجل للفصل نفسه في اليوم والحصة نفسيهما
    const slotKey = `${day}|${periodId}|${gradeClass}`;
    const previousOccur = classSlotMap.get(slotKey);
    if (previousOccur !== undefined) {
      errors.push(
        `تعارض حصص: الفصل (${gradeClass}) مسجل له أكثر من حصة في نفس اليوم (${day}) والحصة (${periodId}) (السجل ${rowNum} يتعارض مع السجل ${previousOccur}).`
      );
    } else {
      classSlotMap.set(slotKey, rowNum);
    }

    // 6. لا توجد سجلات مكررة بالمفتاح: day + periodId + gradeClass + teacher + subject
    const exactKey = `${day}|${periodId}|${gradeClass}|${teacher}|${subject}`;
    if (exactKeySet.has(exactKey)) {
      errors.push(
        `سجل مكرر بالكامل: اليوم (${day})، الحصة (${periodId})، الفصل (${gradeClass})، المعلم (${teacher})، المادة (${subject}).`
      );
    } else {
      exactKeySet.add(exactKey);
    }
  });

  // 2. عدد الفصول 32
  if (classesSet.size !== expectedClassesCount) {
    errors.push(
      `عدد الفصول المستخرجة (${classesSet.size} فصلاً) لا يطابق عدد فصول المدرسة المطلوب (${expectedClassesCount} فصلاً).`
    );
  }

  // 9. لا تعتمد على رقم ثابت 1280 في الكود، لكن اعرض العدد الفعلي واحذر إن كان مختلفاً
  const standardExpectedCount = expectedClassesCount * 5 * 8; // 32 * 40 = 1280
  if (items.length !== standardExpectedCount) {
    warnings.push(
      `تنبيه: عدد الحصص الإجمالي المستخرج هو ${items.length} حصة، بينما المتوقع القياسي لـ ${expectedClassesCount} فصلاً بكامل حصص الأسبوع هو ${standardExpectedCount} حصة.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalItems: items.length,
      classesCount: classesSet.size,
      classesList: Array.from(classesSet).sort(),
      daysCount: daysSummary,
    },
  };
}

export interface ExcelParseResult {
  success: boolean;
  totalParsed: number;
  items: ClassScheduleItem[];
  detectedClassesCount: number;
  daysSummary: Record<string, number>;
  message: string;
  errors: string[];
}

/**
 * تطبيع أسماء الفصول المدرسية لتطابق الصيغة القياسية (5/1 إلى 5/8، 6/1 إلى 6/9، 7/1 إلى 7/8، 8/1 إلى 8/7)
 */
export function normalizeClassName(raw: string): string {
  if (!raw) return '';
  const clean = raw.toString().trim();

  // فحص الأنماط المباشرة مثل 5/1 أو 5-1 أو 5_1
  const slashMatch = clean.match(/^([5-8])\s*[\/\-_،,]\s*(\d+)$/);
  if (slashMatch) {
    return `${slashMatch[1]}/${slashMatch[2]}`;
  }

  // فحص 5(1) أو 5 (1)
  const parenMatch = clean.match(/^([5-8])\s*\(\s*(\d+)\s*\)$/);
  if (parenMatch) {
    return `${parenMatch[1]}/${parenMatch[2]}`;
  }

  // فحص الكلمات بالعربية: خامس / سادس / سابع / ثامن
  let grade = '';
  if (clean.includes('خامس') || clean.startsWith('5')) grade = '5';
  else if (clean.includes('سادس') || clean.startsWith('6')) grade = '6';
  else if (clean.includes('سابع') || clean.startsWith('7')) grade = '7';
  else if (clean.includes('ثامن') || clean.startsWith('8')) grade = '8';

  if (grade) {
    const digits = clean.match(/\d+/g);
    if (digits && digits.length > 0) {
      const section = digits.length > 1 ? digits[1] : digits[0];
      return `${grade}/${section}`;
    }
  }

  return clean;
}

/**
 * دالة مساعدة لتطبيع أسماء الأيام وضمان التطابق التام عبر كافة مكونات النظام
 */
export function normalizeDayName(str: string): string {
  if (!str) return '';
  const clean = str.trim().toLowerCase();
  if (clean.includes('أحد') || clean.includes('احد') || clean.includes('sun')) return 'الأحد';
  if (clean.includes('اثنين') || clean.includes('إثنين') || clean.includes('mon')) return 'الاثنين';
  if (clean.includes('ثلاث') || clean.includes('tue')) return 'الثلاثاء';
  if (clean.includes('أربع') || clean.includes('اربع') || clean.includes('wed')) return 'الأربعاء';
  if (clean.includes('خمس') || clean.includes('خميس') || clean.includes('thu')) return 'الخميس';
  if (clean.includes('جمع') || clean.includes('fri')) return 'الجمعة';
  if (clean.includes('سبت') || clean.includes('sat')) return 'السبت';
  return str.trim();
}

/**
 * دالة مساعدة لتطبيع أسماء الحصص لترتبط بمعرفات الحصص (p1 حتى p8)
 */
export const VALID_TEACHING_PERIOD_IDS = new Set<string>([
  'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8',
]);

/**
 * تطبيع معرف الحصة دون أي إزاحة بين p1 وp8.
 * المعرف الصحيح يبقى كما هو، والطابور والفسح لا تتحول إلى حصص تدريسية.
 */
export function normalizePeriodId(periodValue: unknown): string {
  const raw = String(periodValue || '').trim().toLowerCase();
  if (!raw) return '';
  if (VALID_TEACHING_PERIOD_IDS.has(raw)) return raw;
  if (raw === 'p0' || raw.includes('طابور')) return 'p0';
  if (/^b\d+$/.test(raw) || raw.includes('فسح') || raw.includes('استراح')) return 'break';

  const labels: Record<string, string> = {
    'الحصة الأولى': 'p1', 'الحصة الاولى': 'p1', 'الحصة 1': 'p1', 'حصة 1': 'p1', 'الأولى': 'p1', 'الاولى': 'p1', '1': 'p1',
    'الحصة الثانية': 'p2', 'الحصة 2': 'p2', 'حصة 2': 'p2', 'الثانية': 'p2', '2': 'p2',
    'الحصة الثالثة': 'p3', 'الحصة 3': 'p3', 'حصة 3': 'p3', 'الثالثة': 'p3', '3': 'p3',
    'الحصة الرابعة': 'p4', 'الحصة 4': 'p4', 'حصة 4': 'p4', 'الرابعة': 'p4', '4': 'p4',
    'الحصة الخامسة': 'p5', 'الحصة 5': 'p5', 'حصة 5': 'p5', 'الخامسة': 'p5', '5': 'p5',
    'الحصة السادسة': 'p6', 'الحصة 6': 'p6', 'حصة 6': 'p6', 'السادسة': 'p6', '6': 'p6',
    'الحصة السابعة': 'p7', 'الحصة 7': 'p7', 'حصة 7': 'p7', 'السابعة': 'p7', '7': 'p7',
    'الحصة الثامنة': 'p8', 'الحصة 8': 'p8', 'حصة 8': 'p8', 'الثامنة': 'p8', '8': 'p8',
  };
  if (labels[raw]) return labels[raw];
  const match = raw.match(/(?:الحصة|حصة|period)\s*([1-8])/);
  return match ? `p${match[1]}` : raw;
}

/**
 * المفتاح الموحد الفريد لحصة دراسية: يمنع نهائياً تكرار الحصص لنفس الصف في نفس اليوم والحصة
 */
export function getTimetableSlotKey(item: { day?: string; periodId?: string; gradeClass?: string }): string {
  const normDay = normalizeDayName(item.day || '');
  const normPeriod = normalizePeriodId(item.periodId || '');
  const normClass = normalizeClassName(item.gradeClass || '');
  return `${normDay}__${normPeriod}__${normClass}`;
}

/**
 * إزالة أي تكرار بالجدول المدرسي وضمان وجود حصة واحدة فقط لكل صف في كل فترة ويوم
 */
export function deduplicateTimetable(items: ClassScheduleItem[]): ClassScheduleItem[] {
  if (!items || !Array.isArray(items) || items.length === 0) return [];
  const map = new Map<string, ClassScheduleItem>();
  for (const item of items) {
    if (!item || !item.day || !item.gradeClass || !item.teacher) continue;
    const normPeriod = normalizePeriodId(item.periodId);
    if (!VALID_TEACHING_PERIOD_IDS.has(normPeriod)) continue;
    const normDay = normalizeDayName(item.day);
    const normClass = normalizeClassName(item.gradeClass);
    const normTeacher = normalizeTeacherNameCanonical(item.teacher);
    const key = `${normDay}__${normPeriod}__${normClass}`;
    
    // إنشاء معرف ثابت قطعي للحصة في حال عدم وجوده
    const deterministicId = `tt_${normDay}_${normPeriod}_${normClass.replace(/[\/\s]/g, '-')}`;

    // حفظ الحصة المكتملة وتنظيف بياناتها
    map.set(key, {
      ...item,
      id: item.id || deterministicId,
      day: normDay,
      periodId: normPeriod,
      gradeClass: normClass,
      teacher: normTeacher,
      subject: (item.subject || '').trim(),
      room: (item.room || `قاعة ${normClass}`).trim(),
    });
  }
  return Array.from(map.values());
}
/**
 * تحليل ملف Excel أو CSV مع دعم أوراق عمل متعددة لأيام الأسبوع (Multi-Sheet) أو صفحة واحدة
 */
export async function parseExcelTimetableFile(file: File): Promise<ExcelParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer) {
          resolve({
            success: false,
            totalParsed: 0,
            items: [],
            detectedClassesCount: 0,
            daysSummary: {},
            message: 'تعذر قراءة محتوى الملف',
            errors: ['الملف فارغ أو تعذر الوصول إلى محتواه'],
          });
          return;
        }

        const workbook = XLSX.read(buffer, { type: 'binary', cellDates: true });
        const allParsedItems: ClassScheduleItem[] = [];
        const uniqueClasses = new Set<string>();
        const daysSummary: Record<string, number> = {
          'الأحد': 0,
          'الاثنين': 0,
          'الثلاثاء': 0,
          'الأربعاء': 0,
          'الخميس': 0,
        };

        /*
         * أولوية الاستيراد:
         * إذا وجدت ورقة "الجدول الشامل المسطح" فهي مصدر الحقيقة الوحيد،
         * ولا يجوز جمعها مع أوراق الأيام أو سجل الاحتياط حتى لا تتكرر الحصص.
         * عند غياب الورقة المسطحة فقط نعود إلى دعم الملفات القديمة متعددة الأوراق.
         */
        const FLAT_SHEET_NAME = 'الجدول الشامل المسطح';
        const NON_TIMETABLE_SHEETS = new Set<string>([
          'قائمة المعلمين حسب المواد',
          'سجل حصص الاحتياط',
          'احتياط مستبعد للمراجعة',
          'تعارضات الجدول للمراجعة',
          'خريطة معرفات الحصص',
        ]);

        const hasFlatSheet = workbook.SheetNames.some(
          (name) => name.trim() === FLAT_SHEET_NAME
        );

        const sheetNamesToParse = hasFlatSheet
          ? workbook.SheetNames.filter((name) => name.trim() === FLAT_SHEET_NAME)
          : workbook.SheetNames.filter(
              (name) => !NON_TIMETABLE_SHEETS.has(name.trim())
            );

        sheetNamesToParse.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          if (!worksheet) return;

          const defaultSheetDay = normalizeDayName(sheetName);
          const rawRows: Array<Record<string, unknown> | Array<unknown>> = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (rawRows.length < 2) return;

          const headers = (rawRows[0] as unknown[]).map((h) => String(h || '').trim());
          const dataRows = rawRows.slice(1) as unknown[][];

          // فحص هل الورقة عبارة عن جدول مصفوفة (صفوف فصول وأعمدة حصص)
          const periodColumnsIndexes: { periodId: string; colIdx: number; colName: string }[] = [];
          headers.forEach((h, idx) => {
            const lower = h.toLowerCase();
            if (
              lower.includes('حصة') ||
              lower.includes('period') ||
              /^[1-8]$/.test(lower) ||
              /^p[1-8]$/.test(lower) ||
              lower.includes('الأولى') ||
              lower.includes('الثانية') ||
              lower.includes('الثالثة') ||
              lower.includes('الرابعة') ||
              lower.includes('الخامسة') ||
              lower.includes('السادسة') ||
              lower.includes('السابعة') ||
              lower.includes('الثامنة')
            ) {
              const periodId = normalizePeriodId(h);
              if (VALID_TEACHING_PERIOD_IDS.has(periodId)) {
                periodColumnsIndexes.push({ periodId, colIdx: idx, colName: h });
              }
            }
          });

          const isMatrixFormat = periodColumnsIndexes.length >= 3;

          if (isMatrixFormat) {
            let classColIdx = headers.findIndex((h) =>
              h.includes('صف') || h.includes('فصل') || h.includes('شعبة') || h.includes('class') || h.includes('grade')
            );
            if (classColIdx === -1) classColIdx = 0;

            let dayColIdx = headers.findIndex((h) =>
              h.includes('يوم') || h.includes('day')
            );

            dataRows.forEach((row, rowIdx) => {
              const rawClass = String(row[classColIdx] || '').trim();
              if (!rawClass) return;
              const className = normalizeClassName(rawClass);
              if (!className) return;
              uniqueClasses.add(className);

              const rowDay = dayColIdx !== -1 && row[dayColIdx] 
                ? normalizeDayName(String(row[dayColIdx])) 
                : defaultSheetDay;

              periodColumnsIndexes.forEach((periodCol) => {
                const cellVal = String(row[periodCol.colIdx] || '').trim();
                if (!cellVal) return;

                let subject = cellVal;
                let teacher = 'معلم المادة';
                let room = `قاعة ${className}`;

                if (cellVal.includes('-')) {
                  const parts = cellVal.split('-').map((s) => s.trim());
                  subject = parts[0] || cellVal;
                  teacher = normalizeTeacherNameCanonical(parts[1] || 'معلم المادة');
                  if (parts[2]) room = parts[2];
                } else if (cellVal.includes('/')) {
                  const parts = cellVal.split('/').map((s) => s.trim());
                  subject = parts[0] || cellVal;
                  teacher = normalizeTeacherNameCanonical(parts[1] || 'معلم المادة');
                  if (parts[2]) room = parts[2];
                } else if (cellVal.includes('(')) {
                  const match = cellVal.match(/^(.*?)\((.*?)\)/);
                  if (match) {
                    subject = match[1].trim();
                    teacher = normalizeTeacherNameCanonical(match[2].trim());
                  }
                } else {
                  teacher = normalizeTeacherNameCanonical(teacher);
                }

                allParsedItems.push({
                  id: `tt-${rowDay}-${rowIdx}-${periodCol.periodId}`,
                  day: rowDay,
                  periodId: periodCol.periodId,
                  gradeClass: className,
                  subject: subject || 'مادة عامة',
                  teacher: teacher || 'معلم المادة',
                  room: room || 'القاعة المدرسية',
                });

                daysSummary[rowDay] = (daysSummary[rowDay] || 0) + 1;
              });
            });
          } else {
            // نمط القائمة المباشرة (Flat List)
            const colClass = headers.findIndex((h) => h.includes('صف') || h.includes('فصل') || h.includes('شعبة') || h.includes('class'));
            const colSubject = headers.findIndex((h) => h.includes('مادة') || h.includes('subject'));
            const colTeacher = headers.findIndex((h) => h.includes('معلم') || h.includes('مدرس') || h.includes('teacher'));
            const colPeriod = headers.findIndex((h) => h.includes('حصة') || h.includes('period'));
            const colDay = headers.findIndex((h) => h.includes('يوم') || h.includes('day'));
            const colRoom = headers.findIndex((h) => h.includes('قاعة') || h.includes('معمل') || h.includes('room'));

            dataRows.forEach((row, rowIdx) => {
              const rawClass = colClass !== -1 ? String(row[colClass] || '').trim() : '';
              if (!rawClass) return;
              const className = normalizeClassName(rawClass);
              if (!className) return;

              uniqueClasses.add(className);
              const subject = colSubject !== -1 ? String(row[colSubject] || 'مادة دراسية').trim() : 'مادة دراسية';
              const rawTeacher = colTeacher !== -1 ? String(row[colTeacher] || 'معلم الحصة').trim() : 'معلم الحصة';
              const teacher = normalizeTeacherNameCanonical(rawTeacher);
              const periodStr = colPeriod !== -1 ? String(row[colPeriod] || 'p1').trim() : 'p1';
              const periodId = normalizePeriodId(periodStr);
              if (!VALID_TEACHING_PERIOD_IDS.has(periodId)) return;
              const dayName = colDay !== -1 && row[colDay] 
                ? normalizeDayName(String(row[colDay])) 
                : defaultSheetDay;
              const room = colRoom !== -1 && row[colRoom] ? String(row[colRoom]).trim() : `قاعة ${className}`;

              allParsedItems.push({
                id: `tt-${dayName}-${rowIdx}`,
                day: dayName,
                periodId,
                gradeClass: className,
                subject,
                teacher,
                room,
              });

              daysSummary[dayName] = (daysSummary[dayName] || 0) + 1;
            });
          }
        });

        /*
         * إزالة أي تكرار بالجدول المستخرج وضمان حصة واحدة فريدة لكل فصل في الحصة واليوم
         */
        const normalizedParsedItems = deduplicateTimetable(allParsedItems);

        // إعادة حساب الإحصاءات من النتيجة النهائية بعد إزالة التكرار.
        uniqueClasses.clear();
        Object.keys(daysSummary).forEach((day) => {
          daysSummary[day] = 0;
        });
        normalizedParsedItems.forEach((item) => {
          uniqueClasses.add(item.gradeClass);
          daysSummary[item.day] = (daysSummary[item.day] || 0) + 1;
        });

        if (normalizedParsedItems.length === 0) {
          resolve({
            success: false,
            totalParsed: 0,
            items: [],
            detectedClassesCount: 0,
            daysSummary: {},
            message: 'لم يتم العثور على حصص دراسية قابلة للتحليل في الملف',
            errors: ['تأكد من وجود أعمدة: الصف، الحصة، المادة، المعلم، وأيام الأسبوع'],
          });
          return;
        }

        const activeDaysText = Object.entries(daysSummary)
          .filter(([_, count]) => count > 0)
          .map(([day, count]) => `${day}: ${count} حصة`)
          .join(' ، ');

        resolve({
          success: true,
          totalParsed: normalizedParsedItems.length,
          items: normalizedParsedItems,
          detectedClassesCount: uniqueClasses.size,
          daysSummary,
          message: `تم بنجاح استيراد ${normalizedParsedItems.length} حصة دراسية لـ ${uniqueClasses.size} فصلاً عبر أيام الأسبوع (${activeDaysText})!`,
          errors: [],
        });
      } catch (err) {
        resolve({
          success: false,
          totalParsed: 0,
          items: [],
          detectedClassesCount: 0,
          daysSummary: {},
          message: 'حدث خطأ أثناء قراءة ملف الإكسل',
          errors: [String(err)],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        totalParsed: 0,
        items: [],
        detectedClassesCount: 0,
        daysSummary: {},
        message: 'خطأ في قراءة الملف من الجهاز',
        errors: ['فشلت قراءة الملف'],
      });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * تصدير وتحويل الجدول المدرسي كاملاً بتقسيمته المعتمدة لـ 32 فصلاً و 8 حصص مع قائمة المعلمين وتوزيع المواد وعكس الاحتياط في ملف Excel احترافي
 */
export function exportOfficialTimetableToExcel(
  customTimetable?: ClassScheduleItem[],
  customFileName?: string,
  substitutions?: Substitution[]
) {
  const timetableToExport = customTimetable && customTimetable.length > 0 ? customTimetable : OFFICIAL_TIMETABLE_ITEMS;
  const workbook = XLSX.utils.book_new();

  const periodsList = [
    { id: 'p1', col: 'الحصة 1' },
    { id: 'p2', col: 'الحصة 2' },
    { id: 'p3', col: 'الحصة 3' },
    { id: 'p4', col: 'الحصة 4' },
    { id: 'p5', col: 'الحصة 5' },
    { id: 'p6', col: 'الحصة 6' },
    { id: 'p7', col: 'الحصة 7' },
    { id: 'p8', col: 'الحصة 8' },
  ];

  // 1. أوراق عمل أيام الأسبوع الخمسة (الأحد إلى الخميس) بنظام المصفوفة للفصول والـ 8 حصص
  SCHOOL_WEEK_DAYS.forEach((dayName) => {
    const rows: Record<string, string>[] = [];

    SCHOOL_32_CLASSES.forEach((className) => {
      const rowObj: Record<string, string> = {
        'الصف الدراسي': className,
        'اليوم': dayName,
      };

      periodsList.forEach((p) => {
        const match = timetableToExport.find(
          (t) => t.day === dayName && t.gradeClass === className && String(t.periodId).trim().toLowerCase() === p.id
        );

        if (match) {
          // الجدول الأساسي يعرض المعلم الأصلي فقط، والاحتياط يبقى في سجل مستقل.
          rowObj[p.col] = `${match.subject} - ${normalizeTeacherNameCanonical(match.teacher)} - ${match.room || `قاعة ${className}`}`;
        } else {
          rowObj[p.col] = '—';
        }
      });

      rows.push(rowObj);
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 14 },
      { wch: 10 },
      { wch: 34 },
      { wch: 34 },
      { wch: 34 },
      { wch: 34 },
      { wch: 34 },
      { wch: 34 },
      { wch: 34 },
      { wch: 34 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, dayName);
  });

  // 2. ورقة قائمة وتوزيع المعلمين حسب المواد الدراسية مع النصاب الأسبوعي
  const teachersBySubj = getTeachersBySubject(timetableToExport);
  const teacherStats = calculateTeacherStats(timetableToExport, teachersBySubj);

  const teacherRows: Record<string, unknown>[] = [];
  let counter = 1;
  Object.entries(teachersBySubj).forEach(([subject, teachers]) => {
    teachers.forEach((teacher) => {
      const st = teacherStats[teacher];
      teacherRows.push({
        'م': counter++,
        'المادة الدراسية': subject,
        'اسم المعلم': teacher,
        'نصاب الحصص الأسبوعي': st ? `${st.totalPeriods} حصة` : '0 حصص',
        'الفصول المسندة إليه': st && st.classes.length > 0 ? st.classes.join(' ، ') : 'لا توجد حصص مسندة',
        'عدد الفصول': st ? st.classes.length : 0,
        'أيام الحصص': st && st.days.length > 0 ? st.days.join(' ، ') : 'كامل الأسبوع',
      });
    });
  });

  const wsTeachers = XLSX.utils.json_to_sheet(teacherRows);
  wsTeachers['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 24 },
    { wch: 20 },
    { wch: 35 },
    { wch: 12 },
    { wch: 28 },
  ];
  XLSX.utils.book_append_sheet(workbook, wsTeachers, 'قائمة المعلمين حسب المواد');

  // 3. ورقة سجل حصص الاحتياط والتكليفات إن وجدت
  if (substitutions && substitutions.length > 0) {
    const subRows = substitutions.filter((s) => s.status !== 'ملغي').map((s, idx) => ({
      'م': idx + 1,
      'اليوم': normalizeDayName(s.day || ''),
      'الحصة': normalizePeriodId(s.period),
      'الصف والفصل': normalizeClassName(s.gradeClass),
      'المادة الدراسية': s.subject,
      'المعلم الغائب': normalizeTeacherNameCanonical(s.absentTeacher),
      'المعلم البديل (المكلف)': normalizeTeacherNameCanonical(s.substituteTeacher),
      'حالة التكليف': s.status,
      'ملاحظات': s.notes || '',
    }));
    const wsSubs = XLSX.utils.json_to_sheet(subRows);
    wsSubs['!cols'] = [
      { wch: 6 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 20 },
      { wch: 24 },
      { wch: 24 },
      { wch: 16 },
      { wch: 30 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsSubs, 'سجل حصص الاحتياط');
  }

  // 4. ورقة الجدول المدرسي الشامل (قائمة مسطحة لكافة الحصص الـ 1280)
  const allRows = timetableToExport.map((t, idx) => ({
    'المعرف': t.id || `tt-${idx + 1}`,
    'اليوم': normalizeDayName(t.day),
    'الحصة': normalizePeriodId(t.periodId),
    'الصف والفصل': normalizeClassName(t.gradeClass),
    'المادة الدراسية': t.subject,
    'اسم المعلم الأساسي': normalizeTeacherNameCanonical(t.teacher),
    'حالة الاحتياط': 'حصة عادية',
    'المعلم الفعلي بالحصة': normalizeTeacherNameCanonical(t.teacher),
    'القاعة / المختبر': t.room || `قاعة ${normalizeClassName(t.gradeClass)}`,
  }));
  const wsAll = XLSX.utils.json_to_sheet(allRows);
  wsAll['!cols'] = [
    { wch: 16 },
    { wch: 12 },
    { wch: 10 },
    { wch: 14 },
    { wch: 22 },
    { wch: 24 },
    { wch: 24 },
    { wch: 24 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(workbook, wsAll, 'الجدول الشامل المسطح');

  const fileName = customFileName || 'الجدول_المدرسي_المعتمد_32_فصلا_وقائمة_المعلمين.xlsx';
  XLSX.writeFile(workbook, fileName);
}

/**
 * توليد وتنزيل قالب Excel متكامل يحتوي على أوراق عمل لجميع أيام الأسبوع (الأحد إلى الخميس) لـ 32 فصلاً
 */
export function downloadSchoolExcelTemplate() {
  exportOfficialTimetableToExcel(OFFICIAL_TIMETABLE_ITEMS, 'قالب_الجدول_المدرسي_المعتمد_32_فصلا_صفوف_5_6_7_8.xlsx');
}

/**
 * توليد جدول كامل لجميع أيام الأسبوع (الأحد إلى الخميس) لـ 32 فصلاً وجميع الحصص الثمانية (إجمالي 1280 حصة أسبوعية!)
 */
export function generateFull32ClassesTimetable(): ClassScheduleItem[] {
  return OFFICIAL_TIMETABLE_ITEMS && OFFICIAL_TIMETABLE_ITEMS.length > 0
    ? [...OFFICIAL_TIMETABLE_ITEMS]
    : [];
}
