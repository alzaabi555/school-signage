import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Substitution } from '../../types';
import { getSubjectStyle } from './MainPeriodSection';
import { PrintableSubstitutionReport } from '../Admin/PrintableSubstitutionReport';
import { SubstitutionQrModal } from '../Modals/SubstitutionQrModal';
import { getArabicDayName } from '../../utils/timeUtils';
import { normalizePeriodId, normalizeDayName, normalizeClassName } from '../../utils/excelUtils';
import { formatAcknowledgmentTime } from '../../utils/qrUtils';
import {
  DisplayAudienceMode,
  buildFemaleTeachersCanonicalSet,
  isFemaleSubstitution,
  getStoredFemaleTeachers,
} from '../../utils/femaleTeachersUtils';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  Printer,
  CheckCircle2,
  QrCode,
  GraduationCap,
} from 'lucide-react';

interface SideSectionProps {
  substitutions: Substitution[];
  duties?: unknown[];
  daySubjectDuties?: unknown;
  currentDayName: string;
  activePeriodName?: string;
  effectiveTime?: Date;
  audienceMode?: DisplayAudienceMode;
  femaleTeachers?: string[];
}

export const SideSection: React.FC<SideSectionProps> = ({
  substitutions,
  currentDayName,
  activePeriodName,
  effectiveTime = new Date(),
  audienceMode = 'general',
  femaleTeachers: initialFemaleTeachers,
}) => {
  // اليوم الحالي المعروض مع تطبيع كامل لاسم اليوم
  const targetDay = normalizeDayName(currentDayName);

  const femaleTeachers = useMemo(() => {
    return initialFemaleTeachers && initialFemaleTeachers.length > 0
      ? initialFemaleTeachers
      : getStoredFemaleTeachers();
  }, [initialFemaleTeachers]);

  const femaleCanonicalSet = useMemo(() => {
    return buildFemaleTeachersCanonicalSet(femaleTeachers);
  }, [femaleTeachers]);

  // تحويل معرف/مسمى الحصة بدقة مع الاعتماد على normalizePeriodId الشاملة
  const getExactPeriodId = (value: unknown): string => normalizePeriodId(value);

  const substitutionTimestamp = (sub: Substitution): number => {
    const parsed = Date.parse(String(sub.updatedAt || sub.date || ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  // تصفية اليوم وتوحيد الحصة والفصل، ثم الاحتفاظ بأحدث سجل لكل موضع.
  const sortedSubstitutions = React.useMemo(() => {
    const latestBySlot = new Map<string, Substitution>();
    substitutions.forEach((sub) => {
      if (sub.status === 'ملغي') return;
      let matchesDay = false;
      const explicitDay = normalizeDayName(sub.day || '');
      if (explicitDay) matchesDay = explicitDay === targetDay;
      else if (sub.date) {
        const parsed = new Date(sub.date);
        matchesDay = !Number.isNaN(parsed.getTime()) && normalizeDayName(getArabicDayName(parsed)) === targetDay;
      }
      if (!matchesDay) return;

      // تصفية الاحتياط في وضع المديرة المساعدة
      if (audienceMode === 'assistant' && !isFemaleSubstitution(sub, femaleCanonicalSet)) {
        return;
      }

      const periodId = getExactPeriodId(sub.period);
      const gradeClass = normalizeClassName(sub.gradeClass);
      if (!periodId || !gradeClass) return;
      const key = `${targetDay}:::${periodId}:::${gradeClass}`;
      const current = latestBySlot.get(key);
      if (!current || substitutionTimestamp(sub) >= substitutionTimestamp(current)) latestBySlot.set(key, sub);
    });
    const activeNorm = activePeriodName ? getExactPeriodId(activePeriodName) : '';
    return Array.from(latestBySlot.values()).sort((a, b) => {
      const aNorm = getExactPeriodId(a.period);
      const bNorm = getExactPeriodId(b.period);
      if (activeNorm) {
        if (aNorm === activeNorm && bNorm !== activeNorm) return -1;
        if (aNorm !== activeNorm && bNorm === activeNorm) return 1;
      }
      return aNorm.localeCompare(bNorm, undefined, { numeric: true });
    });
  }, [substitutions, activePeriodName, targetDay, audienceMode, femaleCanonicalSet]);
  // تجميع حصص الاحتياط بحسب المواد الدراسية (عرض مواد بحيث تظهر مسمى المادة وداخلها حصص الاحتياط الخاصة بها)
  const subjectSubstitutionGroups = React.useMemo(() => {
    if (sortedSubstitutions.length === 0) return [];

    const map = new Map<string, Substitution[]>();
    sortedSubstitutions.forEach((sub) => {
      const subj = sub.subject?.trim() || 'أخرى';
      const list = map.get(subj) || [];
      list.push(sub);
      map.set(subj, list);
    });

    const activeNorm = activePeriodName ? getExactPeriodId(activePeriodName) : '';

    const groups = Array.from(map.entries()).map(([subj, items]) => {
      const sortedItems = [...items].sort((a, b) => {
        const aNorm = getExactPeriodId(a.period);
        const bNorm = getExactPeriodId(b.period);
        if (activeNorm) {
          const isA = aNorm === activeNorm;
          const isB = bNorm === activeNorm;
          if (isA && !isB) return -1;
          if (!isA && isB) return 1;
        }
        return aNorm.localeCompare(bNorm, undefined, { numeric: true });
      });

      const absentTeachers = Array.from(
        new Set(items.map((i) => i.absentTeacher?.trim()).filter(Boolean))
      );

      const hasActivePeriodLesson = items.some(
        (i) => activeNorm && getExactPeriodId(i.period) === activeNorm
      );

      return {
        subject: subj,
        absentTeachers,
        substitutions: sortedItems,
        hasActivePeriodLesson,
      };
    });

    // المادة التي بها حصة جارية الآن تصعد للأعلى تلقائياً على الشاشة الذكية
    return groups.sort((a, b) => {
      if (a.hasActivePeriodLesson && !b.hasActivePeriodLesson) return -1;
      if (!a.hasActivePeriodLesson && b.hasActivePeriodLesson) return 1;
      return b.substitutions.length - a.substitutions.length;
    });
  }, [sortedSubstitutions, activePeriodName]);

  // ملخص المعلمين الغائبين وتوزيع حصصهم بحسب المواد المختلفة
  const absentTeachersSummary = React.useMemo(() => {
    const map = new Map<string, { subject: string; count: number }>();
    sortedSubstitutions.forEach((s) => {
      const teacher = s.absentTeacher?.trim();
      if (!teacher) return;
      const current = map.get(teacher) || { subject: s.subject, count: 0 };
      current.count += 1;
      map.set(teacher, current);
    });
    return Array.from(map.entries()).map(([teacher, info]) => ({
      teacher,
      subject: info.subject,
      count: info.count,
    }));
  }, [sortedSubstitutions]);

  // حالة نافذة كشاف الاحتياط المطبوع للمدير
  const [showPrintReport, setShowPrintReport] = useState<boolean>(false);
  const [printReportMode, setPrintReportMode] = useState<'full' | 'assistant'>('full');
  const [selectedQrSub, setSelectedQrSub] = useState<Substitution | null>(null);

  // مرجع الحاوية للتمرير السلس الذاتي على الشاشات الكبيرة غير القابلة للمس
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (subjectSubstitutionGroups.length === 0) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        if (el.scrollHeight > el.clientHeight) {
          const maxScroll = el.scrollHeight - el.clientHeight;
          if (el.scrollTop + 60 >= maxScroll) {
            el.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            el.scrollBy({ top: 140, behavior: 'smooth' });
          }
        }
      }
    }, 9000); // تدوير وتمرير تلقائي كل 9 ثوانٍ
    return () => clearInterval(interval);
  }, [subjectSubstitutionGroups.length]);

  return (
    <aside className="w-full h-full flex flex-col overflow-hidden">
      {/* قسم بطاقات الاحتياط اليومي مصنفة بالمواد - يستغل كامل المساحة الرأسية بنسبة 100% بعد حذف قسم المناوبة */}
      <div className="h-full flex-1 flex flex-col bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs overflow-hidden">
        {/* ترويسة بطاقات الاحتياط */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-black text-slate-900 font-['Cairo']">
                  {audienceMode === 'assistant' ? 'احتياط المعلمات' : 'الاحتياط اليومي'}
                </h3>
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  audienceMode === 'assistant'
                    ? 'bg-violet-100 text-violet-800 border border-violet-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {audienceMode === 'assistant' ? (
                    <>
                      <GraduationCap className="w-2.5 h-2.5 text-violet-600" />
                      <span>خاص بالمعلمات 👩‍🏫</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-2.5 h-2.5 text-amber-600 animate-pulse" />
                      <span>تحديث ذاتي</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {audienceMode === 'assistant'
                  ? 'كشاف متابعة المعلمات المعتمدات للمديرة المساعدة'
                  : 'عرض مواد الحصص وتكليفاتها تلقائياً'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* أزرار الطباعة بتصميم عمودي (الأيقونة فوق النص) لمنع التمدد الأفقي نحو اليسار */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => { setPrintReportMode('full'); setShowPrintReport(true); }}
                className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition shadow-2xs active:scale-95 cursor-pointer text-center"
                title="طباعة كشاف الاحتياط الكامل لمدير المدرسة"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-600 mb-0.5" />
                <span className="text-[9px] font-bold leading-tight whitespace-nowrap">كشاف المدير</span>
              </button>
              <button
                type="button"
                onClick={() => { setPrintReportMode('assistant'); setShowPrintReport(true); }}
                className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition shadow-2xs active:scale-95 cursor-pointer text-center"
                title="طباعة نسخة المديرة المساعدة للمعلمات"
              >
                <Printer className="w-3.5 h-3.5 text-violet-600 mb-0.5" />
                <span className="text-[9px] font-bold leading-tight whitespace-nowrap">نسخة المساعدة</span>
              </button>
            </div>

            {/* شارة عدد الحصص */}
            <div className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-mono text-center flex flex-col items-center justify-center shrink-0">
              <span className="text-xs font-black leading-none">{sortedSubstitutions.length}</span>
              <span className="text-[8px] text-slate-500 font-sans mt-0.5 leading-none">حصص</span>
            </div>
          </div>
        </div>

        {/* شريط ملخص المعلمين الغائبين عند وجود أكثر من معلم لمواد مختلفة */}
        {absentTeachersSummary.length > 1 && (
          <div className="mb-2 pb-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] font-bold text-slate-500 shrink-0">الغائبون:</span>
            {absentTeachersSummary.map((item) => (
              <div
                key={item.teacher}
                className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-[10px]"
              >
                <span className="font-bold text-rose-900">{item.teacher}</span>
                <span className="text-[9px] text-rose-600 font-medium">({item.subject})</span>
                <span className="px-1 py-0.2 bg-white text-rose-700 font-mono font-bold rounded-sm border border-rose-200 text-[9px]">
                  {item.count}ح
                </span>
              </div>
            ))}
          </div>
        )}

        {/* قائمة بطاقات الاحتياط معروضة بالمواد مع التمرير السلس والتدوير التلقائي للشاشات الكبيرة */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin"
        >
          {subjectSubstitutionGroups.length === 0 ? (
            <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {audienceMode === 'assistant'
                  ? 'لا يوجد احتياط مسجل للمعلمات اليوم'
                  : 'لا يوجد احتياط مسجل لليوم'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {audienceMode === 'assistant'
                  ? 'جميع معلمات المدرسة حاضرات بحمد الله'
                  : 'جميع معلمي الفصول الـ 32 حاضرون بحمد الله'}
              </p>
            </div>
          ) : (
            subjectSubstitutionGroups.map((group) => {
              const style = getSubjectStyle(group.subject);
              return (
                <div
                  key={group.subject}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                    group.hasActivePeriodLesson
                      ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300 shadow-sm'
                      : 'border-slate-200/90 bg-white'
                  }`}
                >
                  {/* 1. رأس المادة الدراسية (مسمى المادة + المعلم الغائب + عدد الحصص) */}
                  <div
                    className={`p-2 px-3 flex items-center justify-between border-b ${
                      group.hasActivePeriodLesson
                        ? 'bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 border-amber-300 text-amber-950'
                        : 'bg-slate-50/90 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          group.hasActivePeriodLesson ? 'bg-amber-500 animate-ping' : 'bg-indigo-600'
                        }`}
                      />
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${style.badge}`}>
                          مادة: {group.subject}
                        </span>
                        {group.absentTeachers.length > 0 && (
                          <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-rose-200 shadow-2xs">
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                            <span>الغائب: {group.absentTeachers.join('، ')}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {group.hasActivePeriodLesson && (
                        <span className="text-[9px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                          حصة جارية
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-slate-800 border border-slate-200 font-mono shadow-2xs">
                        {group.substitutions.length} حصص
                      </span>
                    </div>
                  </div>

                  {/* 2. حصص الاحتياط الخاصة بهذه المادة (داخل قسم المادة) */}
                  <div className="p-2 space-y-2 bg-slate-50/40">
                    {group.substitutions.map((sub) => {
                      const activePeriodId = activePeriodName ? getExactPeriodId(activePeriodName) : '';
                      const isCurrentPeriod = Boolean(
                        activePeriodId && getExactPeriodId(sub.period) === activePeriodId
                      );

                      return (
                        <div
                          key={sub.id}
                          className={`p-2.5 rounded-xl border transition-all duration-300 ${
                            isCurrentPeriod
                              ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-300 shadow-sm scale-[1.01]'
                              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          {/* الحصة والصف وشارة الحصة الحالية */}
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${
                                  isCurrentPeriod
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}
                              >
                                {sub.period}
                              </span>
                              <span className="text-xs font-black text-slate-900 font-mono whitespace-nowrap shrink-0">
                                فصل {sub.gradeClass}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {isCurrentPeriod && (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1 animate-pulse">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                  الحصة الجارية الآن
                                </span>
                              )}
                              {sub.status === 'تم الحضور' || sub.acknowledgedAt ? (
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white border border-emerald-400 flex items-center gap-1 shadow-xs">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-200" />
                                  <span>
                                    تم الاستلام {sub.acknowledgedAt ? formatAcknowledgmentTime(sub.acknowledgedAt) : '✅'}
                                  </span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedQrSub(sub);
                                  }}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 shadow-2xs transition active:scale-95 cursor-pointer ring-1 ring-amber-300"
                                  title="امسح الرمز أو انقر لتأكيد الاستلام"
                                >
                                  <QrCode className="w-2.5 h-2.5 text-amber-100" />
                                  <span>مسح الباركود 📷</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* المعلم الغائب والمعلم البديل المكلف */}
                          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/70 rounded-lg p-2 border border-slate-200/80">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] text-rose-600 flex items-center gap-1 font-bold">
                                <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                                الغائب:
                              </span>
                              <span className="text-slate-600 line-through font-medium truncate mt-0.5 text-[11px]">
                                {sub.absentTeacher}
                              </span>
                            </div>

                            <div className="flex flex-col border-r border-slate-200 pr-1.5 min-w-0">
                              <span className="text-[9px] text-emerald-700 flex items-center gap-1 font-bold">
                                <UserCheck className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                                البديل المكلف:
                              </span>
                              <span className="text-emerald-700 font-black truncate mt-0.5 text-[11px]">
                                {sub.substituteTeacher}
                              </span>
                            </div>
                          </div>

                          {/* الملاحظات */}
                          {sub.notes && (
                            <div className="mt-1 text-[10px] text-slate-500 truncate" title={sub.notes}>
                              <span className="font-bold text-slate-600">ملاحظة: </span>
                              <span>{sub.notes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* نافذة تقرير كشاف الاحتياط لمدير المدرسة الجاهز للطباعة A4 */}
      {showPrintReport && (
        <PrintableSubstitutionReport
          isOpen={showPrintReport}
          onClose={() => setShowPrintReport(false)}
          substitutions={substitutions}
          selectedDay={targetDay}
          reportMode={printReportMode}
          femaleTeachers={femaleTeachers}
        />
      )}

      {/* نافذة باركود QR لتأكيد استلام المعلم للتكليف */}
      {selectedQrSub && (
        <SubstitutionQrModal
          substitution={selectedQrSub}
          isOpen={Boolean(selectedQrSub)}
          onClose={() => setSelectedQrSub(null)}
        />
      )}
    </aside>
  );
};
