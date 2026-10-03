import React, { useState, useMemo, useEffect } from 'react';
import { Substitution } from '../../types';
import { SCHOOL_WEEK_DAYS, normalizePeriodId } from '../../utils/excelUtils';
import { generateQrDataUrl, getAssignmentAcknowledgmentUrl, formatAcknowledgmentTime } from '../../utils/qrUtils';
import { downloadOrShareFile, isNativeAndroidApp } from '../../utils/fileExportUtils';
import {
  Printer,
  X,
  Calendar,
  FileText,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  QrCode,
  Users,
  Share2,
  Download,
  Copy,
  Check,
} from 'lucide-react';

interface PrintableSubstitutionReportProps {
  isOpen: boolean;
  onClose: () => void;
  substitutions: Substitution[];
  selectedDay?: string;
  reportMode?: 'full' | 'assistant';
  femaleTeachers?: string[];
}

export const PrintableSubstitutionReport: React.FC<PrintableSubstitutionReportProps> = ({
  isOpen,
  onClose,
  substitutions,
  selectedDay = 'الأحد',
  reportMode = 'full',
  femaleTeachers = [],
}) => {
  const [reportDay, setReportDay] = useState<string>(selectedDay);
  const [activeMode, setActiveMode] = useState<'full' | 'assistant'>(reportMode);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showQrInPrint, setShowQrInPrint] = useState<boolean>(true);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState<boolean>(false);

  useEffect(() => {
    setActiveMode(reportMode);
  }, [reportMode]);

  const normalizeTeacherName = (value: unknown): string =>
    String(value || '')
      .trim()
      .replace(/^أ\.\s*/, '')
      .replace(/\s+/g, ' ');

  const femaleTeacherSet = useMemo(
    () => new Set(femaleTeachers.map(normalizeTeacherName).filter(Boolean)),
    [femaleTeachers]
  );

  // تصفية حصص الاحتياط بحسب اليوم والوضع المختار (طباعة المدير أو طباعة المساعدة)
  const daySubstitutions = useMemo(() => {
    return substitutions.filter((s) => {
      if (s.status === 'ملغي') return false;
      if (s.day && s.day !== reportDay) return false;
      if (activeMode === 'assistant') {
        return femaleTeacherSet.has(normalizeTeacherName(s.absentTeacher));
      }
      return true;
    });
  }, [substitutions, reportDay, activeMode, femaleTeacherSet]);

  // قائمة المواد المتوفرة في احتياط اليوم
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    daySubstitutions.forEach((s) => {
      if (s.subject) set.add(s.subject.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ar'));
  }, [daySubstitutions]);

  // التصفية النهائية بحسب المادة وترتيب الحصص تصاعدياً
  const filteredSubstitutions = useMemo(() => {
    let list = daySubstitutions;
    if (selectedSubjectFilter !== 'all') {
      list = list.filter((s) => s.subject === selectedSubjectFilter);
    }
    return [...list].sort((a, b) => {
      // ترتيب حسب المادة أولاً ثم رقم الحصة
      const subjCompare = (a.subject || '').localeCompare(b.subject || '', 'ar');
      if (subjCompare !== 0) return subjCompare;
      return normalizePeriodId(a.period).localeCompare(normalizePeriodId(b.period), undefined, { numeric: true });
    });
  }, [daySubstitutions, selectedSubjectFilter]);

  // قائمة المعلمين الغائبين وتفاصيل حصصهم
  const absentTeachersList = useMemo(() => {
    const map = new Map<string, { subject: string; count: number; periods: string[] }>();
    daySubstitutions.forEach((s) => {
      const t = s.absentTeacher?.trim();
      if (!t) return;
      const curr = map.get(t) || { subject: s.subject || '', count: 0, periods: [] };
      curr.count += 1;
      curr.periods.push(`${s.period} (${s.gradeClass})`);
      map.set(t, curr);
    });
    return Array.from(map.entries()).map(([teacher, data]) => ({
      teacher,
      subject: data.subject,
      count: data.count,
      periods: data.periods,
    }));
  }, [daySubstitutions]);

  // إحصائية المعلمين البدلاء ونصيب كل معلم من الاحتياط
  const substituteTeachersStats = useMemo(() => {
    const map = new Map<string, { count: number; assignments: string[] }>();
    daySubstitutions.forEach((s) => {
      const sub = s.substituteTeacher?.trim();
      if (!sub) return;
      const curr = map.get(sub) || { count: 0, assignments: [] };
      curr.count += 1;
      curr.assignments.push(`${s.period} [${s.gradeClass}]`);
      map.set(sub, curr);
    });
    return Array.from(map.entries())
      .map(([teacher, data]) => ({
        teacher,
        count: data.count,
        assignments: data.assignments,
      }))
      .sort((a, b) => b.count - a.count || a.teacher.localeCompare(b.teacher, 'ar'));
  }, [daySubstitutions]);

  // توليد رموز QR لكافة حصص الاحتياط لتضمينها في الطباعة بدقة عالية وحجم كبير يسهل مسحه فوراً
  useEffect(() => {
    if (!isOpen || !showQrInPrint || filteredSubstitutions.length === 0) return;
    let isSubscribed = true;

    const generateCodes = async () => {
      const map: Record<string, string> = {};
      for (const sub of filteredSubstitutions) {
        if (sub.status !== 'تم الحضور' && !sub.acknowledgedAt) {
          const url = getAssignmentAcknowledgmentUrl(sub.id);
          // توليد بدقة 480px وتباين أسود نقي على خلفية بيضاء لسرعة التقاط الكاميرا
          const dataUrl = await generateQrDataUrl(url, {
            width: 480,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
          });
          if (dataUrl) map[sub.id] = dataUrl;
        }
      }
      if (isSubscribed) {
        setQrMap(map);
      }
    };

    generateCodes();
    return () => {
      isSubscribed = false;
    };
  }, [filteredSubstitutions, isOpen, showQrInPrint]);

  // نسخ كشف الاحتياط كنص منسق لمجموعات الواتساب وتعاميم المدرسة
  const handleCopyWhatsApp = async () => {
    try {
      const title = activeMode === 'assistant'
        ? `📋 كشف احتياط المعلمات — ليوم ${reportDay}`
        : `📋 كشف الاحتياط المدرسي اليومي — ليوم ${reportDay}`;

      let text = `*${title}*\n`;
      text += `📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}\n`;
      text += `━━━━━━━━━━━━━━━━━━━━\n`;

      if (filteredSubstitutions.length === 0) {
        text += `لا يوجد حصص احتياط مسجلة لهذا اليوم.\n`;
      } else {
        filteredSubstitutions.forEach((sub, idx) => {
          text += `🔹 *${idx + 1}. فصل ${sub.gradeClass}* | الحصة: ${sub.period} (${sub.subject})\n`;
          text += `   • المعلم الغائب: ${sub.absentTeacher}\n`;
          text += `   • المعلم المكلف البديل: *${sub.substituteTeacher}*\n`;
          if (sub.notes) text += `   • ملاحظات: ${sub.notes}\n`;
          text += `\n`;
        });
      }

      text += `━━━━━━━━━━━━━━━━━━━━\n`;
      text += `يرجى من الزملاء المعلمين المكلفين المتابعة والاستلام. شاكرين تعاونكم.`;

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedWhatsApp(true);
        setToastMsg('تم نسخ كشف الاحتياط بنجاح! جاهز للصق في مجموعات الواتساب 📋');
        setTimeout(() => setCopiedWhatsApp(false), 3000);
        setTimeout(() => setToastMsg(null), 5000);
      }
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // مشاركة أو حفظ الكشف كملف مستقل يدعم أجهزة الأندرويد ومشاركة واتساب والمتصفحات
  const handleExportOrShare = async () => {
    try {
      const reportElement = document.getElementById('printable-report-content');
      if (!reportElement) return;

      const title = activeMode === 'assistant'
        ? `كشاف_الاحتياط_للمديرة_المساعدة_${reportDay}`
        : `كشاف_الاحتياط_لمدير_المدرسة_${reportDay}`;

      const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; margin: 15px; background: #fff; color: #000; direction: rtl; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1.5px solid #334155; padding: 6px 8px; text-align: center; font-size: 13px; }
    th { background: #f1f5f9; font-weight: 800; }
    .no-print { display: none; }
    @media print {
      body { margin: 0; }
      @page { size: A4 landscape; margin: 8mm; }
    }
  </style>
</head>
<body>
  ${reportElement.innerHTML}
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  </script>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const fileName = `${title}.html`;

      const result = await downloadOrShareFile({
        blob,
        fileName,
        title: title.replace(/_/g, ' '),
        text: `كشاف الاحتياط المدرسي ليوم ${reportDay}`,
        dialogTitle: 'طباعة كشف الاحتياط أو حفظه كـ PDF أو مشاركته',
      });

      setToastMsg(result.message);
      setTimeout(() => setToastMsg(null), 5000);
    } catch (e) {
      console.error('Error in handleExportOrShare:', e);
      try {
        window.print();
      } catch {}
    }
  };

  const handlePrint = async () => {
    // في بيئة الأندرويد، استدعاء المشاركة/الحفظ يتيح للمستخدم خيار "طباعة" و "حفظ كـ PDF" عبر النظام
    if (isNativeAndroidApp()) {
      await handleExportOrShare();
      return;
    }

    try {
      window.print();
    } catch {
      await handleExportOrShare();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      {/* شريط الإجراءات والتحكم (لا يظهر في الطباعة) */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="no-print p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 font-['Cairo']">
                {activeMode === 'assistant'
                  ? 'كشاف الاحتياط اليومي للمديرة المساعدة (نسخة جاهزة للطباعة A4)'
                  : 'كشاف الاحتياط اليومي لمدير المدرسة (نسخة جاهزة للطباعة A4)'}
              </h2>
              <p className="text-xs text-slate-500">
                {activeMode === 'assistant'
                  ? 'نسخة مخصصة لمتابعة غياب المعلمات وتكليفات الاحتياط الخاصة بهن'
                  : 'تقرير رسمي كشاف لغياب المعلمين واحتياطهم مصنفاً بالمواد مع خانة التوقيع والاعتماد'}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* التبديل بين وضع طباعة المدير وطباعة المساعدة */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-300 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveMode('full')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'full'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>طباعة المدير</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('assistant')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeMode === 'assistant'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>طباعة المساعدة</span>
              </button>
            </div>

            {/* اختيار اليوم */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold text-slate-600">اليوم:</span>
              <select
                value={reportDay}
                onChange={(e) => setReportDay(e.target.value)}
                className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                {SCHOOL_WEEK_DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* فلترة مادة معينة إن رغب */}
            {availableSubjects.length > 1 && (
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs">
                <span className="font-bold text-slate-600">المادة:</span>
                <select
                  value={selectedSubjectFilter}
                  onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                  className="font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">كافة المواد ({daySubstitutions.length} حصص)</option>
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* خيار إظهار باركود الـ QR للاستلام الذكي */}
            <label className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer select-none hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={showQrInPrint}
                onChange={(e) => setShowQrInPrint(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>باركود الاستلام الذكي (QR)</span>
            </label>

            {/* زر الطباعة المباشرة */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl text-xs md:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكشاف الآن</span>
            </button>

            {/* زر مشاركة أو حفظ الكشف (يدعم هواتف الأندرويد والواتساب وحفظ الملفات) */}
            <button
              type="button"
              onClick={handleExportOrShare}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs md:text-sm border border-indigo-200 transition active:scale-95 cursor-pointer shadow-2xs"
              title="مشاركة الكشف كملف مستقل أو إرساله للطباعة عبر الواتساب أو حفظه (أندرويد ومتصفح)"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>مشاركة وحفظ (أندرويد / PDF)</span>
            </button>

            {/* زر نسخ كشف الاحتياط للواتساب والتعاميم */}
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs md:text-sm border border-emerald-200 transition active:scale-95 cursor-pointer shadow-2xs"
              title="نسخ كشف الاحتياط كنص منسق ونشره في مجموعات الواتساب"
            >
              {copiedWhatsApp ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>نسخ للواتساب 📋</span>
                </>
              )}
            </button>

            {/* زر الإغلاق */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* إشعار التفاعل المباشر */}
        {toastMsg && (
          <div className="no-print bg-indigo-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-between animate-fade-in">
            <span>{toastMsg}</span>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-white/80 hover:text-white text-xs underline cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* حاوية ورقة الطباعة الرسمية A4 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-200/60 print:bg-white print:p-0">
          <div
            id="printable-report-content"
            className="max-w-[210mm] mx-auto bg-white p-8 md:p-10 shadow-lg print:shadow-none print:p-4 text-slate-900 font-['Cairo'] border border-slate-200 print:border-none rounded-2xl print:rounded-none"
          >
            {/* الترويسة الرسمية لسلطنة عمان والوزارة والمدرسة */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
              <div className="flex items-center justify-between text-xs md:text-sm text-slate-800 font-bold">
                <div className="text-right space-y-0.5">
                  <p>سلطنة عُمان</p>
                  <p>وزارة التعليم</p>
                  <p>المديرية العامة للتعليم بمحافظة شمال الباطنة</p>
                  <p className="font-black text-indigo-900">مدرسة الإبداع للبنين (5 - 8)</p>
                </div>

                <div className="text-center px-4">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs bg-slate-50 mb-1">
                    شعار الوزارة
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">العام الدراسي 2026 / 2027</span>
                </div>

                <div className="text-left space-y-0.5 font-mono text-[11px]">
                  <p>اليوم: <span className="font-bold">{reportDay}</span></p>
                  <p>التاريخ: <span className="font-bold">{new Date().toLocaleDateString('ar-OM', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                  <p>زمن الإصدار: <span className="font-bold">{new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' })}</span></p>
                </div>
              </div>

              {/* عنوان التقرير */}
              <div className="mt-4 text-center">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-wide underline underline-offset-8 decoration-slate-400">
                  {activeMode === 'assistant'
                    ? 'كشاف حصر غياب المعلمات وتوزيع حصص الاحتياط اليومي'
                    : 'كشاف حصر غياب المعلمين وتوزيع حصص الاحتياط اليومي'}
                </h1>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  {activeMode === 'assistant'
                    ? 'نسخة المديرة المساعدة للشؤون التعليمية لمتابعة حصص المعلمات وتوثيق استلام البديلات'
                    : 'تقرير رسمي معتمد لإدارة المدرسة لمتابعة غياب المعلمين وتوزيع الاحتياط وتوثيق الاستلام'}
                </p>
              </div>
            </div>

            {/* بطاقات الإحصائيات السريعة للمدير */}
            <div className="grid grid-cols-4 gap-3 mb-5 text-center text-xs">
              <div className="p-2.5 rounded-xl border border-slate-300 bg-slate-50">
                <span className="text-[10px] text-slate-500 block font-bold">
                  {activeMode === 'assistant' ? 'المعلمات الغائبات' : 'المعلمون الغائبون'}
                </span>
                <span className="text-base font-black text-rose-700 font-mono">{absentTeachersList.length}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-300 bg-slate-50">
                <span className="text-[10px] text-slate-500 block font-bold">إجمالي حصص الاحتياط</span>
                <span className="text-base font-black text-indigo-700 font-mono">{daySubstitutions.length}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-300 bg-slate-50">
                <span className="text-[10px] text-slate-500 block font-bold">المواد المتأثرة بالغياب</span>
                <span className="text-base font-black text-emerald-700 font-mono">{availableSubjects.length}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-300 bg-slate-50">
                <span className="text-[10px] text-slate-500 block font-bold">
                  {activeMode === 'assistant' ? 'المعلمات البديلات المكلفات' : 'المعلمون البدلاء المكلفون'}
                </span>
                <span className="text-base font-black text-amber-700 font-mono">{substituteTeachersStats.length}</span>
              </div>
            </div>

            {/* ملخص المعلمين الغائبين */}
            {absentTeachersList.length > 0 && (
              <div className="mb-4 p-3 rounded-xl border border-slate-300 bg-slate-50/70 text-xs">
                <h3 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{activeMode === 'assistant' ? 'بيان المعلمات الغائبات' : 'بيان المعلمين الغائبين'} ليوم ({reportDay}):</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {absentTeachersList.map((item, i) => (
                    <div
                      key={item.teacher}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg flex items-center gap-1.5 font-bold"
                    >
                      <span className="text-slate-400 font-mono">{i + 1}.</span>
                      <span className="text-rose-900">{item.teacher}</span>
                      <span className="text-slate-500 font-normal">({item.subject})</span>
                      <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                        {item.count} حصص
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الجدول الرئيسي للكشاف (كشاف الحصص بالتفصيل) */}
            <div className="mb-6">
              <h3 className="text-xs md:text-sm font-black text-slate-900 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-700" />
                  <span>جدول كشاف توزيع الاحتياط التفصيلي (مصنفاً بحسب المواد الدراسية):</span>
                </span>
                <span className="text-xs text-slate-500 font-normal font-mono">
                  {filteredSubstitutions.length} حصة مسجلة
                </span>
              </h3>

              {filteredSubstitutions.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 text-xs font-bold">
                  لا توجد حصص احتياط مسجلة في هذا اليوم ({reportDay}).
                </div>
              ) : (
                <table className="w-full border-collapse border border-slate-400 text-xs text-right">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-400">
                      <th className="p-2 border border-slate-300 text-center w-8">م</th>
                      <th className="p-2 border border-slate-300">المادة الدراسية</th>
                      <th className="p-2 border border-slate-300">{activeMode === 'assistant' ? 'المعلمة الغائبة' : 'المعلم الغائب'}</th>
                      <th className="p-2 border border-slate-300 text-center">الحصة</th>
                      <th className="p-2 border border-slate-300 text-center">الصف</th>
                      <th className="p-2 border border-slate-300">{activeMode === 'assistant' ? 'المعلمة البديلة المكلفة' : 'المعلم البديل المكلف'}</th>
                      <th className="p-2 border border-slate-300 text-center w-48 print:w-44">
                        {showQrInPrint
                          ? (activeMode === 'assistant' ? 'توقيع البديلة / باركود الاستلام (QR)' : 'توقيع البديل / باركود الاستلام (QR)')
                          : (activeMode === 'assistant' ? 'توقيع البديلة' : 'توقيع البديل')}
                      </th>
                      <th className="p-2 border border-slate-300">المهام والملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubstitutions.map((sub, index) => (
                      <tr
                        key={sub.id || index}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} page-break-inside-avoid`}
                      >
                        <td className="p-2 border border-slate-300 text-center font-mono font-bold">
                          {index + 1}
                        </td>
                        <td className="p-2 border border-slate-300 font-bold text-slate-800">
                          {sub.subject}
                        </td>
                        <td className="p-2 border border-slate-300 text-rose-800 font-bold">
                          {sub.absentTeacher}
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-bold text-indigo-900">
                          {sub.period}
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-mono font-black text-slate-900">
                          {sub.gradeClass}
                        </td>
                        <td className="p-2 border border-slate-300 font-black text-emerald-800">
                          {sub.substituteTeacher}
                        </td>
                        <td className="p-2 border border-slate-300 text-center align-middle">
                          {sub.status === 'تم الحضور' || sub.acknowledgedAt ? (
                            <div className="flex flex-col items-center justify-center p-2 bg-emerald-50 rounded-xl border border-emerald-400">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-black">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                مُعتمد إلكترونياً ✅
                              </span>
                              <span className="text-[9.5px] font-bold text-emerald-900 mt-1">
                                تم الاستلام والتأكيد
                              </span>
                              {sub.acknowledgedAt && (
                                <span className="text-[9px] font-mono text-slate-700 font-bold mt-0.5">
                                  الساعة: {formatAcknowledgmentTime(sub.acknowledgedAt)}
                                </span>
                              )}
                            </div>
                          ) : showQrInPrint && qrMap[sub.id] ? (
                            <div className="flex flex-col items-center justify-center py-2 px-1">
                              {/* باركود كبير وعالي التباين لسهولة وسرعة التقاط الكاميرا فوراً */}
                              <div className="bg-white p-1.5 rounded-xl border-2 border-slate-900 shadow-sm inline-block print:border-black">
                                <img
                                  src={qrMap[sub.id]}
                                  alt="QR Code"
                                  className="w-28 h-28 print:w-28 print:h-28 object-contain mx-auto block"
                                />
                              </div>
                              <span className="text-[9px] font-black text-slate-900 leading-tight mt-1 print:text-black">
                                امسح بالجوال للاستلام الذكي
                              </span>
                            </div>
                          ) : (
                            <div className="py-4 text-center">
                              <span className="text-slate-400 text-xs font-mono tracking-widest">
                                ........................
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-2 border border-slate-300 text-[11px] text-slate-600">
                          {sub.notes || 'احتياط تخصص'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* جدول نصاب المعلمين البدلاء (إحصائية الموازنة للمدير أو المساعدة) */}
            {substituteTeachersStats.length > 0 && (
              <div className="mb-6 page-break-inside-avoid">
                <h3 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {activeMode === 'assistant'
                      ? 'حصر نصاب المعلمات البديلات المكلفات اليوم (متابعة عدالة التوزيع):'
                      : 'حصر نصاب المعلمين البدلاء المكلفين اليوم (متابعة عدالة التوزيع):'}
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                  {substituteTeachersStats.map((st) => (
                    <div
                      key={st.teacher}
                      className="p-2 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{st.teacher}</span>
                        <span className="text-[10px] text-slate-500 font-mono truncate block">
                          {st.assignments.join('، ')}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-black text-xs shrink-0">
                        {st.count} ح
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* خانات الاعتماد والتوقيعات الرسمية في أسفل التقرير */}
            <div className="mt-8 pt-4 border-t-2 border-slate-400 page-break-inside-avoid">
              <div className="grid grid-cols-3 gap-6 text-center text-xs font-bold text-slate-800">
                <div className="space-y-6">
                  <p>{activeMode === 'assistant' ? 'مشرفة الاحتياط اليومي' : 'مشرف الاحتياط اليومي'}</p>
                  <p className="text-slate-400 text-[11px]">....................................</p>
                </div>
                <div className="space-y-6">
                  <p>{activeMode === 'assistant' ? 'المديرة المساعدة للشؤون التعليمية' : 'المساعد للشؤون المدرسية'}</p>
                  <p className="text-slate-400 text-[11px]">....................................</p>
                </div>
                <div className="space-y-6">
                  <p className="text-slate-900 font-black">
                    {activeMode === 'assistant' ? 'تعتمد / مديرة المدرسة' : 'يعتمد / مدير المدرسة'}
                  </p>
                  <p className="text-slate-400 text-[11px]">.................................... (الختم الرسمي)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* استايلات مخصصة للطباعة النظيفة على ورق A4 */}
      <style>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* إخفاء كل شيء في الصفحة ما عدا منطقة الكشاف */
          body * {
            visibility: hidden;
          }
          #printable-report-content,
          #printable-report-content * {
            visibility: visible;
          }
          #printable-report-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 8mm 10mm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
        }
      `}</style>
    </div>
  );
};
