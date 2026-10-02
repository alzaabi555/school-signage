import React, { useState, useMemo, useEffect } from 'react';
import { DutyItem, ClassScheduleItem } from '../../types';
import { INITIAL_TEACHERS, INITIAL_DAY_SUBJECT_DUTIES } from '../../data/initialData';
import {
  ShieldCheck,
  RefreshCw,
  MapPin,
  Clock,
  UserCheck,
  Plus,
  Edit3,
  CheckCircle,
  X,
  Trash2,
  Settings,
  Edit2,
  Users,
  BookOpen,
  Calendar,
  Award,
  Check,
  HelpCircle,
} from 'lucide-react';

interface DutyScheduleTabProps {
  duties: DutyItem[];
  timetable?: ClassScheduleItem[];
  daySubjectDuties?: Record<string, { subject: string; departmentLead: string; notes?: string }>;
  onUpdateDaySubjectDuty?: (day: string, subject: string, departmentLead: string, notes?: string) => Promise<void>;
  onUpdateDuty: (duty: DutyItem) => Promise<void>;
  onAddDuty: (duty: Omit<DutyItem, 'id'>) => Promise<void>;
  onDeleteDuty?: (id: string) => Promise<void>;
  onClearAllDuties?: () => Promise<void>;
  isSubmitting: boolean;
}

const STORAGE_DUTY_LOCATIONS = 'school_signage_duty_locations';

const DEFAULT_DUTY_LOCATIONS = [
  'البوابة الرئيسية ومواقف الحافلات',
  'الساحة الداخلية والمصلى المدرسي',
  'المقصف المدرسي والصالة الرياضية',
  'ممرات الدور الأرضي',
  'ممرات الدور الأول',
  'ممرات الدور الثاني',
  'البوابة الفرعية ومواقف المعلمين',
  'الفناء الخارجي والملاعب',
];

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

export const DutyScheduleTab: React.FC<DutyScheduleTabProps> = ({
  duties,
  timetable = [],
  daySubjectDuties = INITIAL_DAY_SUBJECT_DUTIES,
  onUpdateDaySubjectDuty,
  onUpdateDuty,
  onAddDuty,
  onDeleteDuty,
  onClearAllDuties,
  isSubmitting,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('الأحد');

  // استخراج المادة المناوبة والمعلم الأول لليوم المختار
  const currentDayInfo = (daySubjectDuties && daySubjectDuties[selectedDay]) || INITIAL_DAY_SUBJECT_DUTIES[selectedDay] || {
    subject: 'المناوبة العامة',
    departmentLead: 'مشرف المنظومة',
    notes: '',
  };

  // 1. استخراج أسماء المعلمين تلقائياً من جدول الحصص المرفوع من ملف الإكسل
  const extractedTeachers = useMemo(() => {
    const set = new Set<string>();
    timetable.forEach((item) => {
      if (item.teacher && item.teacher.trim() && !item.teacher.includes('معلم شاغر')) {
        set.add(item.teacher.trim());
      }
    });
    const list = Array.from(set).sort((a, b) => a.localeCompare(b, 'ar'));
    return list.length > 0 ? list : INITIAL_TEACHERS;
  }, [timetable]);

  // 2. إدارة وتعديل مواقع المناوبة المعتمدة (تخزين محلي + قابلة للإضافة والتعديل والحذف)
  const [dutyLocations, setDutyLocations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DUTY_LOCATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_DUTY_LOCATIONS;
  });

  const saveLocations = (newList: string[]) => {
    setDutyLocations(newList);
    localStorage.setItem(STORAGE_DUTY_LOCATIONS, JSON.stringify(newList));
  };

  // نوافذ إدارة وتعديل توزيع المواد على الأيام
  const [showEditDaySubjectModal, setShowEditDaySubjectModal] = useState<boolean>(false);
  const [showWeekDistributionModal, setShowWeekDistributionModal] = useState<boolean>(false);
  const [editSubjectInput, setEditSubjectInput] = useState<string>('');
  const [editLeadInput, setEditLeadInput] = useState<string>('');
  const [editNotesInput, setEditNotesInput] = useState<string>('');

  // فتح نافذة تعديل مادة اليوم
  const handleOpenEditDaySubject = () => {
    setEditSubjectInput(currentDayInfo.subject);
    setEditLeadInput(currentDayInfo.departmentLead || '');
    setEditNotesInput(currentDayInfo.notes || '');
    setShowEditDaySubjectModal(true);
  };

  const handleSaveDaySubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubjectInput.trim()) {
      alert('يرجى كتابة اسم المادة أو القسم المناوب');
      return;
    }
    if (onUpdateDaySubjectDuty) {
      await onUpdateDaySubjectDuty(
        selectedDay,
        editSubjectInput.trim(),
        editLeadInput.trim(),
        editNotesInput.trim()
      );
    }
    setShowEditDaySubjectModal(false);
  };

  // حالة نافذة إدارة مواقع المناوبة الداخلية
  const [showLocationManager, setShowLocationManager] = useState<boolean>(false);
  const [newLocationInput, setNewLocationInput] = useState<string>('');
  const [editingLocation, setEditingLocation] = useState<{ oldName: string; newName: string } | null>(null);

  // تبديل المناوبة
  const [swapModalDuty, setSwapModalDuty] = useState<DutyItem | null>(null);
  const [newLeadTeacher, setNewLeadTeacher] = useState<string>('');
  const [swapReason, setSwapReason] = useState<string>('');

  // إضافة موقع مناوبة جديد
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<string>(dutyLocations[0] || '');
  const [newDay, setNewDay] = useState<string>('الأحد');
  const [newLead, setNewLead] = useState<string>('');
  const [newAssistants, setNewAssistants] = useState<string>('');
  const [newTimeSlot, setNewTimeSlot] = useState<string>('طابور الصباح والفسحة والانصراف');
  const [newDutyNotes, setNewDutyNotes] = useState<string>('');

  // تعديل بطاقة مناوبة
  const [editingDutyItem, setEditingDutyItem] = useState<DutyItem | null>(null);

  const filteredDuties = duties.filter((d) => d.day === selectedDay);

  const handleOpenSwap = (duty: DutyItem) => {
    setSwapModalDuty(duty);
    setNewLeadTeacher('');
    setSwapReason('');
  };

  const handleConfirmSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapModalDuty || !newLeadTeacher.trim()) return;

    const updated: DutyItem = {
      ...swapModalDuty,
      leadTeacher: newLeadTeacher.trim(),
      notes: swapReason.trim()
        ? `بديل عن (${swapModalDuty.leadTeacher}): ${swapReason.trim()}`
        : `بديل عن (${swapModalDuty.leadTeacher})`,
    };

    await onUpdateDuty(updated);
    setSwapModalDuty(null);
  };

  const handleAddNewDuty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim() || !newLead.trim()) {
      alert('يرجى تحديد موقع المناوبة واسم المشرف المكلف');
      return;
    }

    await onAddDuty({
      day: newDay,
      location: newLocation.trim(),
      leadTeacher: newLead.trim(),
      assistants: newAssistants.trim(),
      timeSlot: newTimeSlot.trim(),
      notes: newDutyNotes.trim(),
      subject: currentDayInfo.subject,
    });

    setShowAddModal(false);
    setNewLead('');
    setNewAssistants('');
    setNewDutyNotes('');
  };

  const handleSaveEditDuty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDutyItem || !editingDutyItem.location.trim() || !editingDutyItem.leadTeacher.trim()) return;
    await onUpdateDuty(editingDutyItem);
    setEditingDutyItem(null);
  };

  // إدارة المواقع
  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLocationInput.trim();
    if (!trimmed) return;
    if (!dutyLocations.includes(trimmed)) {
      const updated = [...dutyLocations, trimmed];
      saveLocations(updated);
      setNewLocation(trimmed);
    }
    setNewLocationInput('');
  };

  const handleSaveEditLocation = () => {
    if (!editingLocation || !editingLocation.newName.trim()) return;
    const updated = dutyLocations.map((loc) =>
      loc === editingLocation.oldName ? editingLocation.newName.trim() : loc
    );
    saveLocations(updated);
    if (newLocation === editingLocation.oldName) {
      setNewLocation(editingLocation.newName.trim());
    }
    setEditingLocation(null);
  };

  const handleDeleteLocation = (locToDelete: string) => {
    const updated = dutyLocations.filter((l) => l !== locToDelete);
    saveLocations(updated);
    if (newLocation === locToDelete) {
      setNewLocation(updated[0] || '');
    }
  };

  return (
    <div className="space-y-6">
      {/* داتاليست لاقتراحات أسماء المعلمين المستخرجة من جدول الإكسل */}
      <datalist id="duty-teachers-extracted-list">
        {extractedTeachers.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      {/* داتاليست لمواقع المناوبة المعتمدة في المدرسة */}
      <datalist id="duty-locations-list">
        {dutyLocations.map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>

      {/* 1. الترويسة الرئيسية واختيار أيام الأسبوع */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-['Cairo']">
                  جدول المناوبة المدرسية وتوزيع المواد
                </h2>
                <span className="text-[10px] bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 rounded-full font-bold">
                  توزيع المواد على الأيام
                </span>
              </div>
              <p className="text-xs text-slate-500">
                المناوبة موزعة حسب المواد على أيام الأسبوع مع استمرار التوزيع الداخلي لأقسام المدرسة ومواقعها
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWeekDistributionModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              <span>جدول توزيع المواد للأسبوع</span>
            </button>

            <button
              onClick={() => setShowLocationManager(!showLocationManager)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-600" />
              <span>مواقع المدرسة الداخلية ({dutyLocations.length})</span>
            </button>

            <button
              onClick={() => {
                setNewDay(selectedDay);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إسناد موقع لمناوب</span>
            </button>

            {duties.length > 0 && onClearAllDuties && (
              <button
                type="button"
                onClick={() => {
                  onClearAllDuties();
                }}
                className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition"
                title="مسح كافة سجلات المناوبة"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            )}
          </div>
        </div>

        {/* أزرار اختيار يوم الأسبوع مع إبراز المادة المناوبة لكل يوم */}
        <div className="flex overflow-x-auto gap-2.5 pb-2 scrollbar-none">
          {DAYS.map((day) => {
            const countForDay = duties.filter((d) => d.day === day).length;
            const isSelected = selectedDay === day;
            const dayDuty = (daySubjectDuties && daySubjectDuties[day]) || INITIAL_DAY_SUBJECT_DUTIES[day];

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition border flex flex-col items-start gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-3">
                  <span className="font-bold text-xs">يوم {day}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isSelected ? 'bg-cyan-700 text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {countForDay} مواقع
                  </span>
                </div>
                <span
                  className={`text-[11px] truncate max-w-[130px] font-medium ${
                    isSelected ? 'text-cyan-50 font-bold' : 'text-slate-500'
                  }`}
                >
                  {dayDuty?.subject || 'المناوبة العامة'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. بطاقة المادة والقسم المناوب لهذا اليوم والمعلم الأول المسؤول */}
        <div className="bg-gradient-to-r from-cyan-50 via-white to-blue-50/40 border border-cyan-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100/80 border border-cyan-300 flex items-center justify-center text-cyan-700 shrink-0 shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">المادة والقسم المناوب ليوم {selectedDay}:</span>
                <h3 className="text-base font-black text-slate-900 font-['Cairo']">
                  {currentDayInfo.subject}
                </h3>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 px-2 py-0.5 rounded-full font-bold">
                  مادة اليوم
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-slate-500">المعلم الأول / رئيس القسم:</span>
                  <span className="font-bold text-cyan-800">
                    {currentDayInfo.departmentLead || 'مشرف المنظومة'}
                  </span>
                </span>
                {currentDayInfo.notes && (
                  <span className="text-slate-600 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {currentDayInfo.notes}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenEditDaySubject}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>تعديل مادة ومشرف يوم {selectedDay}</span>
            </button>
          </div>
        </div>
      </div>

      {/* لوحة إدارة وتعديل مواقع المناوبة الداخلية للمدرسة */}
      {showLocationManager && (
        <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">إدارة وتعديل مواقع وأقسام المدرسة المعتمدة</h3>
            </div>
            <button
              onClick={() => setShowLocationManager(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* نموذج إضافة موقع جديد */}
          <form onSubmit={handleAddLocation} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newLocationInput}
              onChange={(e) => setNewLocationInput(e.target.value)}
              placeholder="اكتب اسم موقع المناوبة الجديد (مثال: فناء المرحلة المتوسطة، ممر المعامل، بوابة رقم 2...)"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة موقع</span>
            </button>
          </form>

          {/* قائمة المواقع القابلة للتعديل والحذف */}
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
            {dutyLocations.map((loc) => (
              <div
                key={loc}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
              >
                {editingLocation?.oldName === loc ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editingLocation.newName}
                      onChange={(e) =>
                        setEditingLocation({ ...editingLocation, newName: e.target.value })
                      }
                      className="bg-white border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-slate-800"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEditLocation}
                      className="text-emerald-700 hover:text-emerald-800 font-bold px-1"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingLocation(null)}
                      className="text-slate-400 hover:text-slate-700 px-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => setEditingLocation({ oldName: loc, newName: loc })}
                      className="text-slate-400 hover:text-cyan-600 p-0.5"
                      title="تعديل اسم الموقع"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(loc)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                      title="حذف الموقع"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. التوزيع الداخلي لأقسام المدرسة ليوم المناوبة المحدد */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>التوزيع الداخلي لأقسام ومواقع المدرسة ليوم {selectedDay}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono font-bold">
                {filteredDuties.length} مواقع
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              المواقع المدرسية المسندة لمعلمي قسم ({currentDayInfo.subject}) تحت إشراف المعلم الأول ({currentDayInfo.departmentLead || 'مشرف المنظومة'})
            </p>
          </div>
        </div>

        {/* شبكة بطاقات مواقع المناوبة لليوم المختار */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDuties.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
              <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-800 font-bold text-sm">
                لا توجد مواقع مسندة حتى الآن ليوم {selectedDay} ({currentDayInfo.subject})
              </p>
              <p className="text-slate-500 text-xs mt-1">
                اضغط على زر "إسناد موقع لمناوب" لتكليف معلمي القسم على مواقع وأقسام المدرسة
              </p>
            </div>
          ) : (
            filteredDuties.map((duty) => (
              <div
                key={duty.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-cyan-400 transition shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* رأس البطاقة: الموقع وزر التبديل والتعديل والحذف */}
                  <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                      <h3 className="font-bold text-sm text-slate-900 font-['Cairo'] line-clamp-1">
                        {duty.location}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenSwap(duty)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-lg text-[11px] font-bold transition"
                        title="تبديل المشرف اليوم"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>تبديل</span>
                      </button>

                      <button
                        onClick={() => setEditingDutyItem(duty)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                        title="تعديل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {onDeleteDuty && (
                        <button
                          onClick={() => {
                            onDeleteDuty(duty.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="حذف هذا الموقع"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* المشرف الرئيسي */}
                  <div className="mb-2 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block mb-0.5">
                      المعلم المكلف ({currentDayInfo.subject}):
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-black text-cyan-800">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>{duty.leadTeacher}</span>
                    </div>
                  </div>

                  {/* المعلمون المساعدون */}
                  {duty.assistants && (
                    <div className="mb-2 text-xs">
                      <span className="text-[10px] text-slate-500 block mb-0.5">المساعدون:</span>
                      <p className="text-slate-700 text-xs font-medium">{duty.assistants}</p>
                    </div>
                  )}

                  {/* الفترة الزمنية */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{duty.timeSlot}</span>
                  </div>
                </div>

                {/* ملاحظات التبديل إن وجدت */}
                {duty.notes && (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-amber-700 font-medium">
                    {duty.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. نافذة تعديل مادة ومشرف اليوم المحدد */}
      {showEditDaySubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  تعديل مادة ومشرف يوم {selectedDay}
                </h3>
              </div>
              <button
                onClick={() => setShowEditDaySubjectModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDaySubject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المادة / القسم المكلف بالمناوبة لهذا اليوم:
                </label>
                <input
                  type="text"
                  value={editSubjectInput}
                  onChange={(e) => setEditSubjectInput(e.target.value)}
                  placeholder="مثال: قسم الرياضيات، العلوم، اللغة الإنجليزية..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المعلم الأول / رئيس القسم المسؤول:
                </label>
                <input
                  type="text"
                  list="duty-teachers-extracted-list"
                  value={editLeadInput}
                  onChange={(e) => setEditLeadInput(e.target.value)}
                  placeholder="اكتب اسم المعلم الأول أو اختره..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ملاحظات أو توجيهات المناوبة لهذا اليوم:
                </label>
                <input
                  type="text"
                  value={editNotesInput}
                  onChange={(e) => setEditNotesInput(e.target.value)}
                  placeholder="مثال: الإشراف على الفسحتين ومتابعة صلاة الظهر..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditDaySubjectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ المادة والمشرف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. نافذة جدول توزيع المواد على كامل أيام الأسبوع */}
      {showWeekDistributionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    جدول توزيع المواد المناوبة على أيام الأسبوع
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    تحديد القسم المكلف والمعلم الأول لكل يوم من الأحد إلى الخميس
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWeekDistributionModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {DAYS.map((day) => {
                const dayDuty = (daySubjectDuties && daySubjectDuties[day]) || INITIAL_DAY_SUBJECT_DUTIES[day];
                return (
                  <div
                    key={day}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-sm bg-white px-3 py-1.5 rounded-xl border border-slate-200 min-w-[70px] text-center shadow-xs">
                        {day}
                      </span>
                      <div>
                        <span className="text-slate-500 text-[10px] block">المادة / القسم المكلف:</span>
                        <span className="font-black text-cyan-800 text-sm">{dayDuty?.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-slate-500 text-[10px] block">المعلم الأول:</span>
                        <span className="font-bold text-slate-700 text-xs">
                          {dayDuty?.departmentLead || 'مشرف المنظومة'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedDay(day);
                          setShowWeekDistributionModal(false);
                          setEditSubjectInput(dayDuty?.subject || '');
                          setEditLeadInput(dayDuty?.departmentLead || '');
                          setEditNotesInput(dayDuty?.notes || '');
                          setShowEditDaySubjectModal(true);
                        }}
                        className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>تعديل</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowWeekDistributionModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. نافذة إضافة موقع مناوبة جديد */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  إسناد موقع مناوبة — {currentDayInfo.subject}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewDuty} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اليوم والمادة المكلفة:</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-cyan-500"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d} — {daySubjectDuties[d]?.subject || INITIAL_DAY_SUBJECT_DUTIES[d]?.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  موقع المناوبة داخل المدرسة (اكتب يدوياً أو اختر من القائمة):
                </label>
                <input
                  type="text"
                  list="duty-locations-list"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="مثال: البوابة الرئيسية، الساحة الداخلية..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المعلم المكلف (اكتب يدوياً أو اختر من معلمي الإكسل):
                </label>
                <input
                  type="text"
                  list="duty-teachers-extracted-list"
                  value={newLead}
                  onChange={(e) => setNewLead(e.target.value)}
                  placeholder="اكتب اسم المعلم المكلف بالموقع..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المساعدون (اختياري):
                </label>
                <input
                  type="text"
                  value={newAssistants}
                  onChange={(e) => setNewAssistants(e.target.value)}
                  placeholder="مثال: أ. صالح العمري، أ. ماجد الحربي"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">فترة المناوبة:</label>
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات أو مهام الموقع:</label>
                <input
                  type="text"
                  value={newDutyNotes}
                  onChange={(e) => setNewDutyNotes(e.target.value)}
                  placeholder="مثال: التواجد عند البوابة من 6:45 صباحاً"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ ونشر المناوبة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. نافذة تبديل المناوب السريع */}
      {swapModalDuty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-900 text-base">تبديل المشرف على الموقع</h3>
              </div>
              <button
                onClick={() => setSwapModalDuty(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSwap} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">الموقع:</span>
                <span className="font-bold text-slate-900 text-sm block mb-2">{swapModalDuty.location}</span>
                <span className="text-slate-500 block mb-0.5">المشرف الأصلي:</span>
                <span className="text-rose-600 font-bold text-sm">{swapModalDuty.leadTeacher}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المعلم البديل (اكتب يدوياً أو اختر من القائمة):
                </label>
                <input
                  type="text"
                  list="duty-teachers-extracted-list"
                  value={newLeadTeacher}
                  onChange={(e) => setNewLeadTeacher(e.target.value)}
                  placeholder="اكتب اسم المعلم البديل..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب أو توضيح التبديل:</label>
                <input
                  type="text"
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  placeholder="مثال: غياب بعذر، إشراف على رحلة مدرسية..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSwapModalDuty(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'جارٍ التحديث...' : 'تأكيد التبديل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. نافذة تعديل بيانات بطاقة المناوبة */}
      {editingDutyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-right">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">تعديل بيانات موقع المناوبة</h3>
              </div>
              <button
                onClick={() => setEditingDutyItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDuty} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اليوم:</label>
                <select
                  value={editingDutyItem.day}
                  onChange={(e) => setEditingDutyItem({ ...editingDutyItem, day: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">موقع المناوبة:</label>
                <input
                  type="text"
                  list="duty-locations-list"
                  value={editingDutyItem.location}
                  onChange={(e) => setEditingDutyItem({ ...editingDutyItem, location: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المعلم المكلف:</label>
                <input
                  type="text"
                  list="duty-teachers-extracted-list"
                  value={editingDutyItem.leadTeacher}
                  onChange={(e) =>
                    setEditingDutyItem({ ...editingDutyItem, leadTeacher: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المساعدون:</label>
                <input
                  type="text"
                  value={editingDutyItem.assistants || ''}
                  onChange={(e) =>
                    setEditingDutyItem({ ...editingDutyItem, assistants: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الفترة الزمنية:</label>
                <input
                  type="text"
                  value={editingDutyItem.timeSlot}
                  onChange={(e) =>
                    setEditingDutyItem({ ...editingDutyItem, timeSlot: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات:</label>
                <input
                  type="text"
                  value={editingDutyItem.notes || ''}
                  onChange={(e) =>
                    setEditingDutyItem({ ...editingDutyItem, notes: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDutyItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
