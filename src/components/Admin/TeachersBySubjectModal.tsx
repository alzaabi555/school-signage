import React, { useState, useMemo } from 'react';
import { ClassScheduleItem } from '../../types';
import {
  getTeachersBySubject,
  saveTeachersBySubject,
  addTeacherToSubject,
  removeTeacherFromSubject,
  transferTeacherWithTimetableUpdate,
  transferClassBetweenTeachers,
  autoDistributeTeachersFromTimetable,
  calculateTeacherStats,
  exportTeachersBySubjectToExcel,
  STORAGE_TEACHERS_BY_SUBJECT,
} from '../../utils/teachersUtils';
import { OFFICIAL_SUBJECTS_LIST, OFFICIAL_CLASSES_LIST } from '../../data/officialTimetableData';
import { normalizeTeacherNameCanonical } from '../../utils/excelUtils';
import {
  Users,
  BookOpen,
  Plus,
  Trash2,
  X,
  Search,
  Download,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Award,
  Eye,
  ArrowRightLeft,
  CheckCircle,
  ShieldCheck,
  Table,
  Edit2,
  Save,
  PlusCircle,
  CloudUpload,
  RefreshCw,
} from 'lucide-react';
import { addTeacherToRemote, syncTeachersMapToRemote } from '../../services/apiService';

interface TeachersBySubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: ClassScheduleItem[];
  onBulkReplaceTimetable?: (items: ClassScheduleItem[]) => Promise<any> | void;
  onSelectTeacherForSubstitution?: (teacherName: string, subject: string, role: 'absent' | 'substitute') => void;
  gasUrl?: string;
  onTeachersUpdated?: (newMap: Record<string, string[]>) => void;
}

export const TeachersBySubjectModal: React.FC<TeachersBySubjectModalProps> = ({
  isOpen,
  onClose,
  timetable,
  onBulkReplaceTimetable,
  onSelectTeacherForSubstitution,
  gasUrl,
  onTeachersUpdated,
}) => {
  const [teachersMap, setTeachersMap] = useState<Record<string, string[]>>(() => getTeachersBySubject(timetable));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  // وضع العرض: جدول التوزيع السريع لكافة المعلمين (matrix) أو بطاقات الأقسام (cards)
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  // خيار تحديث مسمى المادة في جدول الحصص أيضاً عند نقل المعلم
  const [syncWithTimetable, setSyncWithTimetable] = useState<boolean>(true);

  // إضافة معلم جديد
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState(OFFICIAL_SUBJECTS_LIST[0] || 'رياضيات');

  // إضافة مادة دراسية جديدة
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // استعراض جدول حصص معلم
  const [previewTeacher, setPreviewTeacher] = useState<string | null>(null);

  // نافذة نقل فصل دراسي كامل بين المعلمين
  const [showTransferClassModal, setShowTransferClassModal] = useState(false);
  const [transferSourceTeacher, setTransferSourceTeacher] = useState('');
  const [transferClass, setTransferClass] = useState('');
  const [transferTargetTeacher, setTransferTargetTeacher] = useState('');
  const [transferTargetSubject, setTransferTargetSubject] = useState('');

  // تعديل حصة دراسية لمعلم
  const [editingLesson, setEditingLesson] = useState<ClassScheduleItem | null>(null);
  const [editLessonDay, setEditLessonDay] = useState('');
  const [editLessonPeriod, setEditLessonPeriod] = useState('');
  const [editLessonClass, setEditLessonClass] = useState('');
  const [editLessonSubject, setEditLessonSubject] = useState('');
  const [editLessonRoom, setEditLessonRoom] = useState('');

  // إضافة حصة دراسية جديدة للمعلم
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [addLessonDay, setAddLessonDay] = useState('الأحد');
  const [addLessonPeriod, setAddLessonPeriod] = useState('p1');
  const [addLessonClass, setAddLessonClass] = useState('5/1');
  const [addLessonSubject, setAddLessonSubject] = useState('');
  const [addLessonRoom, setAddLessonRoom] = useState('');

  // تحديث الحسابات والإحصائيات
  const teacherStats = useMemo(() => {
    return calculateTeacherStats(timetable, teachersMap);
  }, [timetable, teachersMap]);

  // إحصائيات عامة
  const allTeachersList = useMemo(() => {
    const list: { teacher: string; subject: string }[] = [];
    Object.entries(teachersMap).forEach(([subj, teachers]) => {
      teachers.forEach((t) => {
        list.push({ teacher: t, subject: subj });
      });
    });
    // ترتيب أبجدي حسب اسم المعلم
    return list.sort((a, b) => a.teacher.localeCompare(b.teacher, 'ar'));
  }, [teachersMap]);

  const totalTeachersCount = allTeachersList.length;
  const totalSubjectsCount = useMemo(() => Object.keys(teachersMap).length, [teachersMap]);

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

  // إجراء نقل فصل كامل من معلم إلى معلم آخر
  const handleConfirmClassTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSourceTeacher || !transferTargetTeacher || !transferClass) {
      alert('يرجى اختيار المعلم الحالي، الفصل، والمعلم البديل');
      return;
    }
    if (transferSourceTeacher === transferTargetTeacher) {
      alert('لا يمكن نقل الفصل إلى نفس المعلم الحالي');
      return;
    }

    const { updatedTimetable, transferredCount } = transferClassBetweenTeachers(
      transferSourceTeacher,
      transferTargetTeacher,
      transferClass,
      timetable,
      transferTargetSubject ? { targetSubject: transferTargetSubject } : undefined
    );

    if (onBulkReplaceTimetable) {
      await onBulkReplaceTimetable(updatedTimetable);
    }

    // تحديث التوزيع التلقائي لحفظ التعديلات
    const newMapping = autoDistributeTeachersFromTimetable(updatedTimetable);
    setTeachersMap(newMapping);
    saveTeachersBySubject(newMapping);

    setFeedbackMsg(
      `تم بنجاح نقل الفصل (${transferClass}) بواقع (${transferredCount}) حصة أسبوعياً من الأستاذ (${transferSourceTeacher}) إلى الأستاذ (${transferTargetTeacher})!`
    );
    setShowTransferClassModal(false);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // فتح نافذة تعديل حصة
  const handleOpenEditLesson = (lesson: ClassScheduleItem) => {
    setEditingLesson(lesson);
    setEditLessonDay(lesson.day);
    setEditLessonPeriod(lesson.periodId);
    setEditLessonClass(lesson.gradeClass);
    setEditLessonSubject(lesson.subject);
    setEditLessonRoom(lesson.room || `قاعة ${lesson.gradeClass}`);
  };

  // حفظ تعديل حصة
  const handleSaveEditLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    const updatedTimetable = timetable.map((item) => {
      if (item.id === editingLesson.id) {
        return {
          ...item,
          day: editLessonDay,
          periodId: editLessonPeriod,
          gradeClass: editLessonClass,
          subject: editLessonSubject,
          room: editLessonRoom,
        };
      }
      return item;
    });

    if (onBulkReplaceTimetable) {
      await onBulkReplaceTimetable(updatedTimetable);
    }
    setEditingLesson(null);
    setFeedbackMsg('تم حفظ تعديل بيانات الحصة بنجاح!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // حذف حصة من جدول المعلم
  const handleDeleteLesson = async (lessonId: string) => {
    const updatedTimetable = timetable.filter((item) => item.id !== lessonId);
    if (onBulkReplaceTimetable) {
      await onBulkReplaceTimetable(updatedTimetable);
    }
    setFeedbackMsg('تم حذف الحصة من الجدول بنجاح!');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // إضافة حصة جديدة للمعلم
  const handleAddLessonToTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewTeacher) return;
    const newLesson: ClassScheduleItem = {
      id: `tt-custom-${Date.now().toString().slice(-6)}`,
      day: addLessonDay,
      periodId: addLessonPeriod,
      gradeClass: addLessonClass,
      subject: addLessonSubject || teacherStats[previewTeacher]?.subject || 'مادة عامة',
      teacher: previewTeacher,
      room: addLessonRoom || `قاعة ${addLessonClass}`,
    };

    const updatedTimetable = [...timetable, newLesson];
    if (onBulkReplaceTimetable) {
      await onBulkReplaceTimetable(updatedTimetable);
    }
    setShowAddLessonModal(false);
    setFeedbackMsg(`تمت إضافة الحصة بنجاح لجدول الأستاذ (${previewTeacher})!`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };


  // إجراء نقل المعلم لمادة أخرى بأمان كامل
  const handleTransferTeacher = async (teacher: string, targetSubject: string) => {
    const cleanTeacher = teacher.trim();
    const cleanTarget = targetSubject.trim();
    if (!cleanTeacher || !cleanTarget) return;

    const { updatedMapping, updatedTimetable, affectedCount } = transferTeacherWithTimetableUpdate(
      cleanTeacher,
      cleanTarget,
      timetable,
      syncWithTimetable
    );

    setTeachersMap({ ...updatedMapping });

    if (syncWithTimetable && onBulkReplaceTimetable && affectedCount > 0) {
      await onBulkReplaceTimetable(updatedTimetable);
      setFeedbackMsg(
        `تم بنجاح نقل المعلم (${cleanTeacher}) إلى مادة (${cleanTarget}) وتحديث مسمى المادة في (${affectedCount}) حصة بالجدول مع الحفاظ الكامل على حصصه وفصوله!`
      );
    } else {
      setFeedbackMsg(
        `تم بنجاح نقل المعلم (${cleanTeacher}) إلى مادة (${cleanTarget}) مع الحفاظ الكامل على جميع حصصه بالجدول!`
      );
    }

    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // إضافة معلم جديد وتسكينه في مادة مع الرفع التلقائي للسحابة
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawName = newTeacherName.trim();
    const cleanSubject = newTeacherSubject.trim();
    if (!rawName || !cleanSubject) return;

    const cleanTeacher = normalizeTeacherNameCanonical(rawName);
    const isTrainee = cleanTeacher.includes('متدرب');
    const teacherType = isTrainee ? 'معلم متدرب' : 'معلم أساسي';

    // 1. التحديث المحلي الفوري وحفظه
    const updated = addTeacherToSubject(cleanTeacher, cleanSubject, timetable);
    setTeachersMap({ ...updated });
    setNewTeacherName('');
    setShowAddTeacherForm(false);
    if (onTeachersUpdated) onTeachersUpdated(updated);

    // 2. الرفع التلقائي المباشر للسحابة في Google Sheets حتى يظهر على جميع الأجهزة
    if (gasUrl && gasUrl.trim().startsWith('http')) {
      setFeedbackMsg(`تمت إضافة (${cleanTeacher}) محلياً، وجاري الرفع التلقائي للسحابة (Google Sheets)...`);
      try {
        const res = await addTeacherToRemote(gasUrl, {
          teacher: cleanTeacher,
          subject: cleanSubject,
          type: teacherType,
          notes: isTrainee ? 'معلم متدرب' : 'معلم جديد',
        });

        // مزامنة الدليل الكامل لضمان التوافق المطلق مع السحابة
        await syncTeachersMapToRemote(gasUrl, updated);

        if (res && res.success) {
          setFeedbackMsg(
            `✅ تم بنجاح إضافة المعلم (${cleanTeacher}) ورفعه تلقائياً للسحابة في Google Sheets! ستظهر بياناته على جميع الأجهزة فوراً.`
          );
        } else {
          setFeedbackMsg(`✅ تمت إضافة المعلم (${cleanTeacher}) ومزامنة دليل المعلمين مع السحابة بنجاح!`);
        }
      } catch (err) {
        console.warn('تعذر الرفع السحابي الفوري للمعلم الجديد:', err);
        setFeedbackMsg(
          `تمت إضافة المعلم (${cleanTeacher}) محلياً على هذا الجهاز. (تعذر الاتصال بالسحابة حالياً، يمكنك الضغط على "مزامنة السحابة" لاحقاً).`
        );
      }
    } else {
      setFeedbackMsg(
        `تمت إضافة المعلم (${cleanTeacher}) إلى مادة (${cleanSubject}) محلياً بنجاح! (يرجى تفعيل رابط السحابة ليتم رفعه ومزامنته عبر جميع الأجهزة).`
      );
    }

    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // رفع ومزامنة دليل كافة المعلمين والمتدربين يدوياً مع السحابة بضغطة زر
  const handleSyncAllTeachersWithCloud = async () => {
    if (!gasUrl || !gasUrl.trim().startsWith('http')) {
      alert('يرجى ضبط وتفعيل رابط Google Apps Script في تبويب "الربط السحابي" أولاً.');
      return;
    }

    setIsSyncingCloud(true);
    setFeedbackMsg('جاري رفع ومزامنة كافة المعلمين والمتدربين مع ورقة "دليل_المعلمين" في Google Sheets...');
    try {
      const res = await syncTeachersMapToRemote(gasUrl, teachersMap);
      if (res && res.success) {
        setFeedbackMsg(
          `✅ تم بنجاح رفع ومزامنة دليل المعلمين بالكامل (${totalTeachersCount} معلماً ومتدرباً) إلى السحابة على Google Sheets! الآن تظهر التعديلات على كافة الأجهزة فوراً.`
        );
      } else {
        setFeedbackMsg(`⚠️ تنبيه المزامنة: ${res?.message || 'فشلت المزامنة مع السحابة'}`);
      }
    } catch (err) {
      console.error('فشل المزامنة مع السحابة:', err);
      setFeedbackMsg('حدث خطأ أثناء الاتصال بـ Google Sheets لمزامنة دليل المعلمين.');
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  // إضافة مادة دراسية جديدة
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubjectName.trim();
    if (!trimmed) return;

    if (!teachersMap[trimmed]) {
      const updated = { ...teachersMap, [trimmed]: [] };
      saveTeachersBySubject(updated);
      setTeachersMap(updated);
      setSelectedSubject(trimmed);
      if (onTeachersUpdated) onTeachersUpdated(updated);
      if (gasUrl && gasUrl.trim().startsWith('http')) {
        syncTeachersMapToRemote(gasUrl, updated).catch(console.warn);
      }
      setFeedbackMsg(`تمت إضافة المادة الدراسية الجديدة (${trimmed}) بنجاح! يمكنك الآن نقل المعلمين إليها.`);
    }
    setNewSubjectName('');
    setShowAddSubjectModal(false);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // التوزيع التلقائي الذكي بحسب جداول الحصص
  const handleAutoDistributeFromTimetable = () => {
    const distributed = autoDistributeTeachersFromTimetable(timetable);
    setTeachersMap({ ...distributed });
    saveTeachersBySubject(distributed);
    if (onTeachersUpdated) onTeachersUpdated(distributed);
    if (gasUrl && gasUrl.trim().startsWith('http')) {
      syncTeachersMapToRemote(gasUrl, distributed).catch(console.warn);
    }
    setFeedbackMsg('تم بنجاح فحص الحصص وإعادة تسكين المعلمين في المواد المستخرجة من الجدول!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // حذف أو فك ارتباط معلم من مادة
  const handleRemoveTeacher = (teacher: string, subject: string) => {
    const updated = removeTeacherFromSubject(teacher, subject, timetable);
    setTeachersMap({ ...updated });
    if (onTeachersUpdated) onTeachersUpdated(updated);
    if (gasUrl && gasUrl.trim().startsWith('http')) {
      syncTeachersMapToRemote(gasUrl, updated).catch(console.warn);
    }
    setFeedbackMsg(`تم فك ارتباط المعلم (${teacher}) من مادة (${subject}). حصصه بالجدول لا تزال محفوظة.`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // استعادة التوزيع المعتمد
  const handleResetToOfficial = () => {
    localStorage.removeItem(STORAGE_TEACHERS_BY_SUBJECT);
    const clean = autoDistributeTeachersFromTimetable(timetable);
    setTeachersMap(clean);
    setFeedbackMsg('تمت استعادة التوزيع المعتمد بنجاح!');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // تصدير كإكسل
  const handleExportExcel = () => {
    exportTeachersBySubjectToExcel(teachersMap, teacherStats);
  };

  // تصفية المعلمين حسب البحث والمادة
  const filteredTeachersList = useMemo(() => {
    return allTeachersList.filter((item) => {
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return item.teacher.toLowerCase().includes(q) || item.subject.toLowerCase().includes(q);
    });
  }, [allTeachersList, selectedSubject, searchQuery]);

  // الإرجاع الشرطي بعد جميع Hooks لمنع اختلاف ترتيبها عند فتح النافذة.
  if (!isOpen) return null;

  // تصفية المواد لعرض البطاقات
  const filteredSubjects = Object.entries(teachersMap).filter(([subject, teachers]) => {
    if (selectedSubject !== 'all' && subject !== selectedSubject) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    if (subject.toLowerCase().includes(q)) return true;
    return teachers.some((t) => t.toLowerCase().includes(q));
  });

  // جدول حصص المعلم المحدد للمعاينة
  const previewLessons = previewTeacher
    ? timetable.filter((t) => t.teacher?.trim() === previewTeacher.trim())
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl relative text-right overflow-hidden">
        {/* 1. الترويسة الرئيسية */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50/60 via-slate-50 to-indigo-50/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-black text-slate-800 font-['Cairo']">
                  إدارة وتوزيع ونقل المعلمين بين المواد الدراسية
                </h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {totalTeachersCount} معلماً
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تسكين ونقل كل معلم إلى مادته الصحيحة بنقرة واحدة مع ضمان بقاء جميع حصصه وفصوله الـ 32 محفوظة
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* التبديل بين طريقة العرض: جدول سريع / بطاقات */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  viewMode === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="عرض جدول التوزيع السريع لجميع المعلمين"
              >
                <Table className="w-3.5 h-3.5" />
                <span>جدول النقل السريع</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="عرض حسب أقسام المواد الدراسية"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>أقسام المواد</span>
              </button>
            </div>

            {/* زر التوزيع التلقائي من الجدول */}
            <button
              onClick={handleAutoDistributeFromTimetable}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
              title="يستخرج مواد المعلمين تلقائياً من واقع حصصهم بالجدول ويسكن كل معلم في مادته الصحيحة"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">توزيع تلقائي</span>
            </button>

            {/* زر نقل فصل دراسي كامل لمعلم آخر */}
            <button
              onClick={() => {
                const firstT = allTeachersList[0]?.teacher || '';
                setTransferSourceTeacher(firstT);
                setTransferClass('');
                setTransferTargetTeacher('');
                setTransferTargetSubject('');
                setShowTransferClassModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs active:scale-95 border border-amber-300"
              title="نقل فصل دراسي بالكامل من معلم إلى معلم آخر وتحديث الجدول فوراً"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>نقل فصل لمعلم آخر</span>
            </button>

            {/* زر رفع ومزامنة دليل المعلمين والمتدربين مع السحابة */}
            <button
              onClick={handleSyncAllTeachersWithCloud}
              disabled={isSyncingCloud}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition shadow-xs active:scale-95 disabled:opacity-50"
              title="رفع ومزامنة كافة المعلمين والمتدربين إلى ورقة 'دليل_المعلمين' في Google Sheets"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-bounce text-amber-300' : ''}`} />
              <span>{isSyncingCloud ? 'جاري المزامنة...' : 'مزامنة السحابة'}</span>
            </button>

            {/* تصدير إكسل */}
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
              title="تصدير قائمة المعلمين والمواد كملف Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              onClick={handleResetToOfficial}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold border border-slate-200 transition"
              title="استعادة التوزيع الأولي"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. شريط الطمأنينة والأمان وتحديث الجدول والمزامنة السحابية */}
        <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-700">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>أمان تام:</strong> نقل أي معلم إلى مادة أخرى لا يحذف أي حصة من حصصه وفصوله، وتظل محفوظة في الجدول.
              </span>
            </div>

            {gasUrl && gasUrl.trim().startsWith('http') ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-lg shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                السحابة متصلة (أي معلم أو متدرب جديد يرفع تلقائياً لـ Google Sheets ويظهر على كل الأجهزة)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                السحابة غير مفعلة (الحفظ محلي فقط، اضبط رابط السحابة لمزامنة الأجهزة)
              </span>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none bg-white border border-indigo-200 px-3 py-1 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition shadow-2xs">
            <input
              type="checkbox"
              checked={syncWithTimetable}
              onChange={(e) => setSyncWithTimetable(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] text-indigo-700 font-semibold">
              تحديث مسمى المادة تلقائياً في حصص المعلم بالجدول أيضاً
            </span>
          </label>
        </div>

        {/* إشعار التغذية الراجعة */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-bold animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
        )}

        {/* 3. شريط البحث والفلترة وإضافة معلم أو مادة */}
        <div className="p-3 md:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* حقل البحث */}
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن اسم معلم أو مادة..."
                className="w-full bg-white border border-slate-300 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
            </div>

            {/* فلترة حسب المادة */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-bold shadow-2xs"
            >
              <option value="all">جميع المواد ({totalSubjectsCount})</option>
              {Object.keys(teachersMap).map((subj) => (
                <option key={subj} value={subj}>
                  {subj} ({teachersMap[subj]?.length || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddSubjectModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition shadow-2xs"
              title="إضافة مادة جديدة"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>إضافة مادة جديدة</span>
            </button>

            <button
              onClick={() => setShowAddTeacherForm(!showAddTeacherForm)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة معلم</span>
            </button>
          </div>
        </div>

        {/* نموذج إضافة معلم جديد */}
        {showAddTeacherForm && (
          <form
            onSubmit={handleAddTeacher}
            className="p-4 bg-indigo-50/60 border-b border-indigo-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المعلم الجديد:</label>
              <input
                type="text"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                placeholder="مثال: أ. سالم الهنائي"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تسكينه في مادة:</label>
              <select
                value={newTeacherSubject}
                onChange={(e) => setNewTeacherSubject(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
              >
                {Object.keys(teachersMap).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
              >
                حفظ وإدراج بالمادة
              </button>
              <button
                type="button"
                onClick={() => setShowAddTeacherForm(false)}
                className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* نافذة إضافة مادة دراسية جديدة */}
        {showAddSubjectModal && (
          <form
            onSubmit={handleCreateSubject}
            className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex flex-wrap items-end gap-3 animate-fade-in"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-emerald-800 mb-1">اسم المادة الدراسية الجديدة:</label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="مثال: فيزياء ، كيمياء ، تاريخ..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              إضافة المادة للقائمة
            </button>
            <button
              type="button"
              onClick={() => setShowAddSubjectModal(false)}
              className="px-3 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs rounded-xl"
            >
              إلغاء
            </button>
          </form>
        )}

        {/* 4. محتوى النافذة الرئيسي */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 scrollbar-thin">
          {viewMode === 'matrix' ? (
            /* جدول التوزيع السريع لجميع المعلمين */
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">اسم المعلم</th>
                      <th className="py-3 px-3">المادة الحالية</th>
                      <th className="py-3 px-3">نقل مباشر إلى مادة أخرى</th>
                      <th className="py-3 px-3 text-center">نصاب الحصص</th>
                      <th className="py-3 px-3">الفصول المسندة بالجدول</th>
                      <th className="py-3 px-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTeachersList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          لا يوجد معلمون يطابقون عبارة البحث الحالية.
                        </td>
                      </tr>
                    ) : (
                      filteredTeachersList.map(({ teacher, subject }, idx) => {
                        const st = teacherStats[teacher];
                        const totalLessons = st?.totalPeriods || 0;
                        const classesList = st?.classes || [];

                        return (
                          <tr key={`${subject}::${teacher}`} className="hover:bg-slate-50/80 transition">
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>

                            <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span>{teacher}</span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                                {subject}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <ArrowRightLeft className="w-3 h-3 text-indigo-500 shrink-0" />
                                <select
                                  value={subject}
                                  onChange={(e) => handleTransferTeacher(teacher, e.target.value)}
                                  className="bg-slate-50 border border-slate-300 hover:border-indigo-500 rounded-lg px-2 py-1 text-slate-800 font-bold focus:outline-none text-[11px] max-w-[170px]"
                                  title="انقل المعلم إلى أي مادة فوراً مع الحفاظ على جميع حصصه"
                                >
                                  {Object.keys(teachersMap).map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                {totalLessons} حصة
                              </span>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[240px]">
                                {classesList.length > 0 ? (
                                  classesList.slice(0, 5).map((c) => (
                                    <span
                                      key={c}
                                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px]"
                                    >
                                      {c}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400 text-[11px]">بدون حصص مجدولة</span>
                                )}
                                {classesList.length > 5 && (
                                  <span className="text-slate-400 font-mono text-[10px] self-center">
                                    +{classesList.length - 5}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setPreviewTeacher(teacher)}
                                  className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                  title="معاينة جدول حصص المعلم"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleRemoveTeacher(teacher, subject)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="فك ارتباط المعلم من المادة"
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
          ) : (
            /* استعراض حسب أقسام المواد (Cards Accordion) */
            filteredSubjects.map(([subject, teachers]) => {
              const matchedTeachers = teachers.filter((t) =>
                !searchQuery.trim() || t.toLowerCase().includes(searchQuery.toLowerCase())
              );
              const isExpanded =
                expandedSubject === subject || selectedSubject === subject || Boolean(searchQuery.trim());

              const totalSubjectLessons = matchedTeachers.reduce(
                (sum, t) => sum + (teacherStats[t]?.totalPeriods || 0),
                0
              );

              return (
                <div
                  key={subject}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition shadow-xs hover:border-slate-300"
                >
                  {/* شريط عنوان المادة */}
                  <div
                    onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between cursor-pointer transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-800 font-['Cairo']">{subject}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                            {teachers.length} معلمين
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          إجمالي الحصص بالجدول: <strong className="text-emerald-700 font-mono">{totalSubjectLessons} حصة</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* بطاقات المعلمين التابعين للمادة */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {matchedTeachers.map((teacher) => {
                          const st = teacherStats[teacher];
                          const totalLessons = st?.totalPeriods || 0;
                          const classesList = st?.classes || [];

                          return (
                            <div
                              key={teacher}
                              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition flex flex-col justify-between gap-2.5 shadow-2xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Award className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-xs font-black text-slate-800 block truncate">
                                      {teacher}
                                    </span>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                      <span>نصاب الحصص:</span>
                                      <strong className="text-emerald-700 font-mono">{totalLessons} حصة</strong>
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setPreviewTeacher(teacher)}
                                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                    title="معاينة جدول حصص المعلم"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveTeacher(teacher, subject)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                    title="فك ارتباط المعلم من المادة"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* الفصول المسندة */}
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10px]">
                                <span className="text-slate-500 block mb-0.5">الفصول المسندة:</span>
                                <div className="flex flex-wrap gap-1">
                                  {classesList.length > 0 ? (
                                    classesList.slice(0, 6).map((c) => (
                                      <span
                                        key={c}
                                        className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono"
                                      >
                                        {c}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-400">لا توجد حصص مجدولة</span>
                                  )}
                                  {classesList.length > 6 && (
                                    <span className="text-slate-400 font-mono">+{classesList.length - 6}</span>
                                  )}
                                </div>
                              </div>

                              {/* نقل المعلم لمادة أخرى */}
                              <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100 text-[10px]">
                                <span className="text-slate-600 font-bold flex items-center gap-1 shrink-0">
                                  <ArrowRightLeft className="w-3 h-3 text-indigo-600" />
                                  <span>نقل لمادة:</span>
                                </span>
                                <select
                                  value={subject}
                                  onChange={(e) => handleTransferTeacher(teacher, e.target.value)}
                                  className="bg-slate-50 border border-slate-300 hover:border-indigo-500 rounded-lg px-2 py-1 text-slate-700 focus:outline-none text-[10px] font-bold"
                                  title="نقل المعلم لمادة أخرى دون فقدان أي حصة"
                                >
                                  {Object.keys(teachersMap).map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* أزرار سريعة للاحتياط إن وجدت */}
                              {onSelectTeacherForSubstitution && (
                                <div className="flex gap-1.5 pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => onSelectTeacherForSubstitution(teacher, subject, 'absent')}
                                    className="flex-1 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition text-center"
                                  >
                                    تحديد كغائب
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onSelectTeacherForSubstitution(teacher, subject, 'substitute')}
                                    className="flex-1 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold transition text-center"
                                  >
                                    تكليف كبديل
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 5. نافذة منبثقة لمعاينة وإدارة وتعديل حصص المعلم الفردي */}
        {previewTeacher && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative text-right flex flex-col max-h-[90vh]">
              <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-3">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-800 font-['Cairo'] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>جدول وإدارة حصص الأستاذ: {previewTeacher}</span>
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      المادة: {teacherStats[previewTeacher]?.subject || 'عام'}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      إجمالي الحصص: {previewLessons.length} حصة
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddLessonDay('الأحد');
                      setAddLessonPeriod('p1');
                      setAddLessonClass(teacherStats[previewTeacher]?.classes[0] || '5/1');
                      setAddLessonSubject(teacherStats[previewTeacher]?.subject || '');
                      setAddLessonRoom(`قاعة ${teacherStats[previewTeacher]?.classes[0] || '5/1'}`);
                      setShowAddLessonModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
                    title="إضافة حصة دراسية جديدة لهذا المعلم"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة حصة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTransferSourceTeacher(previewTeacher);
                      setTransferClass(teacherStats[previewTeacher]?.classes[0] || '');
                      setTransferTargetTeacher('');
                      setTransferTargetSubject('');
                      setShowTransferClassModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs"
                    title="نقل أحد فصول هذا المعلم إلى زميل آخر"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>نقل فصل</span>
                  </button>

                  <button
                    onClick={() => setPreviewTeacher(null)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto border border-slate-200 rounded-2xl flex-1">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0 shadow-2xs border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">اليوم</th>
                      <th className="p-2.5">الحصة</th>
                      <th className="p-2.5">الصف والفصل</th>
                      <th className="p-2.5">المادة</th>
                      <th className="p-2.5">القاعة</th>
                      <th className="p-2.5 text-center">إجراءات الحصة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewLessons.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          لا توجد حصص مسجلة لهذا المعلم في الجدول الحالي
                        </td>
                      </tr>
                    ) : (
                      previewLessons.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-2.5 text-blue-700 font-bold">{l.day}</td>
                          <td className="p-2.5 font-mono text-slate-700">{l.periodId}</td>
                          <td className="p-2.5 text-slate-900 font-bold">{l.gradeClass}</td>
                          <td className="p-2.5 text-indigo-700">{l.subject}</td>
                          <td className="p-2.5 text-slate-500">{l.room}</td>
                          <td className="p-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditLesson(l)}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                                title="تعديل تفاصيل هذه الحصة"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(l.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                                title="حذف هذه الحصة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. نافذة نقل فصل دراسي كامل بين المعلمين */}
        {showTransferClassModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-amber-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-right">
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
                      تصحيح توزيع الفصول ونقل جميع حصص الفصل إلى المعلم البديل
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTransferClassModal(false)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmClassTransfer} className="space-y-4 text-xs">
                {/* 1. المعلم الحالي */}
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">-- اختر المعلم الحالي --</option>
                    {allTeachersList.map((t) => (
                      <option key={t.teacher} value={t.teacher}>
                        {t.teacher} ({t.subject} - {teacherStats[t.teacher]?.totalPeriods || 0} حصة)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. الفصل المراد نقله */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الفصل المراد نقله من جدول هذا المعلم:
                  </label>
                  <select
                    value={transferClass}
                    onChange={(e) => setTransferClass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
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
                    <p className="text-[11px] text-amber-700 mt-1">
                      لا توجد فصول مسجلة حالياً للأستاذ {transferSourceTeacher} بالجدول.
                    </p>
                  )}
                </div>

                {/* 3. المعلم البديل */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    المعلم البديل (الذي سيستلم هذا الفصل):
                  </label>
                  <select
                    value={transferTargetTeacher}
                    onChange={(e) => setTransferTargetTeacher(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">-- اختر المعلم الجديد --</option>
                    {allTeachersList
                      .filter((t) => t.teacher !== transferSourceTeacher)
                      .map((t) => (
                        <option key={t.teacher} value={t.teacher}>
                          {t.teacher} ({t.subject} - {teacherStats[t.teacher]?.totalPeriods || 0} حصة)
                        </option>
                      ))}
                  </select>
                </div>

                {/* 4. تحديث مسمى المادة تلقائياً */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    مسمى المادة للمعلم الجديد (اختياري - يترك فارغاً للحفاظ على نفس المادة):
                  </label>
                  <select
                    value={transferTargetSubject}
                    onChange={(e) => setTransferTargetSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- الاحتفاظ بمسمى المادة الحالي --</option>
                    {OFFICIAL_SUBJECTS_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* بطاقة ملخص النقل */}
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
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition shadow-xs"
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

        {/* 7. نافذة تعديل حصة محددة */}
        {editingLesson && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 shadow-2xl relative text-right">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-800 font-['Cairo'] flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  <span>تعديل الحصة للأستاذ: {editingLesson.teacher}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditLesson} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اليوم:</label>
                    <select
                      value={editLessonDay}
                      onChange={(e) => setEditLessonDay(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      required
                    >
                      {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الحصة:</label>
                    <select
                      value={editLessonPeriod}
                      onChange={(e) => setEditLessonPeriod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      required
                    >
                      {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'].map((p, idx) => (
                        <option key={p} value={p}>
                          الحصة {idx + 1} ({p})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الصف والفصل:</label>
                    <select
                      value={editLessonClass}
                      onChange={(e) => setEditLessonClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
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
                      value={editLessonSubject}
                      onChange={(e) => setEditLessonSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
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
                    value={editLessonRoom}
                    onChange={(e) => setEditLessonRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    placeholder="مثال: قاعة 5/1"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLesson(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 8. نافذة إضافة حصة جديدة للمعلم */}
        {showAddLessonModal && previewTeacher && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-indigo-200 rounded-3xl max-w-md w-full p-5 shadow-2xl relative text-right">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-800 font-['Cairo'] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>إضافة حصة للأستاذ: {previewTeacher}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddLessonToTeacher} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اليوم:</label>
                    <select
                      value={addLessonDay}
                      onChange={(e) => setAddLessonDay(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      required
                    >
                      {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الحصة:</label>
                    <select
                      value={addLessonPeriod}
                      onChange={(e) => setAddLessonPeriod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                      required
                    >
                      {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'].map((p, idx) => (
                        <option key={p} value={p}>
                          الحصة {idx + 1} ({p})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الصف والفصل:</label>
                    <select
                      value={addLessonClass}
                      onChange={(e) => {
                        setAddLessonClass(e.target.value);
                        setAddLessonRoom(`قاعة ${e.target.value}`);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
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
                      value={addLessonSubject}
                      onChange={(e) => setAddLessonSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
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
                    value={addLessonRoom}
                    onChange={(e) => setAddLessonRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    placeholder="مثال: قاعة 5/1"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xs"
                  >
                    إضافة الحصة للجدول
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLessonModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
