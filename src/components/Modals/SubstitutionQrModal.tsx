import React, { useEffect, useState } from 'react';
import { Substitution } from '../../types';
import {
  generateQrDataUrl,
  getAssignmentAcknowledgmentUrl,
  formatAcknowledgmentTime,
} from '../../utils/qrUtils';
import {
  QrCode,
  X,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface SubstitutionQrModalProps {
  substitution: Substitution | null;
  isOpen: boolean;
  onClose: () => void;
  onManualConfirm?: (subId: string) => void;
}

export const SubstitutionQrModal: React.FC<SubstitutionQrModalProps> = ({
  substitution,
  isOpen,
  onClose,
  onManualConfirm,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (substitution && isOpen) {
      const url = getAssignmentAcknowledgmentUrl(substitution.id);
      generateQrDataUrl(url, { width: 320, margin: 1, color: { dark: '#000000', light: '#ffffff' } }).then((data) => {
        setQrDataUrl(data);
      });
    }
  }, [substitution, isOpen]);

  if (!isOpen || !substitution) return null;

  const ackUrl = getAssignmentAcknowledgmentUrl(substitution.id);
  const isConfirmed = substitution.status === 'تم الحضور' || Boolean(substitution.acknowledgedAt);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(ackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* الترويسة */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black font-['Cairo']">
                رمز استلام التكليف (QR Code)
              </h3>
              <p className="text-[11px] text-slate-400">
                امسح الرمز بكاميرا الجوال لتأكيد استلام الحصة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم النافذة */}
        <div className="p-5 flex flex-col items-center text-center space-y-4">
          {/* شارة المعلم والتكليف */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-right text-xs">
            <div className="flex items-center justify-between font-bold mb-1">
              <span className="text-slate-500">المعلم المكلف:</span>
              <span className="text-indigo-950 text-sm font-black">أ. {substitution.substituteTeacher}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 text-[11px] border-t border-slate-200 pt-1">
              <span>{substitution.subject} | {substitution.period}</span>
              <span className="font-mono font-bold">فصل {substitution.gradeClass}</span>
            </div>
          </div>

          {/* صورة الـ QR Code كبيرة وعالية التباين */}
          <div className="relative p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner flex flex-col items-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="كود استلام تكليف الاحتياط"
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                جارٍ توليد الرمز...
              </div>
            )}

            {isConfirmed && (
              <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center p-4 text-white animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-300 mb-2" />
                <span className="text-sm font-black">تم تأكيد الاستلام بنجاح ✅</span>
                {substitution.acknowledgedAt && (
                  <span className="text-xs text-emerald-200 mt-1 font-mono">
                    الساعة: {formatAcknowledgmentTime(substitution.acknowledgedAt)}
                  </span>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 max-w-xs">
            يمكن للمعلم توجيه كاميرا الهاتف نحو الشاشة أو الكشاف لمسح هذا الرمز مباشرة دون الحاجة لأي تطبيق أو تسجيل دخول.
          </p>

          {/* زر نسخ الرابط */}
          <div className="w-full pt-1">
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم نسخ الرابط المباشر بنجاح</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>نسخ الرابط المباشر للتأكيد</span>
                </>
              )}
            </button>
          </div>

          {/* فتح الرابط مباشرة أو التأكيد اليدوي للإدارة */}
          <div className="w-full flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <a
              href={ackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>فتح صفحة التأكيد في المتصفح</span>
            </a>

            {!isConfirmed && onManualConfirm && (
              <button
                onClick={() => {
                  onManualConfirm(substitution.id);
                  onClose();
                }}
                className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
              >
                تأكيد يدوي الآن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
