import React, { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  X,
  LogIn,
  LogOut,
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Database,
  Smartphone,
  Globe,
  User,
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    isFirestoreConnected,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInQuickAdmin,
    logOut,
  } = useFirebase();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAndroidOrMobile =
    typeof navigator !== 'undefined' &&
    (/android/i.test(navigator.userAgent) ||
      Boolean((window as unknown as { Capacitor?: unknown }).Capacitor));

  const handleQuickAdminSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await signInQuickAdmin();
      setSuccessMsg('تم تسجيل الدخول السريع كمدير معتمد بنجاح!');
      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccessMsg('تم تسجيل الدخول بحساب Google بنجاح!');
      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmail(email, password);
        setSuccessMsg('تم تسجيل الدخول بالبريد الإلكتروني بنجاح!');
      } else {
        await signUpWithEmail(email, password);
        setSuccessMsg('تم إنشاء الحساب وتسجيل الدخول بنجاح!');
      }
      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setErrorMsg('بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.');
      } else if (msg.includes('email-already-in-use')) {
        setErrorMsg('هذا البريد مسجل مسبقاً، يمكنك تسجيل الدخول به.');
      } else if (msg.includes('weak-password')) {
        setErrorMsg('كلمة المرور ضعيفة، يرجى كتابة 6 أحرف على الأقل.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      setSuccessMsg('تم تسجيل الخروج بنجاح.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-['Cairo']">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-right">
        {/* رأس النافذة */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
              <SchoolLogo className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                تسجيل دخول المشرف وخدمات السحابة
              </h3>
              <p className="text-xs text-slate-500">
                إدارة الجلسة وربط الحساب مع قاعدة بيانات Firebase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* تنبيه حالة السحابة (Firestore) */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-700 font-bold">قاعدة بيانات Firestore:</span>
          </div>
          <span
            className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
              isFirestoreConnected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isFirestoreConnected ? '🟢 متصلة وجاهزة للمزامنة' : '🟡 جاري فحص الاتصال...'}
          </span>
        </div>

        {/* في حال تسجيل الدخول مسبقاً */}
        {currentUser ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
              <User className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-emerald-950 text-sm mb-1">
              أنت مسجل الدخول حالياً بحساب المشرف
            </h4>
            <p className="text-xs text-emerald-800 font-mono mb-4">
              {currentUser.email || currentUser.displayName || 'مشرف معتمد'}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={loading}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج من الحساب</span>
            </button>
          </div>
        ) : (
          <div>
            {/* خيار الدخول السريع كمدير معتمد (نقرة واحدة - مثالي للأندرويد والأجهزة اللوحية) */}
            <div className="mb-3.5">
              <button
                type="button"
                onClick={handleQuickAdminSignIn}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>دخول سريع كمدير معتمد (نقرة واحدة — مدعوم 100% للأندرويد)</span>
              </button>
            </div>

            {/* خيار الدخول بحساب Google (للمتصفحات) */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>دخول بحساب Google Workspace (المتصفح)</span>
              </button>

              {isAndroidOrMobile && (
                <p className="mt-1.5 text-[11px] text-amber-700 leading-tight bg-amber-50 p-2 rounded-lg border border-amber-200">
                  💡 ملاحظة لتطبيق الأندرويد: تقيد Google تسجيل الدخول بالـ Popup في WebView. يمكنك استخدام "الدخول السريع كمدير" أعلاه، أو إدخال البريد الإلكتروني أدناه.
                </p>
              )}
            </div>

            {/* فاصل */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[11px] font-bold text-slate-400">أو بالبريد وكلمة المرور (مدعوم في الأندرويد)</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* نموذج البريد وكلمة المرور */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@school.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-left"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{authMode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                >
                  {authMode === 'signin'
                    ? 'ليس لديك حساب؟ إنشاء حساب مشرف جديد'
                    : 'لديك حساب بالفعل؟ تسجيل الدخول'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* رسائل التنبيه والنجاح */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
