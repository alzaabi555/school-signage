import { Period, ClassScheduleItem, Substitution, DutyItem, Announcement, SchoolSettings } from '../types';
import { SCHOOL_32_CLASSES } from '../utils/excelUtils';
import {
  OFFICIAL_TIMETABLE_ITEMS,
  OFFICIAL_TEACHERS_LIST,
  OFFICIAL_SUBJECTS_LIST,
  OFFICIAL_CLASSES_32,
} from './officialTimetableData';

export const INITIAL_PERIODS: Period[] = [
  { id: 'p0', name: 'طابور الصباح', startTime: '07:10', endTime: '07:25', isBreak: true, order: 0 },
  { id: 'p1', name: 'الحصة الأولى', startTime: '07:25', endTime: '08:05', isBreak: false, order: 1 },
  { id: 'p2', name: 'الحصة الثانية', startTime: '08:10', endTime: '08:50', isBreak: false, order: 2 },
  { id: 'p3', name: 'الحصة الثالثة', startTime: '08:55', endTime: '09:35', isBreak: false, order: 3 },
  { id: 'p4', name: 'الحصة الرابعة', startTime: '09:40', endTime: '10:20', isBreak: false, order: 4 },
  { id: 'b1', name: 'الفسحة', startTime: '10:20', endTime: '10:45', isBreak: true, order: 5 },
  { id: 'p5', name: 'الحصة الخامسة', startTime: '10:45', endTime: '11:25', isBreak: false, order: 6 },
  { id: 'p6', name: 'الحصة السادسة', startTime: '11:30', endTime: '12:10', isBreak: false, order: 7 },
  { id: 'p7', name: 'الحصة السابعة', startTime: '12:15', endTime: '12:55', isBreak: false, order: 8 },
  { id: 'p8', name: 'الحصة الثامنة', startTime: '13:00', endTime: '13:40', isBreak: false, order: 9 },
];

export const INITIAL_CLASSES: string[] = OFFICIAL_CLASSES_32 || SCHOOL_32_CLASSES;

export const INITIAL_TEACHERS: string[] = OFFICIAL_TEACHERS_LIST;

export const INITIAL_SUBJECTS: string[] = OFFICIAL_SUBJECTS_LIST;

// جدول المدرسة العام الفعلي المعتمد من جدول aSc Timetables
export const INITIAL_TIMETABLE: ClassScheduleItem[] = OFFICIAL_TIMETABLE_ITEMS;

// تم حذف كافة البيانات الوهمية لتكون السجلات فارغة وجاهزة للبيانات الفعلية
export const INITIAL_SUBSTITUTIONS: Substitution[] = [];

export const INITIAL_DUTIES: DutyItem[] = [];

// توزيع المواد المناوبة على أيام الأسبوع (حسب المادة والمعلم الأول / رئيس القسم)
export const INITIAL_DAY_SUBJECT_DUTIES: Record<string, { subject: string; departmentLead: string; notes?: string }> = {
  'الأحد': { subject: 'التربية الإسلامية واللغة العربية', departmentLead: 'أ. سالم الهنائي', notes: 'الإشراف العام وتوزيع المواقع' },
  'الاثنين': { subject: 'الرياضيات', departmentLead: 'أ. سعيد الفزاري', notes: 'متابعة الاصطفاف والانصراف' },
  'الثلاثاء': { subject: 'العلوم', departmentLead: 'أ. وفاء السعيدي', notes: 'تنظيم الفسح والمصلى' },
  'الأربعاء': { subject: 'اللغة الإنجليزية والدراسات الاجتماعية', departmentLead: 'أ. ناجي اسماعيل', notes: 'متابعة هدوء الأدوار' },
  'الخميس': { subject: 'المهارات الرقمية والتربية الرياضية والفنية', departmentLead: 'أ. خالد المعمري', notes: 'إشراف نهاية الأسبوع والانصراف' },
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    text: 'أهلاً بكم في مدرسة الإبداع للبنين.. «طلب العلم فريضة» - فلنجعل يومنا حافلاً بالجد والتميز والاجتهاد.',
    type: 'hadith',
    active: true,
    createdAt: '2026-09-25',
  },
  {
    id: 'ann-2',
    text: 'تنبيه هام للطلاب: يرجى التوجه إلى مصلى المدرسة فور انتهاء الحصة الرابعة لأداء صلاة الظهر جماعة.',
    type: 'urgent',
    active: true,
    createdAt: '2026-09-25',
  },
  {
    id: 'ann-3',
    text: 'موعد مسابقة الأولمبياد الوطني للرياضيات والعلوم غداً الخميس في مركز مصادر التعلم الساعة 9:30 صباحاً.',
    type: 'event',
    active: true,
    createdAt: '2026-09-25',
  },
  {
    id: 'ann-4',
    text: 'نحيطكم علماً بأن تسليم مشاريع الحاسب الآلي والتقنية الرقمية ينتهي بنهاية دوام الأسبوع القادم.',
    type: 'info',
    active: true,
    createdAt: '2026-09-25',
  },
];

export const OFFICIAL_GAS_URL =
  'https://script.google.com/macros/s/AKfycbwoJE61blmoLoQKKdWUyzQt9dkmdJoi6941UGQ7mEtrTgXjP7QLhEbdTGsEJ3vpeNE8/exec';

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'الإبداع للبنين',
  ministryBadge: '',
  gasUrl: OFFICIAL_GAS_URL,
  autoRefreshIntervalSeconds: 60,
  playChimeOnPeriodChange: true,
  theme: 'light',
  displayMode: 'paging',
  pagingIntervalSeconds: 10,
  itemsPerPage: 20,
  adminPin: '1234',
};
