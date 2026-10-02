export interface Period {
  id: string;
  name: string;
  startTime: string; // "07:00"
  endTime: string;   // "07:45"
  isBreak: boolean;
  order: number;
}

export interface ClassScheduleItem {
  id: string;
  day: string; // e.g. "الأحد", "الاثنين", etc.
  periodId: string;
  period?: number;
  gradeClass: string;
  subject: string;
  teacher: string;
  room: string;
}

export type SchoolDay = 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
export type TeachingPeriodId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8';
export type SubstitutionStatus = 'مؤكد' | 'قيد الانتظار' | 'تم الحضور' | 'ملغي';

export interface Substitution {
  id: string;
  date: string; // YYYY-MM-DD
  day: SchoolDay | string; // محفوظ صراحة في السحابة، ولا يعتمد العرض على استنتاجه من التاريخ
  period: TeachingPeriodId | string; // القيمة المعتمدة p1 إلى p8، مع دعم السجلات القديمة أثناء القراءة
  gradeClass: string;
  absentTeacher: string;
  substituteTeacher: string;
  subject: string;
  status: SubstitutionStatus;
  notes?: string;
  updatedAt: string; // ISO 8601 ويستخدم لحسم أحدث تكليف عند تكرار اليوم والحصة والفصل
  acknowledgedAt?: string; // وقت وتاريخ استلام المعلم وتأكيده للتكليف بالثانية (ISO 8601)
  acknowledgedBy?: string; // اسم المعلم المؤكد للاستلام
}

export interface SubstitutionWriteResult {
  success: boolean;
  status?: 'success' | 'error' | 'not_found';
  count?: number;
  operation?: 'upsert' | 'bulk_upsert' | 'delete' | 'clear';
  id?: string;
  message: string;
}

export interface DaySubjectDuty {
  day: string; // e.g. "الأحد"
  subject: string; // e.g. "قسم الرياضيات" أو المادة المناوبة
  departmentLead?: string; // المعلم الأول / رئيس القسم (مثال: أ. عبد الله الغامدي)
  notes?: string;
}

export interface DutyItem {
  id: string;
  day: string; // "الأحد" .. "الخميس"
  location: string;
  leadTeacher: string;
  assistants: string; // Comma-separated or array
  timeSlot: string; // e.g. "طابور الصباح والاصطفاف", "الفسحة والصلاة", "الانصراف"
  notes?: string;
  subject?: string; // المادة أو القسم المناوب اختياري
}

export interface Announcement {
  id: string;
  text: string;
  type: 'info' | 'urgent' | 'hadith' | 'event';
  active: boolean;
  createdAt: string;
}

export type PeriodState = 
  | 'before_school' 
  | 'in_period' 
  | 'in_break' 
  | 'between_periods' 
  | 'after_school';

export interface PeriodProgress {
  state: PeriodState;
  activePeriod: Period | null;
  nextPeriod: Period | null;
  progressPercent: number; // 0 to 100
  timeRemainingMinutes: number;
  timeRemainingSeconds: number;
  elapsedMinutes: number;
  totalDurationMinutes: number;
  formattedRemaining: string; // e.g. "14:32"
}

export interface SchoolSettings {
  schoolName: string;
  ministryBadge: string;
  gasUrl: string;
  autoRefreshIntervalSeconds: number;
  playChimeOnPeriodChange: boolean;
  theme: 'light' | 'dark' | 'midnight' | 'emerald';
  displayMode: 'paging' | 'dense_grid' | 'continuous_scroll';
  pagingIntervalSeconds: number; // e.g. 12 seconds per page
  itemsPerPage: number; // 16 classes per page for 32 classes (2 pages)
  adminPin?: string; // رمز قفل لوحة الإدارة لمشرف النظام لمنع التلاعب
}

export interface AppStateData {
  substitutions: Substitution[];
  duties: DutyItem[];
  daySubjectDuties?: Record<string, { subject: string; departmentLead: string; notes?: string }>;
  periods: Period[];
  announcements: Announcement[];
  timetable: ClassScheduleItem[];
  teachersBySubject?: Record<string, string[]>;
  schoolName?: string;
  lastSyncTime: string | null;
}

