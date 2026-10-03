import React, { useState, useRef, useMemo } from 'react';
import { Period, ClassScheduleItem, Substitution, SubstitutionStatus } from '../../types';
import { INITIAL_CLASSES, INITIAL_TEACHERS, INITIAL_SUBJECTS, INITIAL_PERIODS } from '../../data/initialData';
import {
  parseExcelTimetableFile,
  downloadSchoolExcelTemplate,
  exportOfficialTimetableToExcel,
  generateFull32ClassesTimetable,
  ExcelParseResult,
  SCHOOL_WEEK_DAYS,
  normalizePeriodId,
  normalizeTeacherNameCanonical,
  validateImportedTimetable,
} from '../../utils/excelUtils';
import { OFFICIAL_TIMETABLE_ITEMS, OFFICIAL_CLASSES_LIST, OFFICIAL_SUBJECTS_LIST } from '../../data/officialTimetableData';
import { TeachersBySubjectModal } from './TeachersBySubjectModal';
import { transferClassBetweenTeachers } from '../../utils/teachersUtils';
import { sanitizeAndDeduplicatePeriods } from '../../utils/timeUtils';
import {
  Clock,
  Calendar,
  Layers,
  Edit2,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Coffee,
  BookOpen,
  FileSpreadsheet,
  Upload,
  Download,
  Sparkles,
  AlertTriangle,
  Search,
  Check,
  RotateCcw,
  Users,
  FileDown,
  Filter,
  Zap,
  UserCheck,
  AlertCircle,
  X,
  User,
  ArrowRightLeft,
  ArrowUpDown,
} from 'lucide-react';

interface TimetableTabProps {
  periods: Period[];
  timetable: ClassScheduleItem[];
  substitutions?: Substitution[];
  onAddSubstitution?: (sub: Omit<Substitution, 'id'>) => Promise<void>;
  onDeleteSubstitution?: (id: string) => Promise<void>;
  onUpdateSubstitutionStatus?: (id: string, status: SubstitutionStatus) => Promise<void>;
  onUpdatePeriods: (periods: Period[]) => Promise<void>;
  onAddTimetableItem: (item: Omit<ClassScheduleItem, 'id'>) => Promise<void>;
  onDeleteTimetableItem: (id: string) => Promise<void>;
  onBulkReplaceTimetable: (items: ClassScheduleItem[]) => Promise<{ success: boolean; message: string; count?: number; operation?: string } | void> | void;
  isSubmitting: boolean;
  gasUrl?: string;
}

export const TimetableTab: React.FC<TimetableTabProps> = ({
  periods,
  timetable,
  substitutions = [],
  onAddSubstitution,
  onDeleteSubstitution,
  onUpdateSubstitutionStatus,
  onUpdatePeriods,
  onAddTimetableItem,
  onDeleteTimetableItem,
  onBulkReplaceTimetable,
  isSubmitting,
  gasUrl,
}) => {
  const [localPeriods, setLocalPeriods] = useState<Period[]>(periods);
  const [hasPeriodChanges, setHasPeriodChanges] = useState(false);
  const [selectedDayFilter, setSelectedDayFilter] = useState('الأحد');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState('p1');
  const [searchQuery, setSearchQuery] = useState('');

  // مزامنة الحصص تلقائياً عند تحديثها من الخادم فقط إذا لم يكن المستخدم يقوم بالتعديل حالياً
  React.useEffect(() => {
    if (!hasPeriodChanges && periods && periods.length > 0) {
      setLocalPeriods(sanitizeAndDeduplicatePeriods(periods));
    }
  }, [periods, hasPeriodChanges]);

  // حالة استيراد ملف Excel وفصل بيانات الاستيراد المؤقتة عن الجدول الفعلي
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [excelResult, setExcelResult] = useState<ExcelParseResult | null>(null);
  const [pendingImportedTimetable, setPendingImportedTimetable] = useState<ClassScheduleItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showReplaceTimetableConfirm, setShowReplaceTimetableConfirm] = useState(false);
  const [excelSuccessMsg, setExcelSuccessMsg] = useState<string | null>(null);

  // إضافة حصة فردية للجدول
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showTeachersModal, setShowTeachersModal] = useState(false);
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // إدارة مسميات ومواقيت الفترات والحصص
  const [periodSuccessMsg, setPeriodSuccessMsg] = useState<string | null>(null);
  const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
  const [addPeriodName, setAddPeriodName] = useState('');
  const [addPeriodId, setAddPeriodId] = useState('');
  const [addPeriodStartTime, setAddPeriodStartTime] = useState('13:50');
  const [addPeriodEndTime, setAddPeriodEndTime] = useState('14:35');
  const [addPeriodIsBreak, setAddPeriodIsBreak] = useState(false);
  const [addPeriodError, setAddPeriodError] = useState<string | null>(null);

  // حالات تأكيد الحذف وإعادة الضبط (مودال تفاعلي داخل التطبيق لتجاوز قيود الـ iFrame)
  const [periodToDelete, setPeriodToDelete] = useState<Period | null>(null);
  const [showResetPeriodsConfirm, setShowResetPeriodsConfirm] = useState(false);

  const [newGradeClass, setNewGradeClass] = useState(INITIAL_CLASSES[0]);
  const [newSubject, setNewSubject] = useState(INITIAL_SUBJECTS[0]);
  const [newTeacher, setNewTeacher] = useState(INITIAL_TEACHERS[0]);
  const [newRoom, setNewRoom] = useState('قاعة 101');
  const [newPeriodId, setNewPeriodId] = useState('p1');
  const [newDay, setNewDay] = useState('الخميس');

  // نافذة نقل فصل بين المعلمين
  const [showTransferClassModal, setShowTransferClassModal] = useState(false);
  const [transferSourceTeacher, setTransferSourceTeacher] = useState('');
  const [transferClass, setTransferClass] = useState('');
  const [transferTargetTeacher, setTransferTargetTeacher] = useState('');
  const [transferTargetSubject, setTransferTargetSubject] = useState('');

  // تعديل حصة دراسية بالجدول
  const [editingItem, setEditingItem] = useState<ClassScheduleItem | null>(null);
  const [editTeacher, setEditTeacher] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editGradeClass, setEditGradeClass] = useState('');
  const [editDay, setEditDay] = useState('الأحد');
  const [editPeriodId, setEditPeriodId] = useState('p1');
  const [editRoom, setEditRoom] = useState('');

  // استخراج قائمة المعلمين والمواد الفريدة للفلترة
  const availableTeachers = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach((t) => {
      if (t.teacher && t.teacher.trim() && !t.teacher.includes('شاغر')) set.add(t.teacher.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ar'));
  }, [timetable]);

  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach((t) => {
      if (t.subject && t.subject.trim()) set.add(t.subject.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ar'));
  }, [timetable]);

  // فصول المعلم المختار لنقل أحد فصوله
  const sourceTeacherClasses = useMemo(() => {
    if (!transferSourceTeacher) return [];
    const set = new Set<string>();
    timetable.forEach((item) => {
      if (item.teacher?.trim() === transferSourceTeacher.trim() && item.gradeClass) {
        set.add(item.gradeClass.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [timetable, transferSourceTeacher]);

  // عدد الحصص التي سيتم نقلها
  const lessonsToTransferCount = useMemo(() => {
    if (!transferSourceTeacher || !transferClass) return 0;
    return timetable.filter(
      (item) =>
        item.teacher?.trim() === transferSourceTeacher.trim() &&
        item.gradeClass?.trim() === transferClass.trim()
    ).length;
  }, [timetable, transferSourceTeacher, transferClass]);

  // تأكيد نقل الفصل
  const handleConfirmTransferClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSourceTeacher || !transferTargetTeacher || !transferClass) {
      alert('يرجى اختيار المعلم الحالي، الفصل، والمعلم البديل');
      return;
    }
    if (transferSourceTeacher === transferTargetTeacher) {
      alert('لا يمكن نقل الفصل إلى نفس المعلم');
      return;
    }

    const { updatedTimetable, transferredCount } = transferClassBetweenTeachers(
      transferSourceTeacher,
      transferTargetTeacher,
      transferClass,
      timetable,
      transferTargetSubject ? { targetSubject: transferTargetSubject } : undefined
    );

    await onBulkReplaceTimetable(updatedTimetable);
    setShowTransferClassModal(false);
    setExcelSuccessMsg(
      `تم بنجاح نقل الفصل (${transferClass}) بواقع (${transferredCount}) حصة أسبوعياً من الأستاذ (${transferSourceTeacher}) إلى الأستاذ (${transferTargetTeacher})!`
    );
    setTimeout(() => setExcelSuccessMsg(null), 5000);
  };

  // فتح نافذة تعديل حصة
  const handleOpenEditItem = (item: ClassScheduleItem) => {
    setEditingItem(item);
    setEditTeacher(item.teacher);
    setEditSubject(item.subject);
    setEditGradeClass(item.gradeClass);
    setEditDay(item.day);
    setEditPeriodId(item.periodId);
    setEditRoom(item.room || `قاعة ${item.gradeClass}`);
  };

  // حفظ تعديل حصة
  const handleSaveEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const updated = timetable.map((t) => {
      if (t.id === editingItem.id) {
        return {
          ...t,
          teacher: editTeacher,
          subject: editSubject,
          gradeClass: editGradeClass,
          day: editDay,
          periodId: editPeriodId,
          room: editRoom,
        };
      }
      return t;
    });

    await onBulkReplaceTimetable(updated);
    setEditingItem(null);
    setExcelSuccessMsg('تم حفظ تعديل بيانات الحصة بنجاح وتحديث الجدول!');
    setTimeout(() => setExcelSuccessMsg(null), 3500);
  };

  const getPeriodDurationMinutes = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const [h1, m1] = startTime.split(':').map((v) => parseInt(v, 10) || 0);
    const [h2, m2] = endTime.split(':').map((v) => parseInt(v, 10) || 0);
    return h2 * 60 + m2 - (h1 * 60 + m1);
  };

  const handlePeriodChange = (id: string, field: keyof Period, value: string | boolean | number) => {
    setLocalPeriods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setHasPeriodChanges(true);
  };

  const handleSavePeriods = async () => {
    // فرز الفترات وضمان حفظها بالتخزين المحلي والشاشات
    const cleanPeriods = sanitizeAndDeduplicatePeriods(localPeriods);
    setLocalPeriods(cleanPeriods);
    await onUpdatePeriods(cleanPeriods);
    setHasPeriodChanges(false);
    setPeriodSuccessMsg('تم حفظ وتطبيق جميع تعديلات مواعيد ومسميات الحصص بنجاح على الشاشات!');
    setTimeout(() => setPeriodSuccessMsg(null), 4000);
  };

  const handleSortPeriodsChronologically = () => {
    const sorted = [...localPeriods].sort((a, b) => {
      const [hA, mA] = a.startTime.split(':').map((v) => parseInt(v, 10) || 0);
      const [hB, mB] = b.startTime.split(':').map((v) => parseInt(v, 10) || 0);
      return hA * 60 + mA - (hB * 60 + mB);
    }).map((p, idx) => ({ ...p, order: idx }));
    setLocalPeriods(sorted);
    setHasPeriodChanges(true);
    setPeriodSuccessMsg('تم إعادة ترتيب الفترات زمنياً حسب وقت البدء تلقائياً! اضغط "حفظ مواعيد الحصص" لاعتمادها.');
    setTimeout(() => setPeriodSuccessMsg(null), 4000);
  };

  const handleResetToDefault8Periods = async () => {
    const cleanPeriods = sanitizeAndDeduplicatePeriods(INITIAL_PERIODS);
    setLocalPeriods(cleanPeriods);
    await onUpdatePeriods(cleanPeriods);
    setHasPeriodChanges(false);
    setShowResetPeriodsConfirm(false);
    setPeriodSuccessMsg('تمت استعادة الجدول الزمني الرسمي المعتمد (8 حصص تدريسية + الفسح والطابور)');
    setTimeout(() => setPeriodSuccessMsg(null), 4000);
  };

  const handleOpenAddPeriodModal = () => {
    setAddPeriodError(null);
    const teachingCount = localPeriods.filter((p) => !p.isBreak).length;
    const nextTeachingNum = teachingCount + 1;

    let defStart = '13:50';
    let defEnd = '14:35';
    if (localPeriods.length > 0) {
      const sortedByEnd = [...localPeriods].sort((a, b) => {
        const [hA, mA] = a.endTime.split(':').map((v) => parseInt(v, 10) || 0);
        const [hB, mB] = b.endTime.split(':').map((v) => parseInt(v, 10) || 0);
        return hB * 60 + mB - (hA * 60 + mA);
      });
      const latest = sortedByEnd[0];
      if (latest && latest.endTime) {
        defStart = latest.endTime;
        const [h, m] = latest.endTime.split(':').map((v) => parseInt(v, 10) || 0);
        const endMinutes = h * 60 + m + 45;
        const endH = Math.floor(endMinutes / 60) % 24;
        const endM = endMinutes % 60;
        defEnd = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      }
    }

    setAddPeriodName(`الحصة ${nextTeachingNum}`);
    setAddPeriodId(`p${nextTeachingNum}`);
    setAddPeriodStartTime(defStart);
    setAddPeriodEndTime(defEnd);
    setAddPeriodIsBreak(false);
    setShowAddPeriodModal(true);
  };

  const handleConfirmAddPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    setAddPeriodError(null);
    if (!addPeriodName.trim()) {
      setAddPeriodError('يرجى كتابة مسمى الفترة أو الحصة');
      return;
    }
    const cleanId = (addPeriodId.trim() || `p${Date.now().toString().slice(-4)}`).toLowerCase();
    if (localPeriods.some((p) => p.id === cleanId)) {
      setAddPeriodError(`المعرف المختصر (${cleanId}) مستخدم مسبقاً، يرجى كتابة رمز مختلف (مثل p9 أو b4 أو act1)`);
      return;
    }

    // منع تكرار حصة تدريسية موجودة بالفعل بين 1 و 8
    if (!addPeriodIsBreak) {
      const matchTeaching = addPeriodName.match(/([1-8])/);
      if (matchTeaching) {
        const canonicalId = `p${matchTeaching[1]}`;
        if (localPeriods.some((p) => p.id === canonicalId)) {
          setAddPeriodError(`الحصة (${addPeriodName}) مسجلة بالفعل في القائمة بالرمز (${canonicalId})، لا يمكن تكرار الحصة.`);
          return;
        }
      }
    }

    const newP: Period = {
      id: cleanId,
      name: addPeriodName.trim(),
      startTime: addPeriodStartTime,
      endTime: addPeriodEndTime,
      isBreak: addPeriodIsBreak,
      order: localPeriods.length,
    };

    const updated = sanitizeAndDeduplicatePeriods([...localPeriods, newP]);
    setLocalPeriods(updated);
    setHasPeriodChanges(true);
    setShowAddPeriodModal(false);
    setPeriodSuccessMsg(`تمت إضافة "${newP.name}" إلى القائمة! اضغط على زر "حفظ مواعيد الحصص" باللون الأخضر لتطبيقها.`);
    setTimeout(() => setPeriodSuccessMsg(null), 5000);
  };

  // مسح وقت البدء والانتهاء لفترة معينة لإعادة كتابتها
  const handleClearPeriodTimes = (id: string) => {
    setLocalPeriods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, startTime: '', endTime: '' } : p))
    );
    setHasPeriodChanges(true);
    setPeriodSuccessMsg('تم مسح توقيت الفترة، يمكنك الآن إدخال التوقيت الجديد والضغط على حفظ.');
    setTimeout(() => setPeriodSuccessMsg(null), 4000);
  };

  // تنفيذ حذف الفترة وتحديث القائمة فوراً
  const handleConfirmDeletePeriod = async () => {
    if (!periodToDelete) return;
    const targetName = periodToDelete.name;
    const updated = localPeriods.filter((p) => p.id !== periodToDelete.id);
    const cleanPeriods = sanitizeAndDeduplicatePeriods(updated);
    setLocalPeriods(cleanPeriods);
    setPeriodToDelete(null);
    try {
      await onUpdatePeriods(cleanPeriods);
      setHasPeriodChanges(false);
      setPeriodSuccessMsg(`تم حذف فترة "${targetName}" نهائياً من قاعدة البيانات والشاشات.`);
    } catch {
      setHasPeriodChanges(true);
      setPeriodSuccessMsg(`تم حذف فترة "${targetName}" محلياً، يرجى الضغط على زر "حفظ مواعيد الحصص" لاعتماد التعديل.`);
    }
    setTimeout(() => setPeriodSuccessMsg(null), 4000);
  };

  const handleDeletePeriod = (p: Period) => {
    if (localPeriods.length <= 1) {
      setPeriodSuccessMsg('لا يمكن حذف جميع الفترات! يجب الإبقاء على فترة واحدة على الأقل.');
      setTimeout(() => setPeriodSuccessMsg(null), 4000);
      return;
    }
    setPeriodToDelete(p);
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddTimetableItem({
      day: newDay,
      periodId: newPeriodId,
      gradeClass: newGradeClass,
      subject: newSubject,
      teacher: newTeacher,
      room: newRoom,
    });
    setShowAddClassModal(false);
  };

  // معالجة رفع وتحليل ملف الإكسل وحفظ النتيجة في pendingImportedTimetable حصراً
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingExcel(true);
    setExcelSuccessMsg(null);
    setValidationErrors([]);
    setValidationWarnings([]);
    try {
      const result = await parseExcelTimetableFile(file);
      setExcelResult(result);
      if (result.success && result.items.length > 0) {
        // تطبيع الأسماء وفق القائمة الصريحة ومعرفات الحصص
        const normalized = result.items.map((it) => ({
          ...it,
          periodId: normalizePeriodId(it.periodId),
          teacher: normalizeTeacherNameCanonical(it.teacher),
        }));
        setPendingImportedTimetable(normalized);

        // التحقق الصارم من متطلبات الجدول قبل السماح بالاستبدال
        const val = validateImportedTimetable(normalized, 32);
        setValidationErrors(val.errors);
        setValidationWarnings(val.warnings);
      } else {
        setPendingImportedTimetable([]);
        setValidationErrors(
          result.errors && result.errors.length > 0
            ? result.errors
            : ['تعذر استخراج حصص صالحة من الملف المرفوع']
        );
        setValidationWarnings([]);
      }
    } catch (err) {
      console.error('Excel parse error', err);
      setPendingImportedTimetable([]);
      setValidationErrors([err instanceof Error ? err.message : String(err)]);
      setValidationWarnings([]);
    } finally {
      setIsParsingExcel(false);
    }
  };

  // استبدال الجدول القديم بالجدول المستورد الجديد بعد التحقق الصارم وموافقة المستخدم
  const handleExecuteReplaceTimetable = async () => {
    if (pendingImportedTimetable.length === 0) return;

    // إعادة التحقق الصارم قبل الإرسال
    const validation = validateImportedTimetable(pendingImportedTimetable, 32);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      alert('لا يمكن استبدال الجدول لوجود أخطاء في البيانات:\n' + validation.errors.join('\n'));
      return;
    }

    const normalizedItems = pendingImportedTimetable.map((it) => ({
      ...it,
      periodId: normalizePeriodId(it.periodId),
      teacher: normalizeTeacherNameCanonical(it.teacher),
    }));

    try {
      const res = await onBulkReplaceTimetable(normalizedItems);
      if (res && res.success === false) {
        alert(`فشل استبدال الجدول: ${res.message}`);
        return;
      }

      setExcelSuccessMsg(
        `تم بنجاح استبدال الجدول القديم بـ ${normalizedItems.length} حصة مستوردة جديدة لـ ${new Set(normalizedItems.map((i) => i.gradeClass)).size} فصلاً!`
      );
      setShowReplaceTimetableConfirm(false);
      setPendingImportedTimetable([]);
      setExcelResult(null);
      setValidationErrors([]);
      setValidationWarnings([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Replace timetable error', err);
      alert('حدث خطأ أثناء استبدال الجدول: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // تصدير الجدول الحالي كاملاً لملف Excel احترافي مع عكس الاحتياط
  const handleExportCurrentTimetableExcel = async () => {
    try {
      setExcelSuccessMsg('جارٍ تجهيز ملف Excel ومشاركته / تنزيله...');
      await exportOfficialTimetableToExcel(timetable, 'الجدول_المدرسي_المعتمد_32_فصلا_محدث.xlsx', substitutions);
      setExcelSuccessMsg('تم تجهيز وتصدير ملف Excel بنجاح! إذا كنت على هاتف أندرويد فقد فُتحت لك نافذة المشاركة والحفظ.');
      setTimeout(() => setExcelSuccessMsg(null), 6000);
    } catch (err) {
      console.error('Export error', err);
      alert('حدث خطأ أثناء تصدير ملف Excel: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // تحميل قالب الجدول بصيغة Excel
  const handleDownloadTemplateWithFeedback = async () => {
    try {
      setExcelSuccessMsg('جارٍ تجهيز قالب Excel ومشاركته / تنزيله...');
      await downloadSchoolExcelTemplate();
      setExcelSuccessMsg('تم تجهيز القالب بنجاح! يمكنك فتحه وتعبئته ثم رفعه للبرنامج.');
      setTimeout(() => setExcelSuccessMsg(null), 6000);
    } catch (err) {
      console.error('Download template error', err);
      alert('حدث خطأ أثناء تحميل القالب: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // توليد جدول 32 فصلاً تجريبياً كاملاً بنقرة واحدة
  const handleGenerate32ClassesDemo = async () => {
    const demoItems = generateFull32ClassesTimetable();
    await onBulkReplaceTimetable(demoItems);
    setExcelSuccessMsg(`تم توليد واعتماد جدول 32 فصلاً كاملاً لجميع الحصص الثمانية (${demoItems.length} حصة) بنجاح!`);
  };

  // إفراغ الجدول المدرسي للبدء من الصفر لمدرسة جديدة
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const handleClearTimetableForNewSchool = async () => {
    try {
      await onBulkReplaceTimetable([]);
      setExcelSuccessMsg('تم إفراغ جدول الحصص بالكامل بنجاح. يمكنك الآن رفع واستيراد جدول مدرستك الجديد عبر Excel أو الربط مع السحابة.');
      setShowClearConfirm(false);
    } catch (err) {
      alert(`حدث خطأ أثناء إفراغ الجدول: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // حالة تكليف احتياط سريع من صف الحصة بالجدول مباشرة
  const [quickSubItem, setQuickSubItem] = useState<ClassScheduleItem | null>(null);
  const [substituteTeacherInput, setSubstituteTeacherInput] = useState('');
  const [quickSubNotes, setQuickSubNotes] = useState('');
  const [onlySubFilter, setOnlySubFilter] = useState(false);

  // دالة فحص وجود احتياط لحصة معينة بالجدول
  const getSubstitutionForItem = (item: ClassScheduleItem) => {
    if (!substitutions || substitutions.length === 0) return undefined;
    const itemNorm = normalizePeriodId(item.periodId);
    return substitutions.find((s) => {
      if (s.gradeClass !== item.gradeClass) return false;
      if (s.day && s.day !== item.day) return false;
      const subNorm = normalizePeriodId(s.period);
      return subNorm === itemNorm;
    });
  };

  // تأكيد وحفظ التكليف السريع للاحتياط وعكسه على الجدول فوراً
  const handleConfirmQuickSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSubItem || !substituteTeacherInput.trim()) {
      alert('يرجى اختيار اسم المعلم البديل المكلف بالحصة');
      return;
    }

    if (onAddSubstitution) {
      const pName =
        periods.find((p) => normalizePeriodId(p.id) === normalizePeriodId(quickSubItem.periodId))?.name ||
        `الحصة ${quickSubItem.periodId.replace('p', '')}`;

      await onAddSubstitution({
        date: new Date().toISOString().split('T')[0],
        day: quickSubItem.day,
        period: pName,
        gradeClass: quickSubItem.gradeClass,
        absentTeacher: quickSubItem.teacher,
        substituteTeacher: substituteTeacherInput.trim(),
        subject: quickSubItem.subject || 'حصة احتياط',
        status: 'مؤكد',
        notes: quickSubNotes.trim() ? quickSubNotes.trim() : `احتياط (${quickSubItem.subject})`,
        updatedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      });

      setExcelSuccessMsg(
        `تم بنجاح تكليف أ. (${substituteTeacherInput.trim()}) بحصة الاحتياط بدلاً من أ. (${quickSubItem.teacher}) للصف (${quickSubItem.gradeClass})، وانعكست فوراً على الجدول والشاشات!`
      );
    }

    setQuickSubItem(null);
    setSubstituteTeacherInput('');
    setQuickSubNotes('');
  };

  // عدد حصص الاحتياط النشطة لليوم والحصة المحددة
  const activeSubsCount = useMemo(() => {
    return timetable.filter((item) => {
      const matchesDay = !selectedDayFilter || item.day === selectedDayFilter;
      const matchesPeriod =
        selectedPeriodFilter === 'all' ||
        normalizePeriodId(item.periodId) === normalizePeriodId(selectedPeriodFilter);
      return matchesDay && matchesPeriod && Boolean(getSubstitutionForItem(item));
    }).length;
  }, [timetable, selectedDayFilter, selectedPeriodFilter, substitutions]);

  // تصفية الحصص حسب اليوم والحصة والمعلم والمادة المحددة والبحث وفلترة الاحتياط
  const filteredTimetable = useMemo(() => {
    return timetable.filter((item) => {
      const matchesDay = !selectedDayFilter || item.day === selectedDayFilter;
      const matchesPeriod =
        selectedPeriodFilter === 'all' ||
        normalizePeriodId(item.periodId) === normalizePeriodId(selectedPeriodFilter);
      const matchesTeacher = selectedTeacherFilter === 'all' || item.teacher === selectedTeacherFilter;
      const matchesSubject = selectedSubjectFilter === 'all' || item.subject === selectedSubjectFilter;

      const sub = getSubstitutionForItem(item);
      if (onlySubFilter && !sub) return false;

      const matchesSearch =
        !searchQuery ||
        (item.gradeClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (sub && sub.substituteTeacher.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.room && item.room.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesDay && matchesPeriod && matchesTeacher && matchesSubject && matchesSearch;
    });
  }, [
    timetable,
    selectedDayFilter,
    selectedPeriodFilter,
    selectedTeacherFilter,
    selectedSubjectFilter,
    onlySubFilter,
    searchQuery,
    substitutions,
  ]);

  return (
    <div className="space-y-6">
      {/* 1. استيراد الجدول كاملاً من ملف Excel أو CSV (الميزة الأكثر طلباً) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800 font-['Cairo']">
                  استيراد الجدول المدرسي كاملاً من ملف Excel
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  متوافق مع 32 فصلاً و 8 حصص
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ارفع ملف إكسل أو CSV الصادر من نور أو جدول الحصص الإلكتروني، وسيقوم النظام بتحليله وعرض الحصص تلقائياً
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* زر تصدير الجدول كاملاً لـ Excel */}
            <button
              onClick={handleExportCurrentTimetableExcel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
              title="تصدير وتحويل الجدول المعتمد كاملاً بجميع فصوله وحصصه وقائمة المعلمين إلى ملف Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>تصدير الجدول كاملاً لـ Excel</span>
            </button>

            {/* زر استبدال الجدول القديم بالجدول المستورد */}
            <button
              onClick={() => setShowReplaceTimetableConfirm(true)}
              disabled={isSubmitting || pendingImportedTimetable.length === 0 || validationErrors.length > 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                pendingImportedTimetable.length > 0
                  ? `استبدال الجدول القديم بـ ${pendingImportedTimetable.length} حصة`
                  : 'استبدال الجدول القديم بالجدول المستورد (يرجى رفع ملف Excel أولاً)'
              }
            >
              <RotateCcw className="w-4 h-4 text-blue-200" />
              <span>
                {pendingImportedTimetable.length > 0
                  ? `استبدال الجدول القديم بـ ${pendingImportedTimetable.length} حصة`
                  : 'استبدال الجدول القديم بالجدول المستورد'}
              </span>
            </button>

            {/* زر دليل وقائمة المعلمين وتوزيع المواد */}
            <button
              onClick={() => setShowTeachersModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
              title="استعراض قائمة المعلمين موزعين حسب المواد الدراسية وتعديلهم"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>دليل المعلمين وتوزيع المواد</span>
            </button>

            {/* زر نقل فصل دراسي كامل بين المعلمين */}
            <button
              onClick={() => {
                const firstT = availableTeachers[0] || '';
                setTransferSourceTeacher(firstT);
                setTransferClass('');
                setTransferTargetTeacher('');
                setTransferTargetSubject('');
                setShowTransferClassModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-300 text-xs font-bold transition active:scale-95 shadow-xs"
              title="نقل فصل دراسي بالكامل من معلم إلى معلم آخر وتحديث الجدول فوراً"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>نقل فصل لمعلم آخر</span>
            </button>

            {/* زر إفراغ الجدول لمدرسة جديدة للبدء من الصفر */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition active:scale-95 shadow-2xs"
              title="إفراغ الجدول الحالي بالكامل للبدء بجدول فارغ خاص بمدرستك"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>إفراغ الجدول (مدرسة جديدة)</span>
            </button>

            {/* زر استعادة الجدول التجريبي */}
            <button
              onClick={handleGenerate32ClassesDemo}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition active:scale-95"
              title="استعادة أو توليد الجدول التجريبي لـ 32 فصلاً"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>استعادة الجدول التجريبي</span>
            </button>

            {/* زر تحميل القالب */}
            <button
              onClick={handleDownloadTemplateWithFeedback}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition active:scale-95 cursor-pointer"
              title="تحميل قالب جدول مدرسي فارغ بصيغة Excel"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>تحميل القالب</span>
            </button>
          </div>
        </div>

        {/* إشعار نجاح الاستيراد */}
        {excelSuccessMsg && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-fade-in font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>{excelSuccessMsg}</span>
            </div>
            <button onClick={() => setExcelSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
        )}

        {/* منطقة رفع الملف وسحبه */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="lg:col-span-2">
            <label
              htmlFor="excel-upload-input"
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group"
            >
              <Upload className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition mb-2" />
              <span className="text-sm font-bold text-slate-800">
                اضغط هنا لاختيار ملف Excel (.xlsx / .xls / .csv) أو اسحبه إلى هنا
              </span>
              <span className="text-xs text-slate-500 mt-1">
                يدعم جداول مصفوفات الفصول (الصف بالسطر والحصص 1 إلى 8 بالأعمدة) أو الجداول العمودية
              </span>
              <input
                id="excel-upload-input"
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              إحصائيات الجدول المعتمد حالياً:
            </span>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">إجمالي الحصص المسجلة:</span>
              <span className="font-black text-emerald-700 font-mono text-sm">{timetable.length} حصة</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500">الفصول النشطة في الجدول:</span>
              <span className="font-black text-indigo-700 font-mono text-sm">{new Set(timetable.map(t => t.gradeClass)).size} فصلاً</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">نطاق الحصص:</span>
              <span className="font-black text-amber-700 font-mono text-xs">من الحصة 1 إلى 8</span>
            </div>
          </div>
        </div>

        {/* نتيجة فحص ومعاينة ملف الإكسل المرفوع المستقل عن الجدول الحالي */}
        {(excelResult || pendingImportedTimetable.length > 0) && (
          <div className="mt-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-700 block mb-1">
                  ✓ تم فحص الملف وتحليله بنجاح:
                </span>
                <p className="text-sm font-bold text-slate-800">
                  تم استخراج {pendingImportedTimetable.length} حصة دراسية لـ {new Set(pendingImportedTimetable.map((i) => i.gradeClass)).size} فصلاً مختلفاً جاهزة للاستبدال!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setExcelResult(null);
                    setPendingImportedTimetable([]);
                    setValidationErrors([]);
                    setValidationWarnings([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => setShowReplaceTimetableConfirm(true)}
                  disabled={isSubmitting || pendingImportedTimetable.length === 0 || validationErrors.length > 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {pendingImportedTimetable.length > 0
                      ? `استبدال الجدول القديم بـ ${pendingImportedTimetable.length} حصة`
                      : 'استبدال الجدول القديم بالجدول المستورد'}
                  </span>
                </button>
              </div>
            </div>

            {/* تنبيهات التدقيق */}
            {validationWarnings.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>تنبيهات فحص الجدول:</span>
                </div>
                {validationWarnings.map((w, idx) => (
                  <p key={idx} className="text-[11px] leading-tight">• {w}</p>
                ))}
              </div>
            )}

            {/* أخطاء التحقق الصارم */}
            {validationErrors.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>أخطاء تمنع استبدال الجدول (يجب تصحيحها في الملف):</span>
                </div>
                {validationErrors.map((err, idx) => (
                  <p key={idx} className="text-[11px] leading-tight font-mono text-rose-700">• {err}</p>
                ))}
              </div>
            )}

            {/* معاينة عينة من الحصص المستخرجة من pendingImportedTimetable */}
            <div className="overflow-x-auto max-h-56 border border-slate-200 rounded-xl bg-white shadow-2xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-2">اليوم</th>
                    <th className="p-2">الحصة</th>
                    <th className="p-2">الصف</th>
                    <th className="p-2">المادة</th>
                    <th className="p-2">المعلم</th>
                    <th className="p-2">القاعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingImportedTimetable.slice(0, 10).map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-2 text-slate-600 font-bold">{it.day}</td>
                      <td className="p-2 text-indigo-700 font-bold">{it.periodId}</td>
                      <td className="p-2 text-slate-800 font-bold">{it.gradeClass}</td>
                      <td className="p-2 text-slate-600">{it.subject}</td>
                      <td className="p-2 text-emerald-700 font-bold">{it.teacher}</td>
                      <td className="p-2 text-slate-500 font-mono">{it.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pendingImportedTimetable.length > 10 && (
              <p className="text-[11px] text-slate-500 text-center">
                ... وعرض {pendingImportedTimetable.length - 10} حصة إضافية سيتم استبدالها بالكامل.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. ضبط وإدارة مواعيد ومسميات الحصص والفسح اليومية */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs">
        {/* رسالة نجاح الحفظ */}
        {periodSuccessMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{periodSuccessMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800 font-['Cairo']">
                  أوقات الحصص والجدول الزمني المدرسي ({localPeriods.length} فترات)
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {localPeriods.filter((p) => !p.isBreak).length} حصص تدريسية + {localPeriods.filter((p) => p.isBreak).length} فسح/طابور
                </span>
              </div>
              <p className="text-xs text-slate-500">
                تعديل المسميات والمواقيت، حذف أو إضافة فترات جديدة (تتحكم في انتقال الشاشة الذكية وحساب الحصة النشطة)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* زر ترتيب زمني */}
            <button
              type="button"
              onClick={handleSortPeriodsChronologically}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
              title="ترتيب الفترات تلقائياً حسب وقت البدء زمنياً"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span>ترتيب زمني</span>
            </button>

            {/* زر إعادة ضبط */}
            <button
              type="button"
              onClick={() => setShowResetPeriodsConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
              title="إعادة ضبط مواعيد الـ 8 حصص والفسح للنظام المدرسي المعتمد"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>إعادة ضبط لـ 8 حصص</span>
            </button>

            {/* زر إضافة فترة جديدة */}
            <button
              type="button"
              onClick={handleOpenAddPeriodModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
              title="إضافة مسمى وتوقيت جديد (حصة أو فسحة أو طابور أو صلاة)"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>إضافة توقيت جديد</span>
            </button>

            {/* زر حفظ التعديلات */}
            <button
              onClick={handleSavePeriods}
              disabled={isSubmitting || !hasPeriodChanges}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                hasPeriodChanges
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 animate-pulse'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جارٍ الحفظ...' : hasPeriodChanges ? 'حفظ مواعيد الحصص الآن' : 'تم حفظ المواعيد'}</span>
            </button>
          </div>
        </div>

        {/* شبكة بطاقات الفترات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {localPeriods.map((p, idx) => {
            const dur = getPeriodDurationMinutes(p.startTime, p.endTime);
            const isInvalidDuration = dur <= 0;

            return (
              <div
                key={`${p.id}-${idx}`}
                className={`p-3.5 rounded-2xl border transition relative flex flex-col justify-between ${
                  p.isBreak
                    ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* شريط رأس البطاقة */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/70">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] w-5 h-5 rounded-full font-bold bg-white text-slate-700 border border-slate-200 flex items-center justify-center font-mono shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-white text-slate-600 border border-slate-200 font-mono">
                        {p.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* تبديل نوع الفترة */}
                      <button
                        type="button"
                        onClick={() => handlePeriodChange(p.id, 'isBreak', !p.isBreak)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                          p.isBreak
                            ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                        }`}
                        title="انقر لتغيير نوع الفترة (حصة دراسية أو استراحة/طابور)"
                      >
                        {p.isBreak ? <Coffee className="w-3 h-3 text-amber-600" /> : <BookOpen className="w-3 h-3 text-indigo-600" />}
                        <span>{p.isBreak ? 'استراحة/فسحة' : 'حصة دراسية'}</span>
                      </button>

                      {/* زر حذف الفترة */}
                      <button
                        type="button"
                        onClick={() => handleDeletePeriod(p)}
                        className="p-1 rounded-lg text-rose-600 hover:text-white hover:bg-rose-600 bg-rose-50 border border-rose-200 transition shadow-2xs active:scale-90"
                        title={`حذف فترة ${p.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* تعديل مسمى التوقيت / اسم الفترة */}
                  <div className="mb-2.5">
                    <label className="block text-[10px] text-slate-600 mb-1 font-bold">
                      مسمى الفترة / التوقيت:
                    </label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => handlePeriodChange(p.id, 'name', e.target.value)}
                      placeholder="اسم الفترة..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500 transition shadow-2xs"
                    />
                  </div>

                  {/* تعديل أوقات البدء والانتهاء مع زر مسح التوقيت السريع */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-600 font-bold">وقت البدء:</label>
                        <button
                          type="button"
                          onClick={() => handleClearPeriodTimes(p.id)}
                          className="text-[9px] text-amber-700 hover:text-amber-800 underline underline-offset-1 transition font-bold"
                          title="مسح وقت البدء والانتهاء لإعادة كتابتهما"
                        >
                          مسح التوقيت
                        </button>
                      </div>
                      <input
                        type="time"
                        value={p.startTime}
                        onChange={(e) => handlePeriodChange(p.id, 'startTime', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-slate-800 font-mono text-center focus:outline-none focus:border-indigo-500 text-xs shadow-2xs"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-600 font-bold">وقت الانتهاء:</label>
                      </div>
                      <input
                        type="time"
                        value={p.endTime}
                        onChange={(e) => handlePeriodChange(p.id, 'endTime', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-slate-800 font-mono text-center focus:outline-none focus:border-indigo-500 text-xs shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* مؤشر المدة أو التحذير */}
                <div className="mt-1">
                  {isInvalidDuration ? (
                    <div className="flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                      <AlertTriangle className="w-3 h-3 shrink-0 text-rose-600" />
                      <span>تنبيه: وقت النهاية يسبق أو يساوي البداية!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      <span>المدة الزمنية:</span>
                      <span className="font-bold text-slate-800 font-mono">{dur} دقيقة</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. استعراض الحصص والفصول الدراسية (32 فصلاً لكل حصة) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800 font-['Cairo']">
                جدول الفصول للحصة المحددة ({filteredTimetable.length} فصلاً)
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                مخصص لـ 32 فصلاً
              </span>
            </div>
            <p className="text-xs text-slate-500">
              تصفح الحصص من الحصة الأولى إلى الثامنة، أو استخدم محرك البحث للعثور على أي صف أو معلم
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* حقل البحث */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن صف أو معلم..."
                className="bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white w-44 md:w-56"
              />
            </div>

            <button
              onClick={() => setShowAddClassModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حصة منفردة</span>
            </button>
          </div>
        </div>

        {/* أزرار اختيار يوم الأسبوع */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-3 border-b border-slate-100 scrollbar-thin">
          <span className="text-xs font-bold text-slate-500 self-center pl-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            اليوم:
          </span>
          {SCHOOL_WEEK_DAYS.map((day) => {
            const countForDay = timetable.filter((t) => t.day === day).length;
            const isSelected = selectedDayFilter === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDayFilter(day)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{day}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-cyan-700 text-cyan-50' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {countForDay} حصة
                </span>
              </button>
            );
          })}
        </div>

        {/* أزرار الحصص التدريسية من الأولى إلى الثامنة */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-4 scrollbar-thin">
          {periods.filter((p) => !p.isBreak).map((p, pIdx) => {
            const countForPeriod = timetable.filter(t => t.periodId === p.id && t.day === selectedDayFilter).length;

            return (
              <button
                key={`${p.id}-${pIdx}`}
                onClick={() => setSelectedPeriodFilter(p.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-2 ${
                  selectedPeriodFilter === p.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{p.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  selectedPeriodFilter === p.id ? 'bg-indigo-700 text-indigo-50' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {countForPeriod}
                </span>
              </button>
            );
          })}
        </div>

        {/* شريط الفلترة الإضافية حسب المادة أو المعلم */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-600 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              تصفية سريعة:
            </span>

            {/* فلترة حسب المادة */}
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500 font-bold shadow-2xs"
            >
              <option value="all">جميع المواد ({availableSubjects.length})</option>
              {availableSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* فلترة حسب المعلم */}
            <select
              value={selectedTeacherFilter}
              onChange={(e) => setSelectedTeacherFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500 font-bold max-w-[200px] shadow-2xs"
            >
              <option value="all">جميع المعلمين ({availableTeachers.length})</option>
              {availableTeachers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {(selectedSubjectFilter !== 'all' || selectedTeacherFilter !== 'all' || onlySubFilter) && (
              <button
                onClick={() => {
                  setSelectedSubjectFilter('all');
                  setSelectedTeacherFilter('all');
                  setOnlySubFilter(false);
                }}
                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition"
              >
                إلغاء الفلترة
              </button>
            )}

            {/* فلتر حصص الاحتياط فقط */}
            <button
              onClick={() => setOnlySubFilter(!onlySubFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                onlySubFilter
                  ? 'bg-amber-500 text-white border-amber-600 font-black shadow-xs'
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
              }`}
              title="تصفية الجدول لعرض حصص الاحتياط المكلفة فقط"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>حصص الاحتياط فقط</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                onlySubFilter ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {activeSubsCount}
              </span>
            </button>
          </div>

          <div className="text-slate-500 text-[11px]">
            عرض <strong className="text-emerald-600 font-mono text-xs">{filteredTimetable.length}</strong> حصة مطابقة
          </div>
        </div>

        {/* جدول الـ 32 فصلاً مع عكس حصص الاحتياط بدقة */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-right border-collapse text-xs md:text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">الصف الدراسي</th>
                <th className="py-3 px-3">المادة</th>
                <th className="py-3 px-3">المعلم (أو معلم الاحتياط البديل)</th>
                <th className="py-3 px-3">القاعة / المختبر</th>
                <th className="py-3 px-3 text-center">إجراءات الاحتياط والحصة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTimetable.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {timetable.length === 0
                          ? 'جدول المدرسة فارغ حالياً وجاهز لبيانات مدرستك'
                          : 'لا توجد فصول مطابقة للفلترة المحددة'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {timetable.length === 0
                          ? 'يمكنك استيراد جدول مدرستك كاملاً عبر ملف Excel من القسم العلوي، أو تحميل القالب وتعبئته، أو تحميل جدول تجريبي للاختبار.'
                          : 'جرب تغيير اليوم أو الحصة أو إلغاء فلترة المعلم والمادة لعرض الحصص الدراسية.'}
                      </p>
                      {timetable.length === 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            استيراد ملف Excel الآن
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadTemplateWithFeedback}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer"
                          >
                            تحميل القالب
                          </button>
                          <button
                            type="button"
                            onClick={handleGenerate32ClassesDemo}
                            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition border border-amber-200 cursor-pointer"
                          >
                            تحميل جدول تجريبي (32 فصلاً)
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTimetable.map((item, idx) => {
                  const activeSub = getSubstitutionForItem(item);

                  return (
                    <tr
                      key={item.id}
                      className={`transition ${
                        activeSub
                          ? 'bg-amber-50/60 border-l-4 border-l-amber-500 hover:bg-amber-50'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3 px-3 text-slate-400 font-mono text-xs">{idx + 1}</td>

                      <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{item.gradeClass}</span>
                          {activeSub && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-2xs flex items-center gap-0.5 shrink-0">
                              <AlertCircle className="w-3 h-3 text-white" />
                              <span>احتياط مكلف</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-indigo-700 whitespace-nowrap">
                        <div>
                          <span>{item.subject}</span>
                          {activeSub && activeSub.notes && (
                            <span className="block text-[10px] text-amber-600 font-normal">
                              {activeSub.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {activeSub ? (
                          <div className="space-y-0.5">
                            <div className="text-emerald-700 font-black flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>البديل: أ. {activeSub.substituteTeacher}</span>
                            </div>
                            <div className="text-rose-500/80 text-[10px] line-through">
                              الغائب: أ. {activeSub.absentTeacher || item.teacher}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.teacher}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap text-xs">
                        {item.room}
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {activeSub ? (
                            <button
                              onClick={() => onDeleteSubstitution && onDeleteSubstitution(activeSub.id)}
                              className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition flex items-center gap-1"
                              title="إلغاء التكليف وإعادة المعلم الأساسي للجدول فوراً"
                            >
                              <RotateCcw className="w-3 h-3 text-rose-500" />
                              <span>إلغاء الاحتياط</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setQuickSubItem(item);
                                setSubstituteTeacherInput('');
                                setQuickSubNotes('');
                              }}
                              className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
                              title="تكليف احتياط لهذه الحصة فوراً وعكسه على الجدول"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-500" />
                              <span>تكليف احتياط</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEditItem(item)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition"
                            title="تعديل بيانات الحصة بالجدول"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteTimetableItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="حذف الحصة من الجدول"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة إضافة حصة منفردة */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-right">
            <h3 className="text-base font-bold text-slate-800 font-['Cairo'] mb-4">
              إضافة حصة دراسية للجدول
            </h3>

            <form onSubmit={handleAddClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اليوم:</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {SCHOOL_WEEK_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الحصة (1 إلى 8):</label>
                <select
                  value={newPeriodId}
                  onChange={(e) => setNewPeriodId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {periods.filter((p) => !p.isBreak).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الصف:</label>
                <select
                  value={newGradeClass}
                  onChange={(e) => setNewGradeClass(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {INITIAL_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المادة:</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {INITIAL_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المعلم:</label>
                <select
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {INITIAL_TEACHERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">القاعة أو المعمل:</label>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="مثال: قاعة 1"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تكليف احتياط فوري لحصة محددة من الجدول المدرسي */}
      {quickSubItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-amber-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs border border-amber-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Cairo']">
                    تكليف احتياط فوري لهذه الحصة
                  </h3>
                  <p className="text-xs text-slate-500">
                    سينعكس التكليف فورياً على الجدول وعلى شاشات العرض المدرسية
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickSubItem(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmQuickSub} className="space-y-4 text-xs">
              {/* ملخص بيانات الحصة الأساسية */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500 block text-[10px]">اليوم والحصة:</span>
                  <strong className="text-cyan-700 font-bold">{quickSubItem.day} — {quickSubItem.periodId}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">الصف والفصل:</span>
                  <strong className="text-slate-800 font-bold">{quickSubItem.gradeClass}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">المادة الدراسية:</span>
                  <strong className="text-indigo-700 font-bold">{quickSubItem.subject}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">المعلم الأساسي (الغائب):</span>
                  <strong className="text-rose-600 font-bold">{quickSubItem.teacher}</strong>
                </div>
              </div>

              {/* اختيار المعلم البديل */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>المعلم البديل المكلف (الموجود بالمدرسة):</span>
                </label>
                <input
                  type="text"
                  list="quick-sub-teachers-list"
                  value={substituteTeacherInput}
                  onChange={(e) => setSubstituteTeacherInput(e.target.value)}
                  placeholder="اكتب اسم المعلم البديل أو اختر من القائمة..."
                  className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-emerald-800 font-bold focus:outline-none transition shadow-2xs"
                  autoFocus
                />
                <datalist id="quick-sub-teachers-list">
                  {availableTeachers
                    .filter((t) => t !== quickSubItem.teacher)
                    .map((t) => (
                      <option key={t} value={t} />
                    ))}
                </datalist>

                {/* اقتراحات سريعة للمعلمين المتاحين */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 self-center">اقتراحات سريعة:</span>
                  {availableTeachers
                    .filter((t) => t !== quickSubItem.teacher)
                    .slice(0, 6)
                    .map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSubstituteTeacherInput(t)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                          substituteTeacherInput === t
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500 font-bold'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                </div>
              </div>

              {/* ملاحظات التكليف */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات التكليف (اختياري):</label>
                <input
                  type="text"
                  value={quickSubNotes}
                  onChange={(e) => setQuickSubNotes(e.target.value)}
                  placeholder="مثال: احتياط تخصص في غرفة مصادر التعلم"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* أزرار الحفظ */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickSubItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-xs font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد وعكس التكليف على الجدول فوراً</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة نقل فصل دراسي كامل بين المعلمين */}
      {showTransferClassModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-amber-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 font-['Cairo']">
                    نقل فصل دراسي كامل بين المعلمين
                  </h4>
                  <p className="text-xs text-slate-500">
                    تصحيح توزيع الفصول ونقل جميع حصص الفصل إلى المعلم البديل بالجدول فوراً
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferClassModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTransferClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المعلم الحالي (الذي يحمل الفصل حالياً):
                </label>
                <select
                  value={transferSourceTeacher}
                  onChange={(e) => {
                    setTransferSourceTeacher(e.target.value);
                    setTransferClass('');
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                >
                  <option value="">-- اختر المعلم الحالي --</option>
                  {availableTeachers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الفصل المراد نقله من جدول هذا المعلم:
                </label>
                <select
                  value={transferClass}
                  onChange={(e) => setTransferClass(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                  disabled={!transferSourceTeacher || sourceTeacherClasses.length === 0}
                >
                  <option value="">-- اختر الفصل --</option>
                  {sourceTeacherClasses.map((c) => {
                    const count = timetable.filter(
                      (i) => i.teacher?.trim() === transferSourceTeacher.trim() && i.gradeClass?.trim() === c
                    ).length;
                    return (
                      <option key={c} value={c}>
                        فصل {c} ({count} حصص أسبوعياً)
                      </option>
                    );
                  })}
                </select>
                {transferSourceTeacher && sourceTeacherClasses.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    لا توجد فصول مسجلة حالياً للأستاذ {transferSourceTeacher} بالجدول.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المعلم البديل (الذي سيستلم هذا الفصل):
                </label>
                <select
                  value={transferTargetTeacher}
                  onChange={(e) => setTransferTargetTeacher(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                >
                  <option value="">-- اختر المعلم الجديد --</option>
                  {availableTeachers
                    .filter((t) => t !== transferSourceTeacher)
                    .map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  مسمى المادة للمعلم الجديد (اختياري - يترك فارغاً للحفاظ على نفس المادة):
                </label>
                <select
                  value={transferTargetSubject}
                  onChange={(e) => setTransferTargetSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- الاحتفاظ بمسمى المادة الحالي --</option>
                  {OFFICIAL_SUBJECTS_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {transferSourceTeacher && transferClass && transferTargetTeacher && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] space-y-1 text-amber-800">
                  <p className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>تأكيد عملية النقل:</span>
                  </p>
                  <p>
                    سيتم تحويل جميع حصص الفصل ({transferClass}) البالغ عددها{' '}
                    <span className="font-bold text-slate-900 underline">{lessonsToTransferCount} حصة</span>{' '}
                    من الأستاذ ({transferSourceTeacher}) إلى الأستاذ ({transferTargetTeacher}).
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!transferSourceTeacher || !transferClass || !transferTargetTeacher}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-xs"
                >
                  تأكيد نقل الفصل وتحديث الجدول الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransferClassModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تعديل حصة محددة */}
      {editingItem && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-800 font-['Cairo'] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-600" />
                <span>تعديل بيانات الحصة</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">المعلم:</label>
                <select
                  value={editTeacher}
                  onChange={(e) => setEditTeacher(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                >
                  {availableTeachers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اليوم:</label>
                  <select
                    value={editDay}
                    onChange={(e) => setEditDay(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {SCHOOL_WEEK_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحصة:</label>
                  <select
                    value={editPeriodId}
                    onChange={(e) => setEditPeriodId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {periods.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الصف والفصل:</label>
                  <select
                    value={editGradeClass}
                    onChange={(e) => setEditGradeClass(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {OFFICIAL_CLASSES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المادة:</label>
                  <select
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {OFFICIAL_SUBJECTS_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">القاعة الدراسية:</label>
                <input
                  type="text"
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  placeholder="مثال: قاعة 5/1"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs"
                >
                  حفظ التعديلات على الجدول
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة فترة / مسمى وتوقيت جديد */}
      {showAddPeriodModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-indigo-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 font-['Cairo']">
                    إضافة فترة / مسمى وتوقيت جديد
                  </h4>
                  <p className="text-xs text-slate-500">
                    أضف حصة جديدة أو فسحة أو طابور مع تحديد التوقيت والمسمى
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPeriodModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addPeriodError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{addPeriodError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmAddPeriod} className="space-y-4 text-xs">
              {/* نماذج وتسميات سريعة جاهزة للاختيار */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  نماذج سريعة للتسمية:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const count = localPeriods.filter((p) => !p.isBreak).length + 1;
                      setAddPeriodName(`الحصة ${count}`);
                      setAddPeriodId(`p${count}`);
                      setAddPeriodIsBreak(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold transition text-[11px]"
                  >
                    + حصة تدريسية جديدة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const count = localPeriods.filter((p) => p.isBreak && p.id.startsWith('b')).length + 1;
                      setAddPeriodName(`فسحة إضافية ${count}`);
                      setAddPeriodId(`b${count}`);
                      setAddPeriodIsBreak(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold transition text-[11px]"
                  >
                    + فسحة أو استراحة
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddPeriodName('طابور الصباح والنشيد الوطني');
                      setAddPeriodId('p0');
                      setAddPeriodStartTime('06:45');
                      setAddPeriodEndTime('07:00');
                      setAddPeriodIsBreak(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition text-[11px]"
                  >
                    + طابور الصباح
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddPeriodName('صلاة الظهر والاستراحة');
                      setAddPeriodId('pray');
                      setAddPeriodIsBreak(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 font-bold transition text-[11px]"
                  >
                    + صلاة واستراحة
                  </button>
                </div>
              </div>

              {/* مسمى الفترة */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  مسمى الفترة أو الحصة: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={addPeriodName}
                  onChange={(e) => setAddPeriodName(e.target.value)}
                  placeholder="مثال: الحصة التاسعة أو صلاة الظهر أو الفسحة الثانية"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* نوع الفترة والمعرف */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الفترة:</label>
                  <select
                    value={addPeriodIsBreak ? 'break' : 'teaching'}
                    onChange={(e) => setAddPeriodIsBreak(e.target.value === 'break')}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="teaching">📚 حصة تدريسية (لها فصول وجدول)</option>
                    <option value="break">☕ استراحة / فسحة / طابور / صلاة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    المعرف المختصر (الكود):
                  </label>
                  <input
                    type="text"
                    value={addPeriodId}
                    onChange={(e) => setAddPeriodId(e.target.value)}
                    placeholder="مثال: p9 أو b4"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500">رمز إنجليزي مختصر بدون مسافات</span>
                </div>
              </div>

              {/* أوقات البدء والانتهاء */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">وقت البدء:</label>
                  <input
                    type="time"
                    value={addPeriodStartTime}
                    onChange={(e) => setAddPeriodStartTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-center focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">وقت الانتهاء:</label>
                  <input
                    type="time"
                    value={addPeriodEndTime}
                    onChange={(e) => setAddPeriodEndTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-center focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* المدة المحسوبة */}
              {(() => {
                const dur = getPeriodDurationMinutes(addPeriodStartTime, addPeriodEndTime);
                if (dur <= 0) {
                  return (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>تنبيه: وقت الانتهاء يجب أن يكون لاحقاً لوقت البدء.</span>
                    </div>
                  );
                }
                return (
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 flex items-center justify-between">
                    <span>إجمالي مدة الفترة:</span>
                    <span className="font-bold font-mono text-indigo-900 text-sm">{dur} دقيقة</span>
                  </div>
                );
              })()}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!addPeriodName.trim() || getPeriodDurationMinutes(addPeriodStartTime, addPeriodEndTime) <= 0}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-xs active:scale-95"
                >
                  إضافة الفترة وتثبيتها الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPeriodModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد حذف الفترة (مودال مدمج يعمل 100% داخل iFrame) */}
      {periodToDelete && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-rose-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2 font-['Cairo']">تأكيد حذف الفترة</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف فترة <strong className="text-rose-600 font-bold">"{periodToDelete.name}"</strong> ({periodToDelete.startTime} - {periodToDelete.endTime}) نهائياً من الجدول والمواقيت؟
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmDeletePeriod}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition shadow-xs active:scale-95"
              >
                نعم، حذف الفترة الآن
              </button>
              <button
                type="button"
                onClick={() => setPeriodToDelete(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد استعادة مواقيت الـ 8 حصص المعتمدة */}
      {showResetPeriodsConfirm && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-amber-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <RotateCcw className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2 font-['Cairo']">استعادة المواقيت الرسمية</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              هل ترغب في إعادة ضبط التوقيت إلى النصاب المعتمد (8 حصص تدريسية + الفسح والطابور والانصراف)؟
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetToDefault8Periods}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition shadow-xs active:scale-95"
              >
                نعم، استعادة المواقيت
              </button>
              <button
                type="button"
                onClick={() => setShowResetPeriodsConfirm(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد استبدال الجدول القديم بالجدول المستورد */}
      {showReplaceTimetableConfirm && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-right">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
              <RotateCcw className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-800 mb-2 font-['Cairo'] text-center">
              تأكيد استبدال الجدول القديم بالجدول المستورد
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-4 space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">عدد سجلات الجدول الحالي:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{timetable.length} حصة</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">عدد سجلات الجدول المستورد الجديد:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {pendingImportedTimetable.length} حصة
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">عدد الفصول في الجدول الجديد:</span>
                <span className="font-mono font-bold text-indigo-700 text-sm">
                  {new Set(pendingImportedTimetable.map((i) => i.gradeClass)).size} فصلاً
                </span>
              </div>
              <div className="pt-1">
                <p className="text-[11px] leading-relaxed text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 font-medium">
                  🛡️ <strong>تنبيه أمان البيانات:</strong> هذه العملية ستستبدل الجدول المدرسي فقط بالجدول المستورد الجديد. الإعدادات، المناوبات، الإعلانات، مواعيد الفترات، سجل المواد، وقائمة المعلمات لن تُحذف وستبقى محفوظة ومستقرة تماماً.
                </p>
              </div>
            </div>

            {validationWarnings.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>تنبيهات فحص الجدول:</span>
                </div>
                {validationWarnings.map((w, idx) => (
                  <p key={idx} className="text-[11px] leading-tight">• {w}</p>
                ))}
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>أخطاء تمنع الاستبدال:</span>
                </div>
                {validationErrors.map((err, idx) => (
                  <p key={idx} className="text-[11px] leading-tight font-mono text-rose-700">• {err}</p>
                ))}
              </div>
            )}

            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={handleExecuteReplaceTimetable}
                disabled={isSubmitting || validationErrors.length > 0 || pendingImportedTimetable.length === 0}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs transition shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>جاري استبدال ومزامنة الجدول...</span>
                ) : (
                  <span>نعم، استبدال الجدول القديم الآن</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowReplaceTimetableConfirm(false)}
                disabled={isSubmitting}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تأكيد إفراغ الجدول لمدرسة جديدة */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-right">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2 font-['Cairo']">
              تصفير وإفراغ الجدول لمدرسة جديدة
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              هل أنت متأكد من رغبتك في إفراغ كافة حصص الجدول المدرسي الحالي (حذف {timetable.length} حصة)؟
              <br />
              <span className="text-rose-600 font-bold block mt-1.5">
                سيصبح الجدول فارغاً تماماً للبدء من الصفر ورفع جدول مدرستك الجديد عبر Excel أو الربط السحابي.
              </span>
              (يمكنك دائماً استعادة جدول العرض التجريبي الـ 32 فصلاً في أي وقت لاحقاً).
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handleClearTimetableForNewSchool}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition shadow-xs active:scale-95"
              >
                نعم، إفراغ الجدول الآن
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة دليل وتوزيع المعلمين حسب المواد الدراسية */}
      {showTeachersModal && (
        <TeachersBySubjectModal
          isOpen={showTeachersModal}
          onClose={() => setShowTeachersModal(false)}
          timetable={timetable}
          onBulkReplaceTimetable={onBulkReplaceTimetable}
          gasUrl={gasUrl}
        />
      )}
    </div>
  );
};
