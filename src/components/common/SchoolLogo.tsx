import React, { useState } from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * أيقونة وشعار تطبيق «راصد» الرسمي (الجدول المدرسي والاحتياط)
 * يعرض الأيقونة المعتمدة ثلاثية الأبعاد بتفاصيلها الدقيقة وخلفيتها الكحلية الراقية
 */
export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? 'flex-col sm:flex-row' : ''}`}>
      {!imgError ? (
        <img
          src="/app-logo.png"
          alt="شعار راصد - الجدول المدرسي والاحتياط"
          referrerPolicy="no-referrer"
          className={`${className} object-cover rounded-xl shadow-xs shrink-0 select-none`}
          style={style}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`${className} rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white font-black text-xs shadow-xs select-none`}
          style={style}
        >
          راصد
        </div>
      )}

      {/* كتابة اسم النظام إن طلب ذلك */}
      {showText && (
        <div className="text-center sm:text-right">
          <div className="text-base sm:text-lg font-black text-[#1e40af] font-['Cairo'] tracking-wide">
            راصــــد
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-700 font-['Cairo'] -mt-1">
            الجدول المدرسي والاحتياط
          </div>
        </div>
      )}
    </div>
  );
};
