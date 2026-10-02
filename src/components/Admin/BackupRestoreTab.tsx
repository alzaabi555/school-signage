import React, { useState, useRef } from 'react';
import { SchoolSettings, AppStateData } from '../../types';
import {
  FullSchoolBackup,
  generateFullBackupData,
  downloadBackupFile,
  validateBackupJson,
  applyRestoredBackup,
} from '../../utils/backupRestoreUtils';
import {
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
  Calendar,
  Users,
  ShieldCheck,
  Clock,
  Megaphone,
  FolderArchive,
  RefreshCw,
  Copy,
  Check,
  Info,
  Laptop,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface BackupRestoreTabProps {
  settings: SchoolSettings;
  stateData: AppStateData;
  femaleTeachers?: string[];
  onBackupRestored: (backup: FullSchoolBackup) => Promise<void> | void;
}

export const BackupRestoreTab: React.FC<BackupRestoreTabProps> = ({
  settings,
  stateData,
  femaleTeachers,
  onBackupRestored,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // حالة الاسترداد
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedBackup, setParsedBackup] = useState<FullSchoolBackup | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [syncToFirebase, setSyncToFirebase] = useState(true);

  // حساب بيانات التصدير الحالية
  const currentBackupPreview = React.useMemo(() => {
    return generateFullBackupData(stateData, settings, femaleTeachers);
  }, [stateData, settings, femaleTeachers]);

  // دالة التصدير والتنزيل
  const handleExportDownload = () => {
    setIsExporting(true);
    setExportSuccessMessage(null);
    try {
      const backup = generateFullBackupData(stateData, settings, femaleTeachers);
      downloadBackupFile(backup);
      setExportSuccessMessage(`تم تنزيل النسخة الاحتياطية بنجاح على جهازك (${backup.counts.timetableLessons} حصة، ${backup.counts.substitutions} احتياط).`);
      setTimeout(() => setExportSuccessMessage(null), 8000);
    } catch (err) {
      alert(`حدث خطأ أثناء التصدير: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsExporting(false);
    }
  };

  // نسخ JSON إلى الحافظة
  const handleCopyJson = () => {
    const backup = generateFullBackupData(stateData, settings, femaleTeachers);
    navigator.clipboard.writeText(JSON.stringify(backup, null, 2)).then(() => {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 3000);
    });
  };

  // معالجة اختيار ملف الاستيراد
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationError(null);
    setParsedBackup(null);
    setRestoreStatus(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = validateBackupJson(text);
      if (result.isValid && result.backup) {
        setParsedBackup(result.backup);
      } else {
        setValidationError(result.error || 'الملف غير صالح.');
      }
    };
    reader.onerror = () => {
      setValidationError('تعذر قراءة الملف المختار من جهازك.');
    };
    reader.readAsText(file);
  };

  // تنفيذ الاسترداد
  const handleConfirmRestore = async () => {
    if (!parsedBackup) return;

    const confirmMsg = `تنبيه هام:\nهل أنت متأكد من رغبتك في استرداد بيانات "${parsedBackup.schoolName}"؟\nسيتم استبدال الجدول الحالي وبيانات الاحتياط والمناوبة والإعدادات بالبيانات الموجودة في ملف النسخة الاحتياطية (${parsedBackup.counts.timetableLessons} حصة، ${parsedBackup.counts.substitutions} احتياط).`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsRestoring(true);
    setRestoreStatus(null);

    try {
      const result = await applyRestoredBackup(parsedBackup, { syncToFirebase });
      setRestoreStatus(result);

      if (result.success) {
        // إخطار المكون الأب لتحديث الحالات النشطة فوراً
        await onBackupRestored(parsedBackup);
      }
    } catch (err) {
      setRestoreStatus({
        success: false,
        message: `حدث خطأ غير متوقع أثناء الاسترداد: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // إعادة تعيين نموذج الاسترداد
  const handleResetRestoreForm = () => {
    setSelectedFile(null);
    setParsedBackup(null);
    setValidationError(null);
    setRestoreStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* ترويسة التبويب */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-['Cairo'] flex items-center gap-2">
              <span>النسخ الاحتياطي الشامل والاسترداد (ملف JSON)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                v2.0 محلي وسحابي
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تصدير وحفظ كافة بيانات المدرسة (الجدول، الاحتياط، المناوبة، المعلمات، الإعدادات) في ملف واحد لنقلها إلى أي جهاز آخر بسهولة تامة وبأمان.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyJson}
            className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-2xs"
            title="نسخ نص بيانات JSON بالكامل للحافظة"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copiedJson ? 'تم النسخ!' : 'نسخ كود JSON'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= القسم الأول: تصدير نسخة احتياطية ================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-['Cairo']">
                    1. تصدير وحفظ نسخة احتياطية محلية
                  </h3>
                  <p className="text-[11px] text-slate-500">حفظ ملف (.json) يحوي كافة بيانات المدرسة الحالية</p>
                </div>
              </div>
            </div>

            {/* ملخص محتويات النسخة الحالية */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                  <span>المدرسة:</span>
                </span>
                <span className="font-black text-slate-900">{currentBackupPreview.schoolName}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">حصص الجدول</span>
                  <span className="text-xs font-black text-indigo-700 font-mono">
                    {currentBackupPreview.counts.timetableLessons}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">سجلات الاحتياط</span>
                  <span className="text-xs font-black text-amber-700 font-mono">
                    {currentBackupPreview.counts.substitutions}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">سجلات المناوبة</span>
                  <span className="text-xs font-black text-teal-700 font-mono">
                    {currentBackupPreview.counts.duties}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">المعلمات المعتمدات</span>
                  <span className="text-xs font-black text-violet-700 font-mono">
                    {currentBackupPreview.counts.femaleTeachers}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">الإعلانات والأخبار</span>
                  <span className="text-xs font-black text-rose-700 font-mono">
                    {currentBackupPreview.counts.announcements}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block">فترات ومواقيت</span>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    {currentBackupPreview.counts.periods}
                  </span>
                </div>
              </div>
            </div>

            {/* رسالة نجاح التصدير */}
            {exportSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{exportSuccessMessage}</span>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={handleExportDownload}
              disabled={isExporting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'جارٍ إعداد الملف...' : 'تنزيل ملف النسخة الاحتياطية الآن (JSON)'}</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              الملف خفيف وآمن ويحفظ في مجلد التنزيلات بجهازك، ويمكنك إرساله أو فتحه في أي متصفح آخر.
            </p>
          </div>
        </div>

        {/* ================= القسم الثاني: استرداد نسخة احتياطية ================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-['Cairo']">
                    2. استرداد البيانات من ملف محلي (JSON)
                  </h3>
                  <p className="text-[11px] text-slate-500">اختر ملف نسخة سابقة تم حفظه لنقله لهذا الجهاز</p>
                </div>
              </div>

              {parsedBackup && (
                <button
                  type="button"
                  onClick={handleResetRestoreForm}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-bold"
                >
                  إلغاء واختيار ملف آخر
                </button>
              )}
            </div>

            {/* منطقة اختيار الملف */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
              id="backup-file-input"
            />

            {!parsedBackup ? (
              <label
                htmlFor="backup-file-input"
                className="w-full border-2 border-dashed border-slate-300 hover:border-violet-500 bg-slate-50 hover:bg-violet-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group"
              >
                <FileJson className="w-10 h-10 text-slate-400 group-hover:text-violet-600 mb-2 transition" />
                <span className="text-xs font-black text-slate-800 group-hover:text-violet-900">
                  انقر هنا لاختيار ملف النسخة الاحتياطية (.json)
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  أو اسحب وأفلت الملف داخل هذا المربع
                </span>
              </label>
            ) : (
              /* بطاقة فحص ومعاينة النسخة المستوردة */
              <div className="bg-violet-50/70 border border-violet-200 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-violet-200/80">
                  <div>
                    <span className="text-xs font-black text-violet-950 block">{parsedBackup.schoolName}</span>
                    <span className="text-[10px] text-violet-700">تاريخ التصدير: {parsedBackup.exportDateFormatted}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-200/80 text-violet-900">
                    ملف صالح ومكتمل ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">حصص الجدول</span>
                    <span className="text-xs font-black text-indigo-700 font-mono">
                      {parsedBackup.counts.timetableLessons}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">الاحتياط</span>
                    <span className="text-xs font-black text-amber-700 font-mono">
                      {parsedBackup.counts.substitutions}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">المناوبة</span>
                    <span className="text-xs font-black text-teal-700 font-mono">
                      {parsedBackup.counts.duties}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">المعلمات</span>
                    <span className="text-xs font-black text-violet-700 font-mono">
                      {parsedBackup.counts.femaleTeachers}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">الإعلانات</span>
                    <span className="text-xs font-black text-rose-700 font-mono">
                      {parsedBackup.counts.announcements}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-violet-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">الفترات</span>
                    <span className="text-xs font-black text-slate-800 font-mono">
                      {parsedBackup.counts.periods}
                    </span>
                  </div>
                </div>

                {/* خيار المزامنة السحابية الفورية */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-violet-200/60">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={syncToFirebase}
                      onChange={(e) => setSyncToFirebase(e.target.checked)}
                      className="w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
                    />
                    <span className="flex items-center gap-1 text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>مزامنة النسخة المستردة فوراً إلى Firebase السحابية</span>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* خطأ التحقق */}
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-bold animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* حالة الاسترداد */}
            {restoreStatus && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 font-bold animate-fade-in ${
                  restoreStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {restoreStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-black text-sm">{restoreStatus.success ? 'تم الاسترداد بنجاح!' : 'خطأ أثناء الاسترداد'}</p>
                  <p className="font-normal text-[11px] mt-0.5">{restoreStatus.message}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              disabled={!parsedBackup || isRestoring}
              onClick={handleConfirmRestore}
              className={`w-full py-3 px-4 rounded-xl font-black text-sm shadow-sm transition flex items-center justify-center gap-2 ${
                parsedBackup && !isRestoring
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white cursor-pointer active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جارٍ استرداد البيانات ومزامنتها...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>تأكيد واسترداد كافة البيانات إلى الموقع</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              عند التأكيد، سيتم تحديث شاشات العرض والجوال واللوحة الإدارية بالبيانات المستردة فوراً.
            </p>
          </div>
        </div>
      </div>

      {/* ================= بطاقة إرشادات النقل السهل بين الأجهزة ================= */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-indigo-100 rounded-2xl p-5 shadow-2xs">
        <h3 className="text-sm font-black text-slate-900 font-['Cairo'] flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>كيفية نقل البيانات واستخدام النسخة الاحتياطية على جهاز آخر:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="bg-white p-3.5 rounded-xl border border-indigo-100/80 shadow-2xs space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mb-1.5">
              1
            </div>
            <h4 className="font-bold text-slate-900">تصدير الملف</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              انقر على "تنزيل ملف النسخة الاحتياطية الآن" من جهازك الحالي ليتم حفظ ملف JSON في التنزيلات.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-indigo-100/80 shadow-2xs space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mb-1.5">
              2
            </div>
            <h4 className="font-bold text-slate-900">نقل الملف</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              انقل ملف JSON عبر البريد أو فلاش ميموري أو التخزين السحابي إلى الجهاز أو الشاشة الجديدة.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-indigo-100/80 shadow-2xs space-y-1">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs mb-1.5">
              3
            </div>
            <h4 className="font-bold text-slate-900">الاسترداد الفوري</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              افتح موقع المدرسة في الجهاز الآخر، وادخل لوحة الإدارة ثم اختر هذا التبويب وانقر "استرداد البيانات".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
