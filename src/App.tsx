import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Period,
  ClassScheduleItem,
  Substitution,
  DutyItem,
  Announcement,
  SchoolSettings,
  SubstitutionStatus,
} from './types';
import {
  loadLocalData,
  saveLocalData,
  fetchRemoteData,
  sendRemotePost,
  AppStateData,
  recordDeletedSubstitutionId,
  recordAllDeletedSubstitutionIds,
} from './services/apiService';
import {
  saveSubstitutionToFirestore,
  saveBatchSubstitutionsToFirestore,
  deleteSubstitutionFromFirestore,
  clearAllSubstitutionsFromFirestore,
  saveDutyToFirestore,
  deleteDutyFromFirestore,
  clearAllDutiesFromFirestore,
  saveAnnouncementToFirestore,
  deleteAnnouncementFromFirestore,
  savePeriodsToFirestore,
  saveTimetableToFirestore,
  replaceTimetableInFirestore,
  deleteTimetableItemFromFirestore,
  saveSettingsToFirestore,
  getSubstitutionsFromFirestore,
  subscribeToSubstitutions,
  getDutiesFromFirestore,
  getAnnouncementsFromFirestore,
  getPeriodsFromFirestore,
  getTimetableFromFirestore,
  getSettingsFromFirestore,
  uploadAllStateToFirestore,
  getTeachersGuideFromFirestore,
  getFemaleTeachersFromFirestore,
  getCustomSubjectsFromFirestore,
  getSingleSubstitutionFromFirestore,
} from './services/firebase';
import { calculatePeriodProgress, sanitizeAndDeduplicatePeriods } from './utils/timeUtils';
import {
  normalizePeriodId,
  VALID_TEACHING_PERIOD_IDS,
  normalizeTeacherNameCanonical,
  validateImportedTimetable,
  normalizeDayName,
  normalizeClassName,
  isSameTeacher,
  deduplicateTimetable,
} from './utils/excelUtils';
import { playSchoolChime } from './utils/soundUtils';
import { DisplayScreen } from './components/DisplayScreen/DisplayScreen';
import { MobileDisplayScreen } from './components/MobileView/MobileDisplayScreen';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminLockModal } from './components/common/AdminLockModal';
import { TeacherAcknowledgmentModal } from './components/Teacher/TeacherAcknowledgmentModal';
import { INITIAL_SETTINGS, OFFICIAL_GAS_URL } from './data/initialData';
import { getStoredFemaleTeachers } from './utils/femaleTeachersUtils';
import { FullSchoolBackup } from './utils/backupRestoreUtils';

export default function App() {
  // 0. حالة المصادقة الأمنية لمشرف النظام (PIN Lock) لمنع التلاعب
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('school_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [showAdminLockModal, setShowAdminLockModal] = useState<boolean>(false);
  const [femaleTeachers, setFemaleTeachers] = useState<string[]>(getStoredFemaleTeachers);

  // مزامنة فورية لقائمة المعلمات عند تعديلها في لوحة الإدارة أو التخزين المحلي
  useEffect(() => {
    const handleFemaleTeachersUpdated = () => {
      setFemaleTeachers(getStoredFemaleTeachers());
    };
    window.addEventListener('storage', handleFemaleTeachersUpdated);
    window.addEventListener('school_signage_female_teachers_updated', handleFemaleTeachersUpdated);
    return () => {
      window.removeEventListener('storage', handleFemaleTeachersUpdated);
      window.removeEventListener('school_signage_female_teachers_updated', handleFemaleTeachersUpdated);
    };
  }, []);
  const [ackSubId, setAckSubId] = useState<string | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'ack_sub' && params.get('id')) {
          return params.get('id');
        }
      }
    } catch {}
    return null;
  });

  // 1. طريقة العرض: شاشة العرض (display) أو لوحة المشرفين (admin)
  const [currentView, setCurrentView] = useState<'display' | 'admin'>(() => {
    try {
      const isAuth = sessionStorage.getItem('school_admin_authenticated') === 'true';
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.toLowerCase();
        if (hash.includes('admin') && isAuth) return 'admin';
      }
    } catch {}
    return 'display';
  });

  // وضع العرض المخصص: شاشة تلفزيون ذكية (tv) أو واجهة الهاتف المحمول (mobile)
  const [displayMode, setDisplayMode] = useState<'tv' | 'mobile'>(() => {
    try {
      const saved = localStorage.getItem('school_display_mode');
      if (saved === 'tv' || saved === 'mobile') return saved;
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        return 'mobile';
      }
      return 'tv';
    } catch {
      return 'tv';
    }
  });

  const handleSwitchToTvMode = () => {
    setDisplayMode('tv');
    try {
      localStorage.setItem('school_display_mode', 'tv');
    } catch {}
  };

  const handleSwitchToMobileMode = () => {
    setDisplayMode('mobile');
    try {
      localStorage.setItem('school_display_mode', 'mobile');
    } catch {}
  };

  // فحص أمني عند تغير رابط الهاش: إذا حاول أي شخص الدخول عبر رابط #admin نطلب منه رمز الأمان فوراً
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('admin')) {
        if (!isAdminAuthenticated) {
          setCurrentView('display');
          setShowAdminLockModal(true);
        } else {
          setCurrentView('admin');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuthenticated]);

  // دالة طلب الانتقال إلى لوحة المشرفين
  const handleRequestSwitchToAdmin = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
      if (typeof window !== 'undefined') window.location.hash = 'admin';
    } else {
      setShowAdminLockModal(true);
    }
  };

  // عند نجاح إدخال رمز الأمان
  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('school_admin_authenticated', 'true');
    } catch {}
    setShowAdminLockModal(false);
    setCurrentView('admin');
    if (typeof window !== 'undefined') window.location.hash = 'admin';
  };

  // دالة قفل اللوحة وتسجيل الخروج
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('school_admin_authenticated');
    } catch {}
    setCurrentView('display');
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('admin')) {
      window.location.hash = '';
    }
  };

  // 2. إعدادات المدرسة ورابط Google Apps Script
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem('school_signage_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.schoolName ||
          parsed.schoolName.includes('النخبة') ||
          parsed.schoolName.includes('32 فصلاً')
        ) {
          parsed.schoolName = 'الإبداع للبنين';
        }
        if (parsed.ministryBadge?.includes('وزارة التعليم') || parsed.ministryBadge?.includes('المملكة')) {
          parsed.ministryBadge = '';
        }
        // اعتماد رابط السحابة الرسمي إذا كان غير معين أو فارغ
        if (!parsed.gasUrl || parsed.gasUrl.trim() === '') {
          parsed.gasUrl = OFFICIAL_GAS_URL;
        }
        parsed.theme = 'light';
        localStorage.setItem('school_signage_settings', JSON.stringify(parsed));
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // 3. البيانات الأساسية للجدول والاحتياط والمناوبة
  const [stateData, setStateData] = useState<AppStateData>(() => loadLocalData());
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(stateData.lastSyncTime);
  const stateDataRef = useRef<AppStateData>(stateData);
  const substitutionWriteInProgressRef = useRef(false);
  useEffect(() => { stateDataRef.current = stateData; }, [stateData]);


  // 4. حالة الوقت الحي ومحاكي الوقت
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [simulatedOffsetMs, setSimulatedOffsetMs] = useState<number | null>(null);

  // 5. حالات الاتصال والمزامنة
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(() => !!(settings.gasUrl && settings.gasUrl.trim().startsWith('http')));

  // تتبع الحصة الحالية لتشغيل صوت الجرس عند الانتقال
  const lastActivePeriodIdRef = useRef<string | null>(null);

  // تحديث الساعة الحية كل ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // حساب الوقت الفعال (مع الأخذ بالاعتبار وقت المحاكاة إذا كان مفصلاً)
  const effectiveTime = React.useMemo(() => {
    if (simulatedOffsetMs !== null) {
      return new Date(currentTime.getTime() + simulatedOffsetMs);
    }
    return currentTime;
  }, [currentTime, simulatedOffsetMs]);

  // حساب حالة الحصة المباشرة
  const periodProgress = React.useMemo(() => {
    return calculatePeriodProgress(stateData.periods, effectiveTime);
  }, [stateData.periods, effectiveTime]);

  // تشغيل جرس الحصص عند بدء حصة جديدة تلقائياً
  useEffect(() => {
    const currentPeriodId = periodProgress.activePeriod ? periodProgress.activePeriod.id : null;
    if (
      lastActivePeriodIdRef.current &&
      currentPeriodId &&
      currentPeriodId !== lastActivePeriodIdRef.current
    ) {
      if (settings.playChimeOnPeriodChange) {
        playSchoolChime();
      }
    }
    lastActivePeriodIdRef.current = currentPeriodId;
  }, [periodProgress.activePeriod, settings.playChimeOnPeriodChange]);

  const substitutionKey = (sub: Substitution) =>
    `${normalizeDayName(sub.day)}:::${normalizePeriodId(sub.period)}:::${normalizeClassName(sub.gradeClass)}`;
  const substitutionTimestamp = (sub: Substitution): number => {
    const parsed = Date.parse(String(sub.updatedAt || sub.date || ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const mergeSubstitutions = (localItems: Substitution[], remoteItems: Substitution[]): Substitution[] => {
    const merged = new Map<string, Substitution>();
    [...remoteItems, ...localItems].forEach((item) => {
      if (!item || item.status === 'ملغي') return;
      const key = substitutionKey(item);
      const current = merged.get(key);
      if (!current || substitutionTimestamp(item) >= substitutionTimestamp(current)) merged.set(key, item);
    });
    return Array.from(merged.values());
  };

  // دالة المزامنة الصامتة في الخلفية (Silent Background Polling)
  const performSilentSync = useCallback(async (url: string) => {
    if (!url || !url.trim().startsWith('http')) {
      setIsOnline(false);
      return;
    }

    try {
      setIsRefreshing(true);
      const remoteData = await fetchRemoteData(url);
      if (remoteData) {
        setStateData((prev) => {
          const cleanRemotePeriods = sanitizeAndDeduplicatePeriods(remoteData.periods);
          // دمج ذكي يتفادى استبدال مراجع الكائنات في حال تطابق البيانات لمنع وميض الشاشة وإعادة بناء الحالات
          const timetableSame = prev.timetable.length === remoteData.timetable.length &&
            prev.timetable.every((item, i) => item.id === remoteData.timetable[i]?.id);
          const periodsSame = prev.periods.length === cleanRemotePeriods.length &&
            prev.periods.every((p, i) => p.id === cleanRemotePeriods[i]?.id && p.name === cleanRemotePeriods[i]?.name && p.startTime === cleanRemotePeriods[i]?.startTime && p.endTime === cleanRemotePeriods[i]?.endTime);
          
          const mergedSubstitutions = substitutionWriteInProgressRef.current
            ? prev.substitutions
            : mergeSubstitutions(prev.substitutions, remoteData.substitutions);
          const nextState = {
            ...remoteData,
            substitutions: mergedSubstitutions,
            timetable: timetableSame ? prev.timetable : remoteData.timetable,
            periods: periodsSame ? prev.periods : cleanRemotePeriods,
          };
          saveLocalData(nextState);
          return nextState;
        });
        setLastSyncTime(remoteData.lastSyncTime);
        setIsOnline(true);
      }
    } catch {
      // إذا كان الرابط غير متوفر حالياً أو انقطع الاتصال، يتم الاستمرار بالعمل على البيانات المحلية وقاعدة Firebase بكل سلاسة
      setIsOnline(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // جلب البيانات ومزامنة Firebase Firestore عند بدء التشغيل
  useEffect(() => {
    async function loadFirestoreInitialData() {
      try {
        const [remoteSubs, remoteDuties, remoteAnnouncements, remotePeriods, remoteTimetable, remoteSettings, remoteTeachersGuide, remoteFemaleTeachers, remoteSubjects] = await Promise.all([
          getSubstitutionsFromFirestore().catch(() => []),
          getDutiesFromFirestore().catch(() => []),
          getAnnouncementsFromFirestore().catch(() => []),
          getPeriodsFromFirestore().catch(() => []),
          getTimetableFromFirestore().catch(() => []),
          getSettingsFromFirestore().catch(() => null),
          getTeachersGuideFromFirestore().catch(() => null),
          getFemaleTeachersFromFirestore().catch(() => null),
          getCustomSubjectsFromFirestore().catch(() => null),
        ]);

        if (
          (remoteSubs && remoteSubs.length > 0) ||
          (remoteDuties && remoteDuties.length > 0) ||
          (remoteAnnouncements && remoteAnnouncements.length > 0) ||
          (remotePeriods && remotePeriods.length > 0) ||
          (remoteTimetable && remoteTimetable.length > 0)
        ) {
          setStateData((prev) => {
            const nextSubs = remoteSubs && remoteSubs.length > 0 ? mergeSubstitutions(prev.substitutions, remoteSubs) : prev.substitutions;
            const nextDuties = remoteDuties && remoteDuties.length > 0 ? remoteDuties : prev.duties;
            const nextAnnouncements = remoteAnnouncements && remoteAnnouncements.length > 0 ? remoteAnnouncements : prev.announcements;
            const nextPeriods = sanitizeAndDeduplicatePeriods(
              remotePeriods && remotePeriods.length > 0 ? remotePeriods : prev.periods
            );
            const nextTimetable = deduplicateTimetable(remoteTimetable && remoteTimetable.length > 0 ? remoteTimetable : prev.timetable);
            const nextState = {
              ...prev,
              substitutions: nextSubs,
              duties: nextDuties,
              announcements: nextAnnouncements,
              periods: nextPeriods,
              timetable: nextTimetable,
            };
            saveLocalData(nextState);
            return nextState;
          });
        } else {
          // قاعدة بيانات Firebase مهيأة وجديدة: نقوم بنشر وحفظ البيانات الحالية مباشرة في السحابة
          const local = loadLocalData();
          uploadAllStateToFirestore(local, settings).catch((e) => console.info('Initial auto-seed Firestore:', e));
        }

        if (remoteSettings) {
          setSettings((prev) => {
            const merged = { ...prev, ...remoteSettings };
            try {
              localStorage.setItem('school_signage_settings', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }

        // مزامنة دليل المعلمين السحابي، قائمة المعلمات، وقائمة المواد
        if (remoteTeachersGuide && typeof remoteTeachersGuide === 'object' && Object.keys(remoteTeachersGuide).length > 0) {
          try {
            localStorage.setItem('school_signage_teachers_by_subject', JSON.stringify(remoteTeachersGuide));
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('school_signage_teachers_updated', { detail: remoteTeachersGuide }));
            }, 100);
          } catch {}
        }

        if (remoteFemaleTeachers && Array.isArray(remoteFemaleTeachers) && remoteFemaleTeachers.length > 0) {
          try {
            localStorage.setItem('school_signage_female_teachers', JSON.stringify(remoteFemaleTeachers));
            setFemaleTeachers(remoteFemaleTeachers);
          } catch {}
        }

        if (remoteSubjects && remoteSubjects.custom && remoteSubjects.custom.length > 0) {
          try {
            localStorage.setItem('school_signage_custom_subjects', JSON.stringify(remoteSubjects.custom));
            if (remoteSubjects.deleted && remoteSubjects.deleted.length > 0) {
              localStorage.setItem('school_signage_deleted_subjects', JSON.stringify(remoteSubjects.deleted));
            }
          } catch {}
        }
      } catch (err) {
        console.info('Initial Firestore load info:', err);
      }
    }
    loadFirestoreInitialData();
  }, []);

  // التحقق من وجود رابط استلام تكليف عبر الباركود (?action=ack_sub&id=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const id = params.get('id');
    if (action === 'ack_sub' && id) {
      setAckSubId(id);
    }
  }, []);

  // الاستماع اللحظي إلى تحديثات الاحتياط من Firestore (Real-Time Synchronous Updates)
  useEffect(() => {
    const unsubscribe = subscribeToSubstitutions((remoteSubs) => {
      if (remoteSubs && remoteSubs.length > 0) {
        setStateData((prev) => {
          const merged = mergeSubstitutions(prev.substitutions, remoteSubs);
          const nextState = { ...prev, substitutions: merged };
          saveLocalData(nextState);
          return nextState;
        });
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // دالة تأكيد استلام المعلم للتكليف
  const handleAcknowledgeSubstitution = async (subId: string, notes?: string): Promise<boolean> => {
    try {
      let existing = stateData.substitutions.find((s) => s.id === subId);
      if (!existing) {
        const remote = await getSingleSubstitutionFromFirestore(subId);
        if (remote) existing = remote;
      }
      if (!existing) return false;

      const updated: Substitution = {
        ...existing,
        status: 'تم الحضور',
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy: existing.substituteTeacher,
        notes: notes ? (existing.notes ? `${existing.notes} | ${notes}` : notes) : existing.notes,
        updatedAt: new Date().toISOString(),
      };

      setStateData((prev) => {
        const exists = prev.substitutions.some((s) => s.id === subId);
        const nextSubs = exists
          ? prev.substitutions.map((s) => (s.id === subId ? updated : s))
          : [updated, ...prev.substitutions];
        const nextState = { ...prev, substitutions: nextSubs };
        saveLocalData(nextState);
        return nextState;
      });

      await saveSubstitutionToFirestore(updated);
      showFeedback(`تم اعتماد استلام التكليف بنجاح للأستاذ (${existing.substituteTeacher})`);
      return true;
    } catch (error) {
      console.error('Failed to acknowledge substitution:', error);
      showFeedback('حدث خطأ أثناء اعتماد التأكيد، يرجى المحاولة ثانية');
      return false;
    }
  };

  // دالة رفع ومزامنة كافة البيانات المحلية إلى Firebase Firestore بنقرة واحدة
  const handleUploadAllToFirebase = async (): Promise<{ success: boolean; message: string }> => {
    setIsSubmitting(true);
    try {
      const counts = await uploadAllStateToFirestore(stateData, settings);
      showFeedback(`تم بنجاح رفع البيانات إلى Firebase (${counts.timetableCount} حصة، ${counts.subsCount} احتياط)!`);
      return {
        success: true,
        message: `تم بنجاح رفع وتخزين كافة البيانات في Firebase Firestore (${counts.timetableCount} حصة جدول مدرسي، ${counts.subsCount} سجل احتياط، ${counts.dutiesCount} موقع مناوبة، ${counts.periodsCount} فترة وميقات، و ${counts.announcementsCount} إعلان)!`,
      };
    } catch (err) {
      const msg = `فشل الرفع إلى Firebase: ${err instanceof Error ? err.message : String(err)}`;
      showFeedback(msg);
      return {
        success: false,
        message: msg,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة استرداد وتطبيق النسخة الاحتياطية الشاملة بالكامل في التطبيق
  const handleBackupRestored = async (backup: FullSchoolBackup) => {
    try {
      if (backup.data.settings && Object.keys(backup.data.settings).length > 0) {
        setSettings(backup.data.settings);
      }
      const restoredState: AppStateData = {
        substitutions: backup.data.substitutions || [],
        duties: backup.data.duties || [],
        daySubjectDuties: backup.data.daySubjectDuties || stateData.daySubjectDuties || {},
        periods: backup.data.periods && backup.data.periods.length > 0 ? sanitizeAndDeduplicatePeriods(backup.data.periods) : stateData.periods,
        announcements: backup.data.announcements || [],
        timetable: backup.data.timetable || [],
        lastSyncTime: new Date().toISOString(),
      };
      setStateData(restoredState);
      if (backup.data.femaleTeachers && Array.isArray(backup.data.femaleTeachers)) {
        setFemaleTeachers(backup.data.femaleTeachers);
      }
      showFeedback(`تم بنجاح استرداد وتطبيق النسخة الاحتياطية (${backup.counts.timetableLessons} حصة، ${backup.counts.substitutions} احتياط) ومزامنة شاشات العرض!`);
    } catch (err) {
      showFeedback(`خطأ في تطبيق النسخة المستردة: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // جلب البيانات الأولية وجدولة التحديث الدوري في الخلفية (كل دقيقة بدون إعادة تحميل الصفحة)
  useEffect(() => {
    if (settings.gasUrl) {
      performSilentSync(settings.gasUrl);
    }

    const intervalSeconds = Math.max(30, settings.autoRefreshIntervalSeconds || 60);
    const syncInterval = setInterval(() => {
      if (settings.gasUrl) {
        performSilentSync(settings.gasUrl);
      }
    }, intervalSeconds * 1000);

    return () => clearInterval(syncInterval);
  }, [settings.gasUrl, settings.autoRefreshIntervalSeconds, performSilentSync]);

  // تعيين وقت تجريبي (محاكاة)
  const handleSetSimulatedTime = (targetDate: Date) => {
    const now = new Date();
    const offset = targetDate.getTime() - now.getTime();
    setSimulatedOffsetMs(offset);
  };

  const handleResetTime = () => {
    setSimulatedOffsetMs(null);
  };

  // تحديث الإعدادات ومزامنتها مع Firestore
  const handleUpdateSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    localStorage.setItem('school_signage_settings', JSON.stringify(newSettings));
    saveSettingsToFirestore(newSettings).catch((err) => console.warn('Firestore settings update error:', err));
    if (newSettings.gasUrl) {
      performSilentSync(newSettings.gasUrl);
    }
  };

  // إشعار بالحفظ
  const showFeedback = (msg: string) => {
    setSaveStatusMsg(msg);
    setTimeout(() => setSaveStatusMsg(null), 3500);
  };

  const normalizeTeacherName = (value: unknown): string =>
    String(value || '').trim().replace(/^أ\.\s*/, '').replace(/\s+/g, ' ');

  const validateSubstitution = (sub: Omit<Substitution, 'id'>): string | null => {
    const periodId = normalizePeriodId(sub.period);
    if (!VALID_TEACHING_PERIOD_IDS.has(periodId)) return 'معرف الحصة غير صحيح';
    const subDayNorm = normalizeDayName(sub.day);
    const subClassNorm = normalizeClassName(sub.gradeClass);

    const originalLessons = stateDataRef.current.timetable.filter((item) =>
      normalizeDayName(item.day) === subDayNorm &&
      normalizePeriodId(item.periodId) === periodId &&
      normalizeClassName(item.gradeClass) === subClassNorm
    );

    if (originalLessons.length > 0) {
      const conflict = stateDataRef.current.timetable.find((item) =>
        normalizeDayName(item.day) === subDayNorm &&
        normalizePeriodId(item.periodId) === periodId &&
        isSameTeacher(item.teacher, sub.substituteTeacher) &&
        normalizeClassName(item.gradeClass) !== subClassNorm
      );
      if (conflict) {
        return `المعلم البديل لديه حصة متزامنة في الفصل ${conflict.gradeClass}`;
      }
    }
    return null;
  };

  // إجراءات الاحتياط اليومي
  const handleAddSubstitution = async (sub: Omit<Substitution, 'id'>) => {
    const validationError = validateSubstitution(sub);
    if (validationError) { showFeedback(validationError); throw new Error(validationError); }
    const newSub: Substitution = { ...sub, id: `SUB-${Date.now()}`, day: normalizeDayName(sub.day), period: normalizePeriodId(sub.period), gradeClass: normalizeClassName(sub.gradeClass), updatedAt: new Date().toISOString() };
    setIsSubmitting(true); substitutionWriteInProgressRef.current = true;
    try {
      saveSubstitutionToFirestore(newSub).catch((err) => console.warn('Firestore saveSubstitution error:', err));
      if (settings.gasUrl) {
        const result = await sendRemotePost(settings.gasUrl, 'add_substitution', newSub);
        if (!result.success) throw new Error(result.message);
      }
      setStateData((previous) => {
        const updatedSubs = [newSub, ...previous.substitutions.filter((existing) => substitutionKey(existing) !== substitutionKey(newSub))];
        const nextState = { ...previous, substitutions: updatedSubs }; saveLocalData(nextState); return nextState;
      });
      showFeedback('تم حفظ الاحتياط ومزامنته بنجاح');
    } catch (error) { showFeedback(`فشل حفظ الاحتياط: ${error instanceof Error ? error.message : String(error)}`); throw error; }
    finally { substitutionWriteInProgressRef.current = false; setIsSubmitting(false); }
  };
  const handleBulkAddSubstitutions = async (subsList: Omit<Substitution, 'id'>[]) => {
    if (!subsList?.length) return;
    for (const sub of subsList) { const error = validateSubstitution(sub); if (error) { showFeedback(error); throw new Error(error); } }
    const now = Date.now();
    const newItems: Substitution[] = subsList.map((sub, index) => ({ ...sub, id: `SUB-${now}-${index}`, day: normalizeDayName(sub.day), period: normalizePeriodId(sub.period), gradeClass: normalizeClassName(sub.gradeClass), updatedAt: new Date(now + index).toISOString() }));
    setIsSubmitting(true); substitutionWriteInProgressRef.current = true;
    try {
      saveBatchSubstitutionsToFirestore(newItems).catch((err) => console.warn('Firestore saveBatchSubstitutions error:', err));
      if (settings.gasUrl) {
        const result = await sendRemotePost(settings.gasUrl, 'bulk_add_substitutions', newItems);
        if (!result.success) throw new Error(result.message);
        if (typeof result.count === 'number' && result.count !== newItems.length) throw new Error(`عدد السجلات المحفوظة سحابيًا (${result.count}) لا يطابق المطلوب (${newItems.length})`);
      }
      setStateData((previous) => {
        const keys = new Set(newItems.map(substitutionKey));
        const nextState = { ...previous, substitutions: [...newItems, ...previous.substitutions.filter((item) => !keys.has(substitutionKey(item)))] };
        saveLocalData(nextState); return nextState;
      });
      showFeedback(`تم حفظ وتوزيع عدد (${newItems.length}) حصص احتياط بنجاح`);
    } catch (error) { showFeedback(`فشل حفظ الاحتياط الجماعي: ${error instanceof Error ? error.message : String(error)}`); throw error; }
    finally { substitutionWriteInProgressRef.current = false; setIsSubmitting(false); }
  };
  const handleDeleteSubstitution = async (id: string) => {
    setIsSubmitting(true);
    recordDeletedSubstitutionId(id);
    deleteSubstitutionFromFirestore(id).catch((err) => console.warn('Firestore deleteSubstitution error:', err));
    const updatedSubs = stateData.substitutions.filter((s) => s.id !== id);
    const newState = { ...stateData, substitutions: updatedSubs };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        const res = await sendRemotePost(settings.gasUrl, 'delete_substitution', { id });
        showFeedback(res.message);
      } catch {
        showFeedback('تم حذف السجل محلياً بنجاح');
      }
    } else {
      showFeedback('تم حذف السجل بنجاح');
    }
    setIsSubmitting(false);
  };

  const handleUpdateSubstitutionStatus = async (id: string, status: SubstitutionStatus) => {
    const updatedSubs = stateData.substitutions.map((s) => (s.id === id ? { ...s, status } : s));
    const newState = { ...stateData, substitutions: updatedSubs };
    setStateData(newState);
    saveLocalData(newState);

    const subItem = updatedSubs.find((s) => s.id === id);
    if (subItem) {
      saveSubstitutionToFirestore(subItem).catch((err) => console.warn('Firestore updateSubstitutionStatus error:', err));
    }

    if (settings.gasUrl) {
      if (subItem) {
        await sendRemotePost(settings.gasUrl, 'add_substitution', subItem);
      }
    }
    showFeedback('تم تعديل حالة الاحتياط');
  };

  // إجراءات المناوبة
  const handleUpdateDuty = async (duty: DutyItem) => {
    setIsSubmitting(true);
    saveDutyToFirestore(duty).catch((err) => console.warn('Firestore saveDuty error:', err));
    const updatedDuties = stateData.duties.map((d) => (d.id === duty.id ? duty : d));
    const newState = { ...stateData, duties: updatedDuties };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      const res = await sendRemotePost(settings.gasUrl, 'update_duty', duty);
      showFeedback(res.message);
    } else {
      showFeedback('تم تحديث المناوبة محلياً');
    }
    setIsSubmitting(false);
  };

  const handleAddDuty = async (duty: Omit<DutyItem, 'id'>) => {
    setIsSubmitting(true);
    const newId = 'DUTY-' + Date.now().toString().slice(-6);
    const newDuty: DutyItem = { ...duty, id: newId };
    saveDutyToFirestore(newDuty).catch((err) => console.warn('Firestore addDuty error:', err));
    const updatedDuties = [...stateData.duties, newDuty];
    const newState = { ...stateData, duties: updatedDuties };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      const res = await sendRemotePost(settings.gasUrl, 'update_duty', newDuty);
      showFeedback(res.message);
    } else {
      showFeedback('تمت إضافة موقع المناوبة');
    }
    setIsSubmitting(false);
  };

  const handleDeleteDuty = async (id: string) => {
    setIsSubmitting(true);
    deleteDutyFromFirestore(id).catch((err) => console.warn('Firestore deleteDuty error:', err));
    const updatedDuties = stateData.duties.filter((d) => d.id !== id);
    const newState = { ...stateData, duties: updatedDuties };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        const res = await sendRemotePost(settings.gasUrl, 'delete_duty', { id });
        showFeedback(res.message);
      } catch {
        showFeedback('تم حذف موقع المناوبة محلياً');
      }
    } else {
      showFeedback('تم حذف موقع المناوبة');
    }
    setIsSubmitting(false);
  };

  const handleClearAllDuties = async () => {
    setIsSubmitting(true);
    clearAllDutiesFromFirestore().catch((err) => console.warn('Firestore clearAllDuties error:', err));
    const newState = { ...stateData, duties: [] };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        const res = await sendRemotePost(settings.gasUrl, 'clear_all_duties', {});
        showFeedback(res.message);
      } catch {
        showFeedback('تم مسح كافة سجلات المناوبة محلياً');
      }
    } else {
      showFeedback('تم مسح كافة سجلات المناوبة');
    }
    setIsSubmitting(false);
  };

  const handleUpdateDaySubjectDuty = async (
    day: string,
    subject: string,
    departmentLead: string,
    notes?: string
  ) => {
    setIsSubmitting(true);
    const updated = {
      ...stateData.daySubjectDuties,
      [day]: { subject, departmentLead, notes },
    };
    const newState = { ...stateData, daySubjectDuties: updated };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        await sendRemotePost(settings.gasUrl, 'update_day_subject_duty', { day, subject, departmentLead, notes });
      } catch (err) {
        console.warn('Failed to sync daySubjectDuty to GAS', err);
      }
    }
    showFeedback(`تم تحديث مادة ومناوبة يوم ${day}`);
    setIsSubmitting(false);
  };

  const handleClearAllSubstitutions = async () => {
    setIsSubmitting(true);
    const ids = stateData.substitutions.map((s) => s.id);
    recordAllDeletedSubstitutionIds(ids);
    clearAllSubstitutionsFromFirestore().catch((err) => console.warn('Firestore clearAllSubstitutions error:', err));
    const newState = { ...stateData, substitutions: [] };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        const res = await sendRemotePost(settings.gasUrl, 'clear_all_substitutions', {});
        showFeedback(res.message);
      } catch {
        showFeedback('تم مسح كافة سجلات الاحتياط محلياً');
      }
    } else {
      showFeedback('تم مسح كافة سجلات الاحتياط بنجاح');
    }
    setIsSubmitting(false);
  };

  // إجراءات الحصص والجدول
  const handleUpdatePeriods = async (newPeriods: Period[]) => {
    setIsSubmitting(true);
    const cleanPeriods = sanitizeAndDeduplicatePeriods(newPeriods);
    try {
      await savePeriodsToFirestore(cleanPeriods);
    } catch (err) {
      console.warn('Firestore savePeriods error:', err);
    }
    const newState = { ...stateData, periods: cleanPeriods };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        const res = await sendRemotePost(settings.gasUrl, 'update_periods', cleanPeriods);
        showFeedback(res.message || 'تم حفظ مواقيت الحصص ومزامنتها بنجاح مع Google Sheets');
      } catch (err) {
        console.error('Failed to sync periods to Google Sheets', err);
        showFeedback('تم حفظ المواقيت محلياً وقاعدة Firebase');
      }
    } else {
      showFeedback('تم حفظ مواعيد الحصص المحدثة بنجاح');
    }
    setIsSubmitting(false);
  };

  const handleAddTimetableItem = async (item: Omit<ClassScheduleItem, 'id'>) => {
    const newItem: ClassScheduleItem = { ...item, id: 'tt-' + Date.now().toString().slice(-6) };
    const updated = [...stateData.timetable, newItem];
    saveTimetableToFirestore([newItem]).catch((err) => console.warn('Firestore add timetable item error:', err));
    const newState = { ...stateData, timetable: updated };
    setStateData(newState);
    saveLocalData(newState);
    showFeedback('تمت إضافة الحصة للجدول');
  };

  const handleDeleteTimetableItem = async (id: string) => {
    const itemToDelete = stateData.timetable.find((t) => t.id === id);
    if (itemToDelete) {
      deleteTimetableItemFromFirestore(itemToDelete).catch((err) => console.warn('Firestore delete timetable item error:', err));
    }
    const updated = stateData.timetable.filter((t) => t.id !== id);
    const newState = { ...stateData, timetable: updated };
    setStateData(newState);
    saveLocalData(newState);
    showFeedback('تم حذف الحصة');
  };

  const handleBulkReplaceTimetable = async (
    items: ClassScheduleItem[]
  ): Promise<{ success: boolean; message: string; count?: number; operation?: string }> => {
    // التحقق الصارم قبل أي إجراء
    const validation = validateImportedTimetable(items, 32);
    if (!validation.valid) {
      const errMsg = `فشل التحقق من الجدول المستورد:\n${validation.errors.join('\n')}`;
      showFeedback('فشل التحقق من الجدول المستورد، لم يتم تغيير الجدول القديم');
      return { success: false, message: errMsg };
    }

    const cleanItems = deduplicateTimetable(
      items.map((item) => ({
        ...item,
        periodId: normalizePeriodId(item.periodId),
        teacher: normalizeTeacherNameCanonical(item.teacher),
        gradeClass: normalizeClassName(item.gradeClass),
        day: normalizeDayName(item.day),
      }))
    );

    setIsSubmitting(true);
    // استبدال وتنظيف قاعدة بيانات Firestore ومسح أي سجلات قديمة أو مكررة فوراً
    replaceTimetableInFirestore(cleanItems).catch((err) => console.warn('Firestore bulk timetable error:', err));

    try {
      // إذا كان رابط Google Apps Script متاحاً، يتم الرفع أولاً والتحقق من الاستجابة السحابية
      if (settings.gasUrl && settings.gasUrl.trim().startsWith('http')) {
        const res = await sendRemotePost(settings.gasUrl, 'bulk_update_timetable', cleanItems);

        // التحقق الصارم من استجابة السحابة
        if (!res.success || res.count !== cleanItems.length || res.operation !== 'replace') {
          const errMsg =
            res.message ||
            'فشلت مزامنة الجدول مع Google Sheets أو لم يتطابق عدد السجلات المكتوبة في السحابة مع عدد حصص الجدول المستورد.';
          showFeedback(`خطأ سحابي: ${errMsg}`);
          setIsSubmitting(false);
          return {
            success: false,
            message: errMsg,
          };
        }
      }

      // تحديث الحالة المحلية بعد نجاح السحابة فقط (أو محلياً إذا لم يكن هناك رابط سحابي)
      const nextState = {
        ...stateData,
        timetable: cleanItems,
      };
      setStateData(nextState);
      saveLocalData(nextState);

      const successMsg = settings.gasUrl
        ? `تم بنجاح استبدال الجدول ومزامنته مع Google Sheets بالكامل (${cleanItems.length} حصة لـ 32 فصلاً)!`
        : `تم بنجاح استبدال الجدول بالكامل محلياً (${cleanItems.length} حصة لـ 32 فصلاً)!`;

      showFeedback(successMsg);
      setIsSubmitting(false);

      return {
        success: true,
        count: cleanItems.length,
        operation: 'replace',
        message: successMsg,
      };
    } catch (err) {
      setIsSubmitting(false);
      const errMsg = err instanceof Error ? err.message : String(err);
      showFeedback(`حدث خطأ أثناء استبدال الجدول: ${errMsg}`);
      return {
        success: false,
        message: errMsg,
      };
    }
  };

  // إجراءات الإعلانات
  const handleAddAnnouncement = async (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    const newId = 'ANN-' + Date.now().toString().slice(-6);
    const newAnn: Announcement = {
      ...ann,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveAnnouncementToFirestore(newAnn).catch((err) => console.warn('Firestore add announcement error:', err));
    const updated = [newAnn, ...stateData.announcements];
    const newState = { ...stateData, announcements: updated };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      const res = await sendRemotePost(settings.gasUrl, 'add_announcement', newAnn);
      showFeedback(res.message);
    } else {
      showFeedback('تم نشر الإعلان');
    }
    setIsSubmitting(false);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    deleteAnnouncementFromFirestore(id).catch((err) => console.warn('Firestore delete announcement error:', err));
    const updated = stateData.announcements.filter((a) => a.id !== id);
    const newState = { ...stateData, announcements: updated };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        const res = await sendRemotePost(settings.gasUrl, 'delete_announcement', { id });
        showFeedback(res.message);
      } catch {
        showFeedback('تم حذف الإعلان محلياً');
      }
    } else {
      showFeedback('تم حذف الإعلان');
    }
  };

  const handleToggleAnnouncementActive = async (id: string, active: boolean) => {
    const updated = stateData.announcements.map((a) => (a.id === id ? { ...a, active } : a));
    const annItem = updated.find((a) => a.id === id);
    if (annItem) {
      saveAnnouncementToFirestore(annItem).catch((err) => console.warn('Firestore toggle announcement error:', err));
    }
    const newState = { ...stateData, announcements: updated };
    setStateData(newState);
    saveLocalData(newState);

    if (settings.gasUrl) {
      try {
        await sendRemotePost(settings.gasUrl, 'toggle_announcement', { id, active });
      } catch (err) {
        console.warn('Failed to toggle announcement in GAS', err);
      }
    }
  };

  // اختبار الاتصال بـ Google Apps Script
  const handleTestConnection = async (): Promise<boolean> => {
    if (!settings.gasUrl) return false;
    try {
      const testRes = await fetch(`${settings.gasUrl.trim()}${settings.gasUrl.includes('?') ? '&' : '?'}action=ping&_t=${Date.now()}`);
      if (!testRes.ok) return false;
      const json = await testRes.json();
      const success = json.status === 'success';
      if (success) {
        setIsOnline(true);
      }
      return success;
    } catch {
      // تجربة جلب البيانات كاختبار إضافي
      try {
        const fullData = await fetchRemoteData(settings.gasUrl);
        if (fullData) {
          setIsOnline(true);
          return true;
        }
      } catch (err) {
        console.warn('Ping failed', err);
      }
      return false;
    }
  };

  const handleForceSync = async () => {
    if (settings.gasUrl) {
      await performSilentSync(settings.gasUrl);
      showFeedback('تمت المزامنة بنجاح!');
    } else {
      showFeedback('يرجى حفظ رابط Google Apps Script أولاً');
    }
  };

  // إذا دخل المعلم عبر رابط الباركود لتأكيد استلام الاحتياط، يتم إظهار شاشة مستقلة ومحمية بالكامل
  // تمنع المعلم تماماً من الوصول لبقية جدول المدرسة أو لوحة الإدارة أو حصص المعلمين الآخرين
  if (ackSubId) {
    const targetSub = stateData.substitutions.find((s) => s.id === ackSubId) || null;
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-800 font-['Cairo',sans-serif] flex items-center justify-center p-3 sm:p-6">
        <TeacherAcknowledgmentModal
          subId={ackSubId}
          substitution={targetSub}
          schoolName={settings.schoolName}
          isOpen={true}
          onConfirm={handleAcknowledgeSubstitution}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800 font-['Cairo',sans-serif]">
      {currentView === 'display' ? (
        displayMode === 'mobile' ? (
          <MobileDisplayScreen
            settings={settings}
            periodProgress={periodProgress}
            timetable={stateData.timetable}
            substitutions={stateData.substitutions}
            duties={stateData.duties}
            daySubjectDuties={stateData.daySubjectDuties}
            announcements={stateData.announcements}
            periods={stateData.periods}
            effectiveTime={effectiveTime}
            isSimulatedTime={simulatedOffsetMs !== null}
            onSetSimulatedTime={handleSetSimulatedTime}
            onResetTime={handleResetTime}
            onSwitchToAdmin={handleRequestSwitchToAdmin}
            onSwitchToTvMode={handleSwitchToTvMode}
            onManualRefresh={() => {
              if (settings.gasUrl) {
                performSilentSync(settings.gasUrl);
              }
            }}
            isRefreshing={isRefreshing}
            isOnline={isOnline}
            femaleTeachers={femaleTeachers}
          />
        ) : (
          <DisplayScreen
            settings={settings}
            periodProgress={periodProgress}
            timetable={stateData.timetable}
            substitutions={stateData.substitutions}
            duties={stateData.duties}
            daySubjectDuties={stateData.daySubjectDuties}
            announcements={stateData.announcements}
            periods={stateData.periods}
            effectiveTime={effectiveTime}
            isSimulatedTime={simulatedOffsetMs !== null}
            onSetSimulatedTime={handleSetSimulatedTime}
            onResetTime={handleResetTime}
            onSwitchToAdmin={handleRequestSwitchToAdmin}
            onSwitchToMobileMode={handleSwitchToMobileMode}
            onManualRefresh={() => {
              if (settings.gasUrl) {
                performSilentSync(settings.gasUrl);
              }
            }}
            isRefreshing={isRefreshing}
            isOnline={isOnline}
            femaleTeachers={femaleTeachers}
          />
        )
      ) : (
        <AdminDashboard
          settings={settings}
          substitutions={stateData.substitutions}
          duties={stateData.duties}
          daySubjectDuties={stateData.daySubjectDuties}
          onUpdateDaySubjectDuty={handleUpdateDaySubjectDuty}
          periods={stateData.periods}
          announcements={stateData.announcements}
          timetable={stateData.timetable}
          onSwitchToDisplay={handleAdminLogout}
          onUpdateSettings={handleUpdateSettings}
          onAddSubstitution={handleAddSubstitution}
          onBulkAddSubstitutions={handleBulkAddSubstitutions}
          onDeleteSubstitution={handleDeleteSubstitution}
          onUpdateSubstitutionStatus={handleUpdateSubstitutionStatus}
          onUpdateDuty={handleUpdateDuty}
          onAddDuty={handleAddDuty}
          onDeleteDuty={handleDeleteDuty}
          onClearAllDuties={handleClearAllDuties}
          onClearAllSubstitutions={handleClearAllSubstitutions}
          onUpdatePeriods={handleUpdatePeriods}
          onAddTimetableItem={handleAddTimetableItem}
          onDeleteTimetableItem={handleDeleteTimetableItem}
          onBulkReplaceTimetable={handleBulkReplaceTimetable}
          onAddAnnouncement={handleAddAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onToggleAnnouncementActive={handleToggleAnnouncementActive}
          onTestConnection={handleTestConnection}
          onForceSync={handleForceSync}
          onUploadAllToFirebase={handleUploadAllToFirebase}
          stateData={stateData}
          femaleTeachers={femaleTeachers}
          onBackupRestored={handleBackupRestored}
          isOnline={isOnline}
          isTesting={isRefreshing}
          isSyncing={isRefreshing}
          lastSyncTime={lastSyncTime}
          isSubmitting={isSubmitting}
          saveStatusMsg={saveStatusMsg}
        />
      )}

      {/* نافذة التحقق الأمني ورمز القفل لمشرف النظام لمنع التلاعب */}
      <AdminLockModal
        isOpen={showAdminLockModal}
        onClose={() => setShowAdminLockModal(false)}
        onSuccess={handleAdminAuthSuccess}
        currentPin={settings.adminPin}
      />
    </div>
  );
}
