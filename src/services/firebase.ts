import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  query,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Substitution,
  DutyItem,
  Period,
  Announcement,
  ClassScheduleItem,
  SchoolSettings,
} from '../types';
import {
  deduplicateTimetable,
  normalizeDayName,
  normalizePeriodId,
  normalizeClassName,
} from '../utils/excelUtils';
import { sanitizeAndDeduplicatePeriods } from '../utils/timeUtils';

// تهيئة تطبيق Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying firestoreDatabaseId
// Using experimentalAutoDetectLongPolling prevents WebSocket WebChannel transport drops in iframe / proxy environments
export const db = initializeFirestore(
  app,
  {
    experimentalAutoDetectLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId
);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * معالج أخطاء Firestore المتوافق مع متطلبات الأمان
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * التحقق من الاتصال بخادم Firestore
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDoc(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable'))) {
      console.info('Firestore is operating in offline-first mode.');
      return false;
    }
    // إذا كان الخطأ مجرد أن المستند غير موجود فهو متصل بنجاح
    if (error instanceof Error && error.message.includes('not-found')) {
      return true;
    }
    return false;
  }
}

// تنفيذ فحص الاتصال الأولي فور الإقلاع كما هو مطلوب بالدليل الإرشادي
testFirestoreConnection().catch((err) => {
  console.info('Initial Firestore connection check completed:', err);
});

// دوال إدارة جلسة تسجيل الدخول
export async function signInQuickAdmin(): Promise<User | null> {
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.error('Quick admin sign in failed:', error);
    throw new Error('تعذر تسجيل الدخول السريع كمدير، يرجى استخدام البريد الإلكتروني أو رمز المرور المحلي.');
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: unknown) {
    console.error('Google Sign In failed:', error);
    const errObj = error as { code?: string; message?: string };
    const rawMsg = String(errObj?.message || error || '').toLowerCase();
    if (
      errObj?.code === 'auth/operation-not-supported-in-this-environment' ||
      errObj?.code === 'auth/disallowed-useragent' ||
      errObj?.code === 'auth/invalid-action' ||
      rawMsg.includes('invalid') ||
      rawMsg.includes('useragent') ||
      rawMsg.includes('popup')
    ) {
      throw new Error(
        'تسجيل الدخول المباشر بحساب Google مقيد أمنياً من قبل Google داخل تطبيقات الـ WebView على الأندرويد. يمكنك تسجيل الدخول بالبريد الإلكتروني أو الدخول السريع كمدير، أو الاعتماد على رمز مرور الإدارة (PIN) للمتابعة.'
      );
    }
    throw error;
  }
}

export async function signInWithEmail(email: string, pass: string): Promise<User | null> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return cred.user;
  } catch (error) {
    console.error('Email Sign In failed:', error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, pass: string): Promise<User | null> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    return cred.user;
  } catch (error) {
    console.error('Email Sign Up failed:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase Sign Out failed:', error);
    throw error;
  }
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean;
}

// دوال المزامنة والبيانات الخاصة بـ Firestore
export async function getSingleSubstitutionFromFirestore(id: string): Promise<Substitution | null> {
  const path = `substitutions/${id}`;
  try {
    const snap = await getDoc(doc(db, 'substitutions', id));
    if (snap.exists()) {
      return snap.data() as Substitution;
    }
    return null;
  } catch (error) {
    console.warn('Failed to fetch single substitution:', error);
    return null;
  }
}

export async function getSubstitutionsFromFirestore(): Promise<Substitution[]> {
  const path = 'substitutions';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as Substitution);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * الاشتراك اللحظي في تحديثات كولكشن الاحتياط (Real-Time Firestore Listener)
 * ينعكس فورياً على شاشات الممرات ولوحة الإدارة عند مسح الباركود
 */
export function subscribeToSubstitutions(callback: (subs: Substitution[]) => void): () => void {
  try {
    return onSnapshot(
      collection(db, 'substitutions'),
      (snapshot) => {
        const subs = snapshot.docs.map((d) => d.data() as Substitution);
        callback(subs);
      },
      (error) => {
        if (error.code === 'unavailable') {
          console.info('Firestore offline or reconnecting mode active.');
        } else {
          console.warn('Substitutions onSnapshot notice:', error.message || error);
        }
      }
    );
  } catch (error) {
    console.warn('subscribeToSubstitutions initialization error:', error);
    return () => {};
  }
}

export async function saveSubstitutionToFirestore(sub: Substitution): Promise<void> {
  const path = `substitutions/${sub.id}`;
  try {
    await setDoc(doc(db, 'substitutions', sub.id), stripUndefined(sub as unknown as Record<string, unknown>));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveBatchSubstitutionsToFirestore(subs: Substitution[]): Promise<void> {
  if (subs.length === 0) return;
  const path = 'substitutions';
  try {
    const batch = writeBatch(db);
    subs.forEach((sub) => {
      const ref = doc(db, 'substitutions', sub.id);
      batch.set(ref, stripUndefined(sub as unknown as Record<string, unknown>));
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSubstitutionFromFirestore(id: string): Promise<void> {
  const path = `substitutions/${id}`;
  try {
    await deleteDoc(doc(db, 'substitutions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearAllSubstitutionsFromFirestore(): Promise<void> {
  const path = 'substitutions';
  try {
    const snap = await getDocs(collection(db, path));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getDutiesFromFirestore(): Promise<DutyItem[]> {
  const path = 'duties';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as DutyItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveDutyToFirestore(duty: DutyItem): Promise<void> {
  const path = `duties/${duty.id}`;
  try {
    await setDoc(doc(db, 'duties', duty.id), stripUndefined(duty as unknown as Record<string, unknown>));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDutyFromFirestore(id: string): Promise<void> {
  const path = `duties/${id}`;
  try {
    await deleteDoc(doc(db, 'duties', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearAllDutiesFromFirestore(): Promise<void> {
  const path = 'duties';
  try {
    const snap = await getDocs(collection(db, path));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getAnnouncementsFromFirestore(): Promise<Announcement[]> {
  const path = 'announcements';
  try {
    const snap = await getDocs(collection(db, path));
    return snap.docs.map((d) => d.data() as Announcement);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveAnnouncementToFirestore(ann: Announcement): Promise<void> {
  const path = `announcements/${ann.id}`;
  try {
    await setDoc(doc(db, 'announcements', ann.id), stripUndefined(ann as unknown as Record<string, unknown>));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAnnouncementFromFirestore(id: string): Promise<void> {
  const path = `announcements/${id}`;
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function getTimetableDocId(item: { day?: string; periodId?: string; gradeClass?: string; id?: string }): string {
  const normDay = normalizeDayName(item.day || '');
  const normPeriod = normalizePeriodId(item.periodId || '');
  const normClass = normalizeClassName(item.gradeClass || '').replace(/[\/\s]/g, '-');
  if (normDay && normPeriod && normClass) {
    return `tt_${normDay}_${normPeriod}_${normClass}`;
  }
  const rawId = item.id ? String(item.id).trim() : `tt_${Date.now()}`;
  return rawId.replace(/[\/\s]/g, '_');
}

/**
 * تنظيف ذاتي للوثائق المكررة أو القديمة في Firestore في الخلفية
 */
async function cleanupOrphanTimetableDocs(
  allDocs: Array<{ id: string; ref: any }>,
  cleanItems: ClassScheduleItem[]
): Promise<void> {
  try {
    const canonicalDocIds = new Set<string>();
    cleanItems.forEach((item) => {
      canonicalDocIds.add(getTimetableDocId(item));
    });

    const docsToDelete = allDocs.filter((d) => !canonicalDocIds.has(d.id));
    if (docsToDelete.length === 0) return;

    const chunkSize = 250;
    for (let i = 0; i < docsToDelete.length; i += chunkSize) {
      const chunk = docsToDelete.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  } catch (err) {
    console.warn('Cleanup orphan timetable docs error:', err);
  }
}

export async function getTimetableFromFirestore(): Promise<ClassScheduleItem[]> {
  const path = 'timetable';
  try {
    const snap = await getDocs(collection(db, path));
    const allDocs = snap.docs;
    const rawItems = allDocs.map((d) => {
      const data = d.data() as ClassScheduleItem;
      return {
        ...data,
        id: data.id || d.id,
      };
    });

    // إزالة أي تكرار وفق مفتاح الحصة الفريد (اليوم، الحصة، الفصل)
    const cleanItems = deduplicateTimetable(rawItems);

    // إذا وجدنا في قاعدة البيانات تكرارات أو وثائق زائدة (مثل 2570 مقابل 1280)، ننظفها تلقائياً
    if (allDocs.length > cleanItems.length) {
      setTimeout(() => {
        cleanupOrphanTimetableDocs(allDocs, cleanItems).catch((err) =>
          console.warn('Background cleanup of duplicate timetable docs failed:', err)
        );
      }, 300);
    }

    return cleanItems;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * استبدال الجدول بالكامل في Firestore مع مسح الوثائق القديمة لضمان عدم التكرار
 */
export async function replaceTimetableInFirestore(items: ClassScheduleItem[]): Promise<void> {
  const cleanItems = deduplicateTimetable(items);
  if (cleanItems.length === 0) return;
  const path = 'timetable';
  try {
    // 1. جلب وثائق الجدول الحالية في Firestore لحذف ما لا ينتمي للجدول المعتمد الجديد
    const snap = await getDocs(collection(db, path));
    const validDocIds = new Set<string>();
    cleanItems.forEach((item) => {
      validDocIds.add(getTimetableDocId(item));
    });

    // 2. حذف الوثائق القديمة أو المكررة دفعة واحدة
    const docsToDelete = snap.docs.filter((d) => !validDocIds.has(d.id));
    const chunkSize = 250;
    for (let i = 0; i < docsToDelete.length; i += chunkSize) {
      const chunk = docsToDelete.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    // 3. كتابة السجلات النظيفة بمعرفات قطعية ثابتة وموحدة
    for (let i = 0; i < cleanItems.length; i += chunkSize) {
      const chunk = cleanItems.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((item) => {
        const cleanDocId = getTimetableDocId(item);
        const docRef = doc(db, 'timetable', cleanDocId);
        const cleanData = stripUndefined({
          id: cleanDocId,
          day: item.day || '',
          periodId: item.periodId || '',
          period: typeof item.period === 'number' ? item.period : undefined,
          gradeClass: item.gradeClass || '',
          subject: item.subject || '',
          teacher: item.teacher || '',
          room: item.room || '',
        });
        batch.set(docRef, cleanData);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveTimetableToFirestore(items: ClassScheduleItem[]): Promise<void> {
  if (!items || items.length === 0) return;
  // إذا كانت العملية تحديث جدول كامل (أكثر من 50 حصة)، نستخدم دالة الاستبدال والتنظيف الآمن
  if (items.length > 50) {
    return replaceTimetableInFirestore(items);
  }

  const cleanItems = deduplicateTimetable(items);
  const path = 'timetable';
  try {
    const chunkSize = 250;
    for (let i = 0; i < cleanItems.length; i += chunkSize) {
      const chunk = cleanItems.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((item) => {
        const cleanDocId = getTimetableDocId(item);
        const docRef = doc(db, 'timetable', cleanDocId);
        const cleanData = stripUndefined({
          id: cleanDocId,
          day: item.day || '',
          periodId: item.periodId || '',
          period: typeof item.period === 'number' ? item.period : undefined,
          gradeClass: item.gradeClass || '',
          subject: item.subject || '',
          teacher: item.teacher || '',
          room: item.room || '',
        });
        batch.set(docRef, cleanData);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTimetableItemFromFirestore(item: { day?: string; periodId?: string; gradeClass?: string; id?: string }): Promise<void> {
  const path = 'timetable';
  try {
    const docId = getTimetableDocId(item);
    await deleteDoc(doc(db, 'timetable', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deletePeriodFromFirestore(id: string): Promise<void> {
  const path = `periods/${id}`;
  try {
    await deleteDoc(doc(db, 'periods', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getPeriodsFromFirestore(): Promise<Period[]> {
  const path = 'periods';
  try {
    const snap = await getDocs(collection(db, path));
    const allDocs = snap.docs;
    const rawList: Period[] = [];
    allDocs.forEach((d) => {
      const data = d.data() as Period;
      const id = (data.id || d.id).trim();
      rawList.push({ ...data, id });
    });

    const cleanPeriods = sanitizeAndDeduplicatePeriods(rawList);

    // إذا وُجدت وثائق في Firestore بمعرفات غير معتمدة أو مكررة، يتم مسحها تلقائياً للمحافظة على نظافة قاعدة البيانات
    const cleanIds = new Set(cleanPeriods.map((p) => p.id));
    const rogueDocs = allDocs.filter((d) => !cleanIds.has(d.id));
    if (rogueDocs.length > 0) {
      setTimeout(async () => {
        try {
          const batch = writeBatch(db);
          rogueDocs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        } catch (e) {
          console.warn('Auto-deleted rogue period docs from Firestore:', e);
        }
      }, 100);
    }

    return cleanPeriods;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function savePeriodsToFirestore(periods: Period[]): Promise<Period[]> {
  const path = 'periods';
  try {
    const cleanPeriods = sanitizeAndDeduplicatePeriods(periods);
    const snap = await getDocs(collection(db, path));
    const validIds = new Set(cleanPeriods.map((p) => p.id));

    const batch = writeBatch(db);
    // حذف أي فترة في Firestore ليست موجودة في القائمة المعتمدة المنظفة
    snap.docs.forEach((d) => {
      if (!validIds.has(d.id)) {
        batch.delete(d.ref);
      }
    });

    // حفظ الفترات المحدثة
    cleanPeriods.forEach((p) => {
      batch.set(doc(db, 'periods', p.id), stripUndefined(p as unknown as Record<string, unknown>));
    });

    await batch.commit();
    return cleanPeriods;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return periods;
  }
}

export async function getSettingsFromFirestore(): Promise<Partial<SchoolSettings> | null> {
  const path = 'settings/main';
  try {
    const snap = await getDoc(doc(db, 'settings', 'main'));
    if (snap.exists()) {
      return snap.data() as Partial<SchoolSettings>;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveSettingsToFirestore(settings: SchoolSettings): Promise<void> {
  const path = 'settings/main';
  try {
    const cleanSettings = stripUndefined({
      schoolName: settings.schoolName || 'الإبداع للبنين',
      ministryBadge: settings.ministryBadge || '',
      gasUrl: settings.gasUrl || '',
      autoRefreshIntervalSeconds: Number(settings.autoRefreshIntervalSeconds) || 60,
      playChimeOnPeriodChange: Boolean(settings.playChimeOnPeriodChange),
      theme: settings.theme || 'light',
      displayMode: settings.displayMode || 'paging',
      pagingIntervalSeconds: Number(settings.pagingIntervalSeconds) || 10,
      itemsPerPage: Number(settings.itemsPerPage) || 20,
      adminPin: settings.adminPin || '1234',
    });
    await setDoc(doc(db, 'settings', 'main'), cleanSettings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveTeachersGuideToFirestore(teachersMap: Record<string, string[]>): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'teachers_guide'), { mapping: teachersMap, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Firestore saveTeachersGuide error:', error);
  }
}

export async function getTeachersGuideFromFirestore(): Promise<Record<string, string[]> | null> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'teachers_guide'));
    if (snap.exists() && snap.data()?.mapping) {
      return snap.data().mapping as Record<string, string[]>;
    }
    return null;
  } catch (error) {
    console.warn('Firestore getTeachersGuide error:', error);
    return null;
  }
}

export async function saveFemaleTeachersToFirestore(names: string[]): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'female_teachers'), { list: names, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Firestore saveFemaleTeachers error:', error);
  }
}

export async function getFemaleTeachersFromFirestore(): Promise<string[] | null> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'female_teachers'));
    if (snap.exists() && Array.isArray(snap.data()?.list)) {
      return snap.data().list as string[];
    }
    return null;
  } catch (error) {
    console.warn('Firestore getFemaleTeachers error:', error);
    return null;
  }
}

export async function saveCustomSubjectsToFirestore(subjects: string[], deletedSubjects: string[] = []): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'subjects'), { custom: subjects, deleted: deletedSubjects, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn('Firestore saveCustomSubjects error:', error);
  }
}

export async function getCustomSubjectsFromFirestore(): Promise<{ custom: string[]; deleted: string[] } | null> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'subjects'));
    if (snap.exists()) {
      const data = snap.data();
      return {
        custom: Array.isArray(data?.custom) ? data.custom : [],
        deleted: Array.isArray(data?.deleted) ? data.deleted : [],
      };
    }
    return null;
  } catch (error) {
    console.warn('Firestore getCustomSubjects error:', error);
    return null;
  }
}

/**
 * رفع ومزامنة كافة بيانات المدرسة الحالية إلى Firebase Firestore دفعة واحدة
 */
export async function uploadAllStateToFirestore(
  state: {
    substitutions: Substitution[];
    duties: DutyItem[];
    periods: Period[];
    announcements: Announcement[];
    timetable: ClassScheduleItem[];
  },
  settings: SchoolSettings
): Promise<{
  subsCount: number;
  dutiesCount: number;
  timetableCount: number;
  periodsCount: number;
  announcementsCount: number;
}> {
  // 1. الإعدادات
  await saveSettingsToFirestore(settings);

  // 2. الفترات والمواقيت
  if (state.periods.length > 0) {
    await savePeriodsToFirestore(state.periods);
  }

  // 3. الاحتياط
  if (state.substitutions.length > 0) {
    await saveBatchSubstitutionsToFirestore(state.substitutions);
  }

  // 4. المناوبة
  if (state.duties.length > 0) {
    const batch = writeBatch(db);
    state.duties.forEach((d) => {
      const cleanId = String(d.id || `duty_${Date.now()}`).replace(/\//g, '-');
      batch.set(doc(db, 'duties', cleanId), stripUndefined(d as unknown as Record<string, unknown>));
    });
    await batch.commit();
  }

  // 5. الإعلانات
  if (state.announcements.length > 0) {
    const batch = writeBatch(db);
    state.announcements.forEach((a) => {
      const cleanId = String(a.id || `ann_${Date.now()}`).replace(/\//g, '-');
      batch.set(doc(db, 'announcements', cleanId), stripUndefined(a as unknown as Record<string, unknown>));
    });
    await batch.commit();
  }

  // 6. الجدول المدرسي (32 فصلاً)
  if (state.timetable.length > 0) {
    await saveTimetableToFirestore(state.timetable);
  }

  // 7. دليل المعلمين حسب المواد، قائمة المعلمات، وقائمة المواد المعتمدة
  try {
    const rawGuide = localStorage.getItem('school_signage_teachers_by_subject');
    if (rawGuide) {
      const parsed = JSON.parse(rawGuide);
      if (parsed && typeof parsed === 'object') {
        await saveTeachersGuideToFirestore(parsed);
      }
    }
  } catch {}

  try {
    const rawFemale = localStorage.getItem('school_signage_female_teachers');
    if (rawFemale) {
      const parsed = JSON.parse(rawFemale);
      if (Array.isArray(parsed)) {
        await saveFemaleTeachersToFirestore(parsed);
      }
    }
  } catch {}

  try {
    const rawCustom = localStorage.getItem('school_signage_custom_subjects');
    const rawDeleted = localStorage.getItem('school_signage_deleted_subjects');
    const custom = rawCustom ? JSON.parse(rawCustom) : [];
    const deleted = rawDeleted ? JSON.parse(rawDeleted) : [];
    if (Array.isArray(custom) && custom.length > 0) {
      await saveCustomSubjectsToFirestore(custom, Array.isArray(deleted) ? deleted : []);
    }
  } catch {}

  return {
    subsCount: state.substitutions.length,
    dutiesCount: state.duties.length,
    timetableCount: state.timetable.length,
    periodsCount: state.periods.length,
    announcementsCount: state.announcements.length,
  };
}

