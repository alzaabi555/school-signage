import { Substitution, ClassScheduleItem } from '../types';
import { normalizeTeacherNameCanonical } from './excelUtils';

export const STORAGE_FEMALE_TEACHERS = 'school_signage_female_teachers';
export const STORAGE_DISPLAY_AUDIENCE_MODE = 'school_display_audience_mode';

export type DisplayAudienceMode = 'general' | 'assistant';

/**
 * جلب قائمة أسماء المعلمات المحفوظة محلياً
 */
export function getStoredFemaleTeachers(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_FEMALE_TEACHERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((name) => String(name || '').trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * حفظ قائمة أسماء المعلمات محلياً
 */
export function setStoredFemaleTeachers(names: string[]): void {
  try {
    const unique = Array.from(new Set(names.map((n) => String(n || '').trim()).filter(Boolean)));
    localStorage.setItem(STORAGE_FEMALE_TEACHERS, JSON.stringify(unique));
  } catch {}
}

/**
 * جلب وضع العرض المحفوظ (عام أو وضع المديرة المساعدة)
 */
export function getStoredAudienceMode(): DisplayAudienceMode {
  try {
    const saved = localStorage.getItem(STORAGE_DISPLAY_AUDIENCE_MODE);
    return saved === 'assistant' ? 'assistant' : 'general';
  } catch {
    return 'general';
  }
}

/**
 * حفظ وضع العرض
 */
export function setStoredAudienceMode(mode: DisplayAudienceMode): void {
  try {
    localStorage.setItem(STORAGE_DISPLAY_AUDIENCE_MODE, mode);
  } catch {}
}

/**
 * بناء Set بالأسماء القياسية للمعلمات لتسريع الفحص بدقة O(1)
 */
export function buildFemaleTeachersCanonicalSet(names?: string[]): Set<string> {
  const list = names && names.length > 0 ? names : getStoredFemaleTeachers();
  const set = new Set<string>();
  list.forEach((n) => {
    const canonical = normalizeTeacherNameCanonical(n);
    if (canonical) set.add(canonical);
  });
  return set;
}

/**
 * فحص ما إذا كان اسم المعلم يطابق إحدى المعلمات
 */
export function isFemaleTeacherName(name: unknown, femaleSet: Set<string>): boolean {
  if (!name || femaleSet.size === 0) return false;
  const canonical = normalizeTeacherNameCanonical(name);
  return femaleSet.has(canonical);
}

/**
 * فحص ما إذا كان تكليف الاحتياط يخص إحدى المعلمات (سواء كمعلمة غائبة أو معلمة بديلة مكلفة)
 */
export function isFemaleSubstitution(sub: Substitution, femaleSet: Set<string>): boolean {
  if (!sub || femaleSet.size === 0) return false;
  const isAbsentFemale = isFemaleTeacherName(sub.absentTeacher, femaleSet);
  const isSubstituteFemale = isFemaleTeacherName(sub.substituteTeacher, femaleSet);
  return isAbsentFemale || isSubstituteFemale;
}

/**
 * فحص ما إذا كانت الحصة التدريسية تخص المعلمات
 * (سواء المعلمة الأصلية أو إذا وُجد احتياط بديل لمعلمة)
 */
export function isFemaleClassLesson(
  item: ClassScheduleItem,
  femaleSet: Set<string>,
  sub?: Substitution | null
): boolean {
  if (femaleSet.size === 0) return false;
  if (isFemaleTeacherName(item.teacher, femaleSet)) return true;
  if (sub && isFemaleSubstitution(sub, femaleSet)) return true;
  return false;
}
