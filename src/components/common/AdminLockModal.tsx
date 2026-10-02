import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, X, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin?: string;
}

export const AdminLockModal: React.FC<AdminLockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPin = '1234',
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // إعادة التعيين والتركيز التلقائي عند الفتح
  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMsg(null);
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const expectedPin = (currentPin && currentPin.trim()) ? currentPin.trim() : '1234';
    const entered = pinInput.trim();

    if (entered === expectedPin) {
      setErrorMsg(null);
      onSuccess();
    } else {
      setErrorMsg('رمز الأمان غير صحيح! يرجى التأكد من الرمز والمحاولة مرة أخرى.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPinInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (num: string) => {
    setErrorMsg(null);
    if (pinInput.length < 10) {
      setPinInput((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setErrorMsg(null);
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setErrorMsg(null);
    setPinInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* رأس النافذة الأمني */}
        <div className="p-5 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="إلغاء"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 mb-3 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black font-['Cairo'] tracking-wide">
              قفل لوحة الإعدادات والإشراف
            </h3>
            <p className="text-xs text-indigo-200 mt-1 max-w-[260px] leading-relaxed">
              هذه المنطقة مخصصة لمشرف النظام وإدارة المدرسة فقط لمنع التلاعب بالبيانات
            </p>
          </div>
        </div>

        {/* محتوى الإدخال */}
        <form onSubmit={handleVerify} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right flex items-center justify-between">
              <span>أدخل رمز الأمان (PIN):</span>
              <span className="text-[10px] text-slate-400 font-mono">الافتراضي: 1234</span>
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={pinInput}
                onChange={(e) => {
                  setErrorMsg(null);
                  setPinInput(e.target.value);
                }}
                placeholder="••••"
                className={`w-full py-3 px-4 text-center font-mono text-xl font-black rounded-2xl border ${
                  errorMsg ? 'border-rose-400 bg-rose-50/50 text-rose-900' : 'border-slate-300 bg-slate-50 text-slate-800'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="mt-2 text-xs text-rose-600 font-bold flex items-center gap-1 justify-center animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* لوحة مفاتيح رقمية سريعة لشاشات اللمس والهواتف الذكية */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base font-mono active:scale-95 transition shadow-2xs cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 font-bold text-xs active:scale-95 transition shadow-2xs cursor-pointer"
            >
              مسح
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base font-mono active:scale-95 transition shadow-2xs cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs active:scale-95 transition shadow-2xs cursor-pointer"
            >
              ⌫
            </button>
          </div>

          {/* أزرار الإجراء */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={!pinInput.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-sm shadow-md transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>دخول مشرف النظام</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
