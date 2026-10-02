import React, { useState, useEffect } from 'react';
import { Substitution } from '../../types';
import { formatAcknowledgmentTime } from '../../utils/qrUtils';
import { getSingleSubstitutionFromFirestore } from '../../services/firebase';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  School,
  Sparkles,
  Lock,
  DoorClosed,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface TeacherAcknowledgmentModalProps {
  subId?: string | null;
  substitution: Substitution | null;
  schoolName: string;
  isOpen: boolean;
  onConfirm: (subId: string, notes?: string) => Promise<boolean> | boolean;
}

export const TeacherAcknowledgmentModal: React.FC<TeacherAcknowledgmentModalProps> = ({
  subId,
  substitution: initialSub,
  schoolName,
  isOpen,
  onConfirm,
}) => {
  const [currentSub, setCurrentSub] = useState<Substitution | null>(initialSub);
  const [isLoadingSub, setIsLoadingSub] = useState<boolean>(!initialSub && Boolean(subId));
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessJustNow, setIsSuccessJustNow] = useState(false);
  const [isTabClosedManually, setIsTabClosedManually] = useState(false);

  // تحديث التكليف عند تغير initialSub
  useEffect(() => {
    if (initialSub) {
      setCurrentSub(initialSub);
      setIsLoadingSub(false);
    }
  }, [initialSub]);

  // في حال تم فتح الرابط مباشرة على هاتف المعلم ولم تكن البيانات المحلية محملة بعد، نجلبها من Firestore مباشرة
  useEffect(() => {
    if (!currentSub && subId) {
      let isMounted = true;
      setIsLoadingSub(true);
      getSingleSubstitutionFromFirestore(subId)
        .then((fetched) => {
          if (isMounted) {
            if (fetched) setCurrentSub(fetched);
            setIsLoadingSub(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoadingSub(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [subId, currentSub]);

  if (!isOpen) return null;

  const isAlreadyAcknowledged = Boolean(
    currentSub && (currentSub.status === 'تم الحضور' || currentSub.acknowledgedAt)
  );

  const handleConfirmClick = async () => {
    if (!currentSub) return;
    setIsSubmitting(true);
    try {
      const ok = await onConfirm(currentSub.id, notes.trim());
      if (ok) {
        setIsSuccessJustNow(true);
        // محاولة إغلاق علامة التبويب تلقائياً بعد ثانية ونصف لتوفير وقت المعلم
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            try {
              window.close();
            } catch {}
          }, 1500);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTab = () => {
    setIsTabClosedManually(true);
    if (typeof window !== 'undefined') {
      try {
        window.close();
      } catch {}
    }
  };

  // حالة 1: بعد الضغط على إغلاق الصفحة (حالة الإغلاق الكامل والأمان)
  if (isTabClosedManually) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-200 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <DoorClosed className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 font-['Cairo'] mb-2">
          تم إنهاء الجلسة بنجاح ✅
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          تم توثيق استلامك للحصة رسمياً في السجلات السحابية لإدارة المدرسة. يرجى إغلاق علامة تبويب المتصفح في هاتفك الآن والتوجه لقاعة الفصل.
        </p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px] font-bold">
          🔒 النافذة مغلقة ومحمية بالكامل ولا تتيح التصفح لأسباب الخصوصية والأمان.
        </div>
      </div>
    );
  }

  // حالة 2: تم تسليم الاحتياط بنجاح للتو (شاشة التسليم والإغلاق الأنيقة المعتمدة)
  if (isSuccessJustNow) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>

        <h3 className="text-xl font-black text-slate-900 font-['Cairo'] mb-1">
          تم تسليم تأكيد الاستلام بنجاح ✅
        </h3>
        <p className="text-xs text-emerald-800 font-bold mb-4">
          أ. {currentSub?.substituteTeacher} - شكراً لتعاونكم ومسؤوليتكم التربوية
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 text-xs text-emerald-950 space-y-2 text-right">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تم اعتماد حضوركم وتوثيق الالتزام بالحصة في السجلات.</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            انعكست الحالة فوراً على الشاشات المعلقة في ممرات المدرسة، وسجلات الإدارة لم تعد تطلب توقيعاً ورقياً.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center mb-6">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-700 font-bold mb-0.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>تم إغلاق الجلسة لأغراض الأمان والخصوصية 🔒</span>
          </div>
          <p className="text-[11px] text-slate-500">
            يمكنك الآن إغلاق هذه الصفحة والتوجه مباشرة إلى قاعة الفصل.
          </p>
        </div>

        <button
          onClick={handleCloseTab}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-2xl font-black text-sm shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
        >
          <DoorClosed className="w-4 h-4 text-amber-300" />
          <span>إغلاق هذه الصفحة والتوجه إلى الفصل</span>
        </button>
      </div>
    );
  }

  // حالة 3: جارٍ جلب البيانات
  if (isLoadingSub) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 mx-auto flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 text-indigo-600 animate-spin" />
        </div>
        <h3 className="text-base font-black text-slate-900 font-['Cairo'] mb-2">
          جارٍ التحقق من بيانات التكليف...
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          يرجى الانتظار لحظات للاتصال بالسجلات السحابية المعتمدة.
        </p>
      </div>
    );
  }

  // حالة 4: لم يتم العثور على التكليف
  if (!currentSub) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-rose-600" />
        </div>
        <h3 className="text-base font-black text-slate-900 font-['Cairo'] mb-2">
          تعذر العثور على بيانات التكليف
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          قد يكون التكليف قد تم تحديثه أو إلغاؤه من قبل إدارة المدرسة. يرجى مراجعة إدارة المدرسة مباشرة.
        </p>
        <button
          onClick={handleCloseTab}
          className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
        >
          إغلاق الصفحة
        </button>
      </div>
    );
  }

  // حالة 5: الواجهة الأساسية لتأكيد استلام الاحتياط (محمية ومخصصة لهذا التكليف فقط)
  return (
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
      {/* ترويسة أمنية رسمية مخصصة للمعلم فقط */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 border-b border-indigo-900/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
            <School className="w-6 h-6 text-amber-300" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-indigo-300 block truncate">
              {schoolName || 'مدرستنا الذكية'}
            </span>
            <h2 className="text-base font-black font-['Cairo'] tracking-tight truncate">
              بوابة تأكيد استلام حصة الاحتياط
            </h2>
          </div>
        </div>

        {/* وسم الأمان والخصوصية */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-indigo-300/80 bg-white/5 py-1 px-2.5 rounded-lg border border-white/10">
          <Lock className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>جلسة معتمدة خاصة بالمعلم المكلف - مشفرة ومحمية بالكامل</span>
        </div>
      </div>

      {/* جسم البطاقة */}
      <div className="p-5 space-y-4">
        {/* شارة الحالة العلوية */}
        {isAlreadyAcknowledged ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-black text-emerald-950">
                تم استلام التكليف وتأكيد الحضور مسبقاً ✅
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5 font-bold">
                {currentSub.acknowledgedAt
                  ? `تم التوثيق رسمياً في تمام: ${formatAcknowledgmentTime(currentSub.acknowledgedAt)}`
                  : 'تم اعتماد التواجد وتحديث شاشة المدرسة وسجلات الإدارة فوراً.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950">
                بانتظار تسليم تأكيد استلامك للحصة
              </h4>
              <p className="text-[11px] text-amber-800">
                يرجى النقر على زر التسليم بالأسفل لتوثيق استلامك في السجلات السحابية فوراً.
              </p>
            </div>
          </div>
        )}

        {/* تفاصيل التكليف الرسمي - للمعلم فقط دون إظهار أي معلمين آخرين */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              المعلم البديل المكلف:
            </span>
            <span className="text-sm font-black text-slate-900 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
              أ. {currentSub.substituteTeacher}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold mb-0.5">المادة الدراسية:</span>
              <span className="text-xs font-black text-indigo-950 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                {currentSub.subject}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold mb-0.5">الصف والفصل:</span>
              <span className="text-xs font-black text-slate-900 font-mono">
                فصل {currentSub.gradeClass}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold mb-0.5">الحصة:</span>
              <span className="text-xs font-black text-amber-800">
                {currentSub.period}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold mb-0.5">المعلم الغائب:</span>
              <span className="text-xs font-medium text-rose-700 line-through truncate block">
                {currentSub.absentTeacher}
              </span>
            </div>
          </div>

          {(currentSub.day || currentSub.date) && (
            <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-200/80">
              <span>اليوم: <strong className="text-slate-800">{currentSub.day || 'اليوم'}</strong></span>
              {currentSub.date && <span>التاريخ: <strong className="text-slate-800 font-mono">{currentSub.date}</strong></span>}
            </div>
          )}
        </div>

        {/* خانة الملاحظات الاختيارية للمعلم */}
        {!isAlreadyAcknowledged && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظة لإدارة المدرسة (اختياري):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: متواجد بالقاعة ومستلم للحصة"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        )}

        {/* زر الإجراء: إما تأكيد تسليم الاحتياط أو إغلاق الصفحة التام */}
        {!isAlreadyAcknowledged ? (
          <button
            onClick={handleConfirmClick}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>جارٍ توثيق التأكيد في السحابة...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>تسليم تأكيد استلام الحصة والالتزام بها ✅</span>
              </>
            )}
          </button>
        ) : (
          <div className="pt-2 space-y-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
              <span className="text-xs font-bold text-emerald-950 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                شكراً لحرصك ومسؤوليتك العالية زميلنا الفاضل
              </span>
              <span className="text-[11px] text-emerald-800 mt-1 block">
                تم توثيق استلامك رسمياً وإشعار الإدارة وانعكس الحضور على الشاشات المعلقة.
              </span>
            </div>

            <button
              onClick={handleCloseTab}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <DoorClosed className="w-4 h-4 text-amber-300" />
              <span>إغلاق الصفحة والتوجه إلى الفصل</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
