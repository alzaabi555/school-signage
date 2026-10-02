// جدول المدرسة العام المعتمد لجميع المعلمين (69 معلماً) والصفوف الـ 32
// مستخرج ومعتمد بالكامل من الجدول النهائي الرسمي لتوزيع المعلمين وحصصهم وفصولهم
import { ClassScheduleItem } from '../types';

export const OFFICIAL_TEACHERS_BY_SUBJECT: Record<string, string[]> = {
  "التربية الإسلامية": [
    "سالم الهنائي",
    "خليفه المحيرزي",
    "هلال ال عبدالسلام",
    "هلال الزعابي",
    "محمد الشلبي",
    "فارس الخالدي",
    "ابراهيم المعمري",
    "علي الفريد",
    "سامي الزعابي"
  ],
  "اللغة العربية": [
    "سامي الزعابي",
    "عبدالله البريكي",
    "حسن البريكي",
    "سلطان الروشدي",
    "عبدالعزيز السعيدي",
    "محمد المزيني",
    "حمد السعيدي",
    "سلطان السعيدي",
    "بدر الحوسني",
    "سلطان القريني",
    "يوسف الحوسني"
  ],
  "الرياضيات": [
    "بدر القاسمي",
    "صالح الزعابي",
    "يوسف المرزوقي",
    "محمد الروشدي",
    "أسعد البلوشي",
    "فارس الفارسي",
    "يوسف اللوغاني",
    "محمد السعيدي",
    "علي المرزوقي",
    "أميرة الزيدية ر",
    "السعيدية اليقين ر",
    "ميرة البلوشية ر"
  ],
  "العلوم": [
    "راشد العبري",
    "سعيد الفزاري",
    "تركي العموري",
    "عزام الشحي",
    "عبدالله السعيدي",
    "حسين العجمي",
    "وفاء السعيدي ع",
    "عبير البادي ع",
    "بثينة الزيدية",
    "فاطمة الكعبي ع",
    "رشيد القريني"
  ],
  "اللغة الإنجليزية": [
    "علي الشيدي",
    "عمر المعمري",
    "محمد البريكي",
    "أنس المقبالي",
    "ناجي اسماعيل",
    "ماريا الذهلية",
    "أنوار الخنصورية",
    "عليا الزعابية",
    "صفية البلوشية",
    "نوف الزيدية"
  ],
  "الدراسات الاجتماعية": [
    "محمد البادي",
    "محسن المعمري",
    "ياسر العجمي",
    "سالم الشيدي",
    "متعب السعيدي",
    "محمد الزعابي",
    "سالم البادي"
  ],
  "تقنية المعلومات": [
    "خالد المعمري",
    "عبدالعزيز السعيدي (تقنية)",
    "هلال السناني"
  ],
  "التربية الموسيقية": [
    "عبدالهادي العجمي",
    "عبدالعزيز الوهيبي"
  ],
  "التربية البدنية": [
    "محمد الوهيبي",
    "محمد الفزاري",
    "مانع المعمري"
  ],
  "الفنون التشكيلية": [
    "عمر المحرزي",
    "يعرب البادري"
  ]
};

export const OFFICIAL_SUBJECTS_LIST: string[] = Object.keys(OFFICIAL_TEACHERS_BY_SUBJECT);

export const OFFICIAL_CLASSES_LIST: string[] = [
  '5/1', '5/2', '5/3', '5/4', '5/5', '5/6', '5/7', '5/8',
  '6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7', '6/8', '6/9',
  '7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7', '7/8',
  '8/1', '8/2', '8/3', '8/4', '8/5', '8/6', '8/7'
];

export const OFFICIAL_CLASSES_32: string[] = OFFICIAL_CLASSES_LIST;

export const OFFICIAL_TEACHERS_LIST: string[] = Object.values(OFFICIAL_TEACHERS_BY_SUBJECT).flat();

export const OFFICIAL_TIMETABLE_ITEMS: ClassScheduleItem[] = [
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-2"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-3"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-4"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-5"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-6"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-7"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-8"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-9"
  },
  {
    "teacher": "سالم الهنائي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-10"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-11"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-12"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-13"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-14"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-15"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-16"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-17"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-18"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-19"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-20"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-21"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-22"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-23"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-24"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-25"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-26"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-27"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-28"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-29"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-30"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-31"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-32"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-33"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-34"
  },
  {
    "teacher": "خليفه المحيرزي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-35"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-36"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-37"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-38"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-39"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-40"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-41"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-42"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-43"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-44"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-45"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-46"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-47"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-48"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-49"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-50"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-51"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-52"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-53"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-54"
  },
  {
    "teacher": "هلال ال عبدالسلام",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-55"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-56"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-57"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-58"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-59"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-60"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-61"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-62"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-63"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-64"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-65"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-66"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-67"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-68"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-69"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-70"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-71"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-72"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-73"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-74"
  },
  {
    "teacher": "هلال الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-75"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-76"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-77"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-78"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-79"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-80"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-81"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-82"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-83"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-84"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-85"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-86"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-87"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-88"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-89"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-90"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-91"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-92"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-93"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-94"
  },
  {
    "teacher": "محمد الشلبي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-95"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-96"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-97"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-98"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-99"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-100"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-101"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-102"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-103"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-104"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-105"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-106"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-107"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-108"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-109"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-110"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-111"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-112"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-113"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-114"
  },
  {
    "teacher": "فارس الخالدي",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-115"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-116"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-117"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-118"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-119"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-120"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-121"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-122"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-123"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-124"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-125"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-126"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-127"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-128"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-129"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-130"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-131"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-132"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-133"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-134"
  },
  {
    "teacher": "ابراهيم المعمري",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-135"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-136"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-137"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-138"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-139"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-140"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-141"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-142"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-143"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-144"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-145"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-146"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-147"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-148"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-149"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-150"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-151"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-152"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-153"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-154"
  },
  {
    "teacher": "علي الفريد",
    "subject": "التربية الإسلامية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-155"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "التربية الإسلامية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-156"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-157"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-158"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-159"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-160"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-161"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-162"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-163"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-164"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-165"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-166"
  },
  {
    "teacher": "سامي الزعابي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-167"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-168"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-169"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-170"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-171"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-172"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-173"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-174"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-175"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-176"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-177"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-178"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-179"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-180"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-181"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-182"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-183"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-184"
  },
  {
    "teacher": "عبدالله البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-185"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-186"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-187"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-188"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-189"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-190"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-191"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-192"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-193"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-194"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-195"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-196"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-197"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-198"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-199"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-200"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-201"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-202"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-203"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-204"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-205"
  },
  {
    "teacher": "حسن البريكي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-206"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-207"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-208"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-209"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-210"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-211"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-212"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-213"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-214"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-215"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-216"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-217"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-218"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-219"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-220"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-221"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-222"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-223"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-224"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-225"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-226"
  },
  {
    "teacher": "سلطان الروشدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-227"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-228"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-229"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-230"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-231"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-232"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-233"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-234"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-235"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-236"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-237"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-238"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-239"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-240"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-241"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-242"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-243"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-244"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-245"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-246"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-247"
  },
  {
    "teacher": "عبدالعزيز السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-248"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-249"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-250"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-251"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-252"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-253"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-254"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-255"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-256"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-257"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-258"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-259"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-260"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-261"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-262"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-263"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-264"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-265"
  },
  {
    "teacher": "محمد المزيني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-266"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-267"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-268"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-269"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-270"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-271"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-272"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-273"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-274"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-275"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-276"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-277"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-278"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-279"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-280"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-281"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-282"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-283"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-284"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-285"
  },
  {
    "teacher": "حمد السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-286"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-287"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-288"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-289"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-290"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-291"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-292"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-293"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-294"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-295"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-296"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-297"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-298"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-299"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-300"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-301"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-302"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-303"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-304"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-305"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-306"
  },
  {
    "teacher": "سلطان السعيدي",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-307"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-308"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-309"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-310"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-311"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-312"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-313"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-314"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-315"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-316"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-317"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-318"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-319"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-320"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-321"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-322"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-323"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-324"
  },
  {
    "teacher": "بدر الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-325"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-326"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-327"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-328"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-329"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-330"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-331"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-332"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-333"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-334"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-335"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-336"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-337"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-338"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-339"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-340"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-341"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-342"
  },
  {
    "teacher": "سلطان القريني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-343"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-344"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-345"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-346"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-347"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-348"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-349"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-350"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-351"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-352"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-353"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-354"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-355"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-356"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-357"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-358"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-359"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-360"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-361"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-362"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-363"
  },
  {
    "teacher": "يوسف الحوسني",
    "subject": "اللغة العربية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-364"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-365"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-366"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-367"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-368"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-369"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-370"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-371"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-372"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-373"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-374"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-375"
  },
  {
    "teacher": "بدر القاسمي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-376"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-377"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-378"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-379"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-380"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-381"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-382"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-383"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-384"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-385"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-386"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-387"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-388"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-389"
  },
  {
    "teacher": "صالح الزعابي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-390"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-391"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-392"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-393"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-394"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-395"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-396"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-397"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-398"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-399"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-400"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-401"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-402"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-403"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-404"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-405"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-406"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-407"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-408"
  },
  {
    "teacher": "يوسف المرزوقي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-409"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-410"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-411"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-412"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-413"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-414"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-415"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-416"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-417"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-418"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-419"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-420"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-421"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-422"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-423"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-424"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-425"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-426"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-427"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-428"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-429"
  },
  {
    "teacher": "محمد الروشدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-430"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-431"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-432"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-433"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-434"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-435"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-436"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-437"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-438"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-439"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-440"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-441"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-442"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-443"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-444"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-445"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-446"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-447"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-448"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-449"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-450"
  },
  {
    "teacher": "أسعد البلوشي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-451"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-452"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-453"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-454"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-455"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-456"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-457"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-458"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-459"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-460"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-461"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-462"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-463"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-464"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-465"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-466"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-467"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-468"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-469"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-470"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-471"
  },
  {
    "teacher": "فارس الفارسي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-472"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-473"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-474"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-475"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-476"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-477"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-478"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-479"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-480"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-481"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-482"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-483"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-484"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-485"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-486"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-487"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-488"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-489"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-490"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-491"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-492"
  },
  {
    "teacher": "يوسف اللوغاني",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-493"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-494"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-495"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-496"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-497"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-498"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-499"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-500"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-501"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-502"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-503"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-504"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-505"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-506"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-507"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-508"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-509"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-510"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-511"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-512"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-513"
  },
  {
    "teacher": "محمد السعيدي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-514"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-515"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-516"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-517"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-518"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-519"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-520"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-521"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-522"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-523"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-524"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-525"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-526"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-527"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-528"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-529"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-530"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-531"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-532"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-533"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-534"
  },
  {
    "teacher": "علي المرزوقي",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-535"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-536"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-537"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-538"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-539"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-540"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-541"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-542"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-543"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-544"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-545"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-546"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-547"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-548"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-549"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-550"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-551"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-552"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-553"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-554"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-555"
  },
  {
    "teacher": "أميرة الزيدية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-556"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-557"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-558"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-559"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-560"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-561"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-562"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-563"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-564"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-565"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-566"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-567"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-568"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-569"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-570"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-571"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-572"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-573"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-574"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-575"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-576"
  },
  {
    "teacher": "السعيدية اليقين ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-577"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-578"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-579"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-580"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-581"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-582"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-583"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-584"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-585"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-586"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-587"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-588"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-589"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-590"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-591"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-592"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-593"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-594"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-595"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-596"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-597"
  },
  {
    "teacher": "ميرة البلوشية ر",
    "subject": "الرياضيات",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-598"
  },
  {
    "teacher": "راشد العبري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-599"
  },
  {
    "teacher": "راشد العبري",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-600"
  },
  {
    "teacher": "راشد العبري",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-601"
  },
  {
    "teacher": "راشد العبري",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-602"
  },
  {
    "teacher": "راشد العبري",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-603"
  },
  {
    "teacher": "راشد العبري",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-604"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-605"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-606"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-607"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-608"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-609"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-610"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-611"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-612"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-613"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-614"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-615"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-616"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-617"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-618"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-619"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-620"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-621"
  },
  {
    "teacher": "سعيد الفزاري",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-622"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-623"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-624"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-625"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-626"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-627"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-628"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-629"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-630"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-631"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-632"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-633"
  },
  {
    "teacher": "تركي العموري",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-634"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-635"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-636"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-637"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-638"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-639"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-640"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-641"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-642"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-643"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-644"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-645"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-646"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-647"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-648"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-649"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-650"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-651"
  },
  {
    "teacher": "عزام الشحي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-652"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-653"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-654"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-655"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-656"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-657"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-658"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-659"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-660"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-661"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-662"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-663"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-664"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-665"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-666"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-667"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-668"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-669"
  },
  {
    "teacher": "عبدالله السعيدي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-670"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-671"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-672"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-673"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-674"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-675"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-676"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-677"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-678"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-679"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-680"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-681"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-682"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-683"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-684"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-685"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-686"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-687"
  },
  {
    "teacher": "حسين العجمي",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-688"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-689"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-690"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-691"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-692"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-693"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-694"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-695"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-696"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-697"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-698"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-699"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-700"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-701"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-702"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-703"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-704"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-705"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-706"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-707"
  },
  {
    "teacher": "وفاء السعيدي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-708"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-709"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-710"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-711"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-712"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-713"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-714"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-715"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-716"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-717"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-718"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-719"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-720"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-721"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-722"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-723"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-724"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-725"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-726"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-727"
  },
  {
    "teacher": "عبير البادي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-728"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-729"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-730"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-731"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-732"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-733"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-734"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-735"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-736"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-737"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-738"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-739"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-740"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-741"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-742"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-743"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-744"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-745"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-746"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-747"
  },
  {
    "teacher": "بثينة الزيدية",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-748"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-749"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-750"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-751"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-752"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-753"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-754"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-755"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-756"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-757"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-758"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-759"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-760"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-761"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-762"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-763"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-764"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-765"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-766"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-767"
  },
  {
    "teacher": "فاطمة الكعبي ع",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-768"
  },
  {
    "teacher": "رشيد القريني",
    "subject": "العلوم",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-769"
  },
  {
    "teacher": "رشيد القريني",
    "subject": "العلوم",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-770"
  },
  {
    "teacher": "رشيد القريني",
    "subject": "العلوم",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-771"
  },
  {
    "teacher": "رشيد القريني",
    "subject": "العلوم",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-772"
  },
  {
    "teacher": "رشيد القريني",
    "subject": "العلوم",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-773"
  },
  {
    "teacher": "علي الشيدي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-774"
  },
  {
    "teacher": "علي الشيدي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-775"
  },
  {
    "teacher": "علي الشيدي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-776"
  },
  {
    "teacher": "علي الشيدي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-777"
  },
  {
    "teacher": "علي الشيدي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-778"
  },
  {
    "teacher": "علي الشيدي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-779"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-780"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-781"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-782"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-783"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-784"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-785"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-786"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-787"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-788"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-789"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-790"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-791"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-792"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-793"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-794"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-795"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-796"
  },
  {
    "teacher": "عمر المعمري",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-797"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-798"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-799"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-800"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-801"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-802"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-803"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-804"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-805"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-806"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-807"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-808"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-809"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-810"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-811"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-812"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-813"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-814"
  },
  {
    "teacher": "محمد البريكي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-815"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-816"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-817"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-818"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-819"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-820"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-821"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-822"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-823"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-824"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-825"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-826"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-827"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-828"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-829"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-830"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-831"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-832"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-833"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-834"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-835"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-836"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-837"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-838"
  },
  {
    "teacher": "أنس المقبالي",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-839"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-840"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-841"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-842"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-843"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-844"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-845"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-846"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-847"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-848"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-849"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-850"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-851"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-852"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-853"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-854"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-855"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-856"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-857"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-858"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-859"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-860"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-861"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-862"
  },
  {
    "teacher": "ناجي اسماعيل",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-863"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-864"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-865"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-866"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-867"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-868"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-869"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-870"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-871"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-872"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-873"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-874"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-875"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-876"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-877"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-878"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-879"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-880"
  },
  {
    "teacher": "ماريا الذهلية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-881"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-882"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-883"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-884"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-885"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-886"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-887"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-888"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-889"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-890"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-891"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-892"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-893"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-894"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-895"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-896"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-897"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-898"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-899"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-900"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-901"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-902"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-903"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-904"
  },
  {
    "teacher": "أنوار الخنصورية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-905"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-906"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-907"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-908"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-909"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-910"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-911"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-912"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-913"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-914"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-915"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-916"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-917"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-918"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-919"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-920"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-921"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-922"
  },
  {
    "teacher": "عليا الزعابية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-923"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-924"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-925"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-926"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-927"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-928"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-929"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-930"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-931"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-932"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-933"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-934"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-935"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-936"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-937"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-938"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-939"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-940"
  },
  {
    "teacher": "صفية البلوشية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-941"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-942"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-943"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-944"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-945"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-946"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-947"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-948"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-949"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-950"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-951"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-952"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-953"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-954"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-955"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-956"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-957"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-958"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-959"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-960"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-961"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-962"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-963"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-964"
  },
  {
    "teacher": "نوف الزيدية",
    "subject": "اللغة الإنجليزية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-965"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-966"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-967"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-968"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-969"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-970"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-971"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-972"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-973"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-974"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-975"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-976"
  },
  {
    "teacher": "محمد البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-977"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-978"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-979"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-980"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-981"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-982"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-983"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-984"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-985"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-986"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-987"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-988"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-989"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-990"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-991"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-992"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-993"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-994"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-995"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-996"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-997"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-998"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-999"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-1000"
  },
  {
    "teacher": "محسن المعمري",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-1001"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1002"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1003"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1004"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1005"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1006"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1007"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1008"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1009"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1010"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1011"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1012"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1013"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1014"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1015"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1016"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1017"
  },
  {
    "teacher": "ياسر العجمي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1018"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1019"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1020"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1021"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1022"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1023"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1024"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1025"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1026"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1027"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1028"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1029"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1030"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1031"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1032"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1033"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1034"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1035"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1036"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1037"
  },
  {
    "teacher": "سالم الشيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1038"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1039"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1040"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1041"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1042"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1043"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1044"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1045"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1046"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1047"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1048"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1049"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1050"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1051"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1052"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1053"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1054"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1055"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1056"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1057"
  },
  {
    "teacher": "متعب السعيدي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1058"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1059"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1060"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1061"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1062"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1063"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1064"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1065"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1066"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1067"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1068"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1069"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1070"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1071"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1072"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1073"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1074"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1075"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1076"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1077"
  },
  {
    "teacher": "محمد الزعابي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1078"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1079"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1080"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1081"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1082"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1083"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1084"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1085"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1086"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1087"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1088"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1089"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1090"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1091"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1092"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1093"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1094"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1095"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1096"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1097"
  },
  {
    "teacher": "سالم البادي",
    "subject": "الدراسات الاجتماعية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1098"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1099"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1100"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1101"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1102"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1103"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1104"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1105"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1106"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1107"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1108"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-1109"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-1110"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-1111"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-1112"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1113"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1114"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-1115"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-1116"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1117"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1118"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1119"
  },
  {
    "teacher": "خالد المعمري",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1120"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1121"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1122"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1123"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1124"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1125"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1126"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1127"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1128"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1129"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1130"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1131"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1132"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1133"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1134"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1135"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1136"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1137"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1138"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1139"
  },
  {
    "teacher": "عبدالعزيز السعيدي (تقنية)",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1140"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-1141"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-1142"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1143"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1144"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1145"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1146"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-1147"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-1148"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1149"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1150"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-1151"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-1152"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1153"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1154"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1155"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1156"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-1157"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-1158"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-1159"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-1160"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1161"
  },
  {
    "teacher": "هلال السناني",
    "subject": "تقنية المعلومات",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1162"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1163"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1164"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1165"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1166"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الأربعاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-1167"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1168"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1169"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1170"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1171"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1172"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1173"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1174"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-1175"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1176"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1177"
  },
  {
    "teacher": "عبدالهادي العجمي",
    "subject": "التربية الموسيقية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-1178"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1179"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1180"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1181"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1182"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-1183"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1184"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1185"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-1186"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1187"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1188"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-1189"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1190"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1191"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الأحد",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-1192"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-1193"
  },
  {
    "teacher": "عبدالعزيز الوهيبي",
    "subject": "التربية الموسيقية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1194"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1195"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1196"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-1197"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-1198"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-1199"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1200"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-1201"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-1202"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1203"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1204"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1205"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1206"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1207"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1208"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1209"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1210"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1211"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1212"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1213"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1214"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-1215"
  },
  {
    "teacher": "محمد الوهيبي",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1216"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1217"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1218"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1219"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-1220"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1221"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1222"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1223"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1224"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1225"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1226"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1227"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1228"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-1229"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1230"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-1231"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1232"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1233"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1234"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1235"
  },
  {
    "teacher": "محمد الفزاري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-1236"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1237"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1238"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1239"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1240"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الخميس",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-1241"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1242"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1243"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1244"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-1245"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-1246"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1247"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-1248"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1249"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الثلاثاء",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1250"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1251"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1252"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-1253"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الاثنين",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1254"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1255"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1256"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-1257"
  },
  {
    "teacher": "مانع المعمري",
    "subject": "التربية البدنية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1258"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/8",
    "room": "قاعة 7/8",
    "id": "tt-official-1259"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "7/7",
    "room": "قاعة 7/7",
    "id": "tt-official-1260"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/1",
    "room": "قاعة 7/1",
    "id": "tt-official-1261"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/3",
    "room": "قاعة 7/3",
    "id": "tt-official-1262"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/4",
    "room": "قاعة 7/4",
    "id": "tt-official-1263"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الأربعاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "7/6",
    "room": "قاعة 7/6",
    "id": "tt-official-1264"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الأربعاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/7",
    "room": "قاعة 5/7",
    "id": "tt-official-1265"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الثلاثاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "7/2",
    "room": "قاعة 7/2",
    "id": "tt-official-1266"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "7/5",
    "room": "قاعة 7/5",
    "id": "tt-official-1267"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الثلاثاء",
    "period": 3,
    "periodId": "p3",
    "gradeClass": "5/6",
    "room": "قاعة 5/6",
    "id": "tt-official-1268"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/2",
    "room": "قاعة 5/2",
    "id": "tt-official-1269"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الاثنين",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "5/1",
    "room": "قاعة 5/1",
    "id": "tt-official-1270"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/3",
    "room": "قاعة 5/3",
    "id": "tt-official-1271"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "5/4",
    "room": "قاعة 5/4",
    "id": "tt-official-1272"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "5/8",
    "room": "قاعة 5/8",
    "id": "tt-official-1273"
  },
  {
    "teacher": "عمر المحرزي",
    "subject": "الفنون التشكيلية",
    "day": "الأحد",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "5/5",
    "room": "قاعة 5/5",
    "id": "tt-official-1274"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/1",
    "room": "قاعة 6/1",
    "id": "tt-official-1275"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "6/6",
    "room": "قاعة 6/6",
    "id": "tt-official-1276"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/7",
    "room": "قاعة 6/7",
    "id": "tt-official-1277"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الخميس",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "6/3",
    "room": "قاعة 6/3",
    "id": "tt-official-1278"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الأربعاء",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/8",
    "room": "قاعة 6/8",
    "id": "tt-official-1279"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الأربعاء",
    "period": 6,
    "periodId": "p6",
    "gradeClass": "8/6",
    "room": "قاعة 8/6",
    "id": "tt-official-1280"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الأربعاء",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "6/2",
    "room": "قاعة 6/2",
    "id": "tt-official-1281"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الثلاثاء",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/3",
    "room": "قاعة 8/3",
    "id": "tt-official-1282"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الثلاثاء",
    "period": 5,
    "periodId": "p5",
    "gradeClass": "6/9",
    "room": "قاعة 6/9",
    "id": "tt-official-1283"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الثلاثاء",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "6/4",
    "room": "قاعة 6/4",
    "id": "tt-official-1284"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الاثنين",
    "period": 8,
    "periodId": "p8",
    "gradeClass": "6/5",
    "room": "قاعة 6/5",
    "id": "tt-official-1285"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الاثنين",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/2",
    "room": "قاعة 8/2",
    "id": "tt-official-1286"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الاثنين",
    "period": 1,
    "periodId": "p1",
    "gradeClass": "8/4",
    "room": "قاعة 8/4",
    "id": "tt-official-1287"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الأحد",
    "period": 7,
    "periodId": "p7",
    "gradeClass": "8/5",
    "room": "قاعة 8/5",
    "id": "tt-official-1288"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الأحد",
    "period": 4,
    "periodId": "p4",
    "gradeClass": "8/7",
    "room": "قاعة 8/7",
    "id": "tt-official-1289"
  },
  {
    "teacher": "يعرب البادري",
    "subject": "الفنون التشكيلية",
    "day": "الأحد",
    "period": 2,
    "periodId": "p2",
    "gradeClass": "8/1",
    "room": "قاعة 8/1",
    "id": "tt-official-1290"
  }
];
