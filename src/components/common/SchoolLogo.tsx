import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * أيقونة وشعار مدرسة الإبداع للبنين (5-8) المعتمد رسمياً
 * تصميم هندسي رقمي: المعين التكنولوجي، قبعة التخرج، الجوهرة الماسية، والكتاب المفتوح
 */
export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? 'flex-col sm:flex-row' : ''}`}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} shrink-0 drop-shadow-sm select-none`}
        style={style}
      >
        <defs>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#00b4d8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* 1. مسارات الدوائر الإلكترونية والخطوط التقنية الخارجية */}
        <g stroke="#00b4d8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          <path d="M 120 70 L 160 70 L 175 85" />
          <circle cx="120" cy="70" r="4" fill="#00b4d8" />
          <path d="M 280 70 L 240 70 L 225 85" />
          <circle cx="280" cy="70" r="4" fill="#00b4d8" />
          <path d="M 50 150 L 50 190 L 70 210" />
          <circle cx="50" cy="150" r="4" fill="#00b4d8" />
          <path d="M 350 150 L 350 190 L 330 210" />
          <circle cx="350" cy="150" r="4" fill="#00b4d8" />
        </g>

        {/* 2. الإطار الخارجي المعين المائل (المربع الدائري المتراكب) */}
        <rect
          x="200"
          y="35"
          width="180"
          height="180"
          rx="18"
          transform="rotate(45 200 35)"
          fill="none"
          stroke="url(#navyGrad)"
          strokeWidth="11"
        />

        {/* خطوط دوائر إلكترونية ونقاط داخل إطار المعين */}
        <g fill="#0f172a">
          <circle cx="200" cy="42" r="5" fill="#00b4d8" />
          <circle cx="335" cy="177" r="5" fill="#00b4d8" />
          <circle cx="65" cy="177" r="5" fill="#00b4d8" />
          <circle cx="160" cy="80" r="4" />
          <circle cx="240" cy="80" r="4" />
          <circle cx="95" cy="140" r="4" />
          <circle cx="305" cy="140" r="4" />
        </g>

        {/* 3. الحلقة الدائرية الزرقاء السماوية (Cyan Ring) */}
        <circle
          cx="200"
          cy="180"
          r="115"
          fill="none"
          stroke="url(#cyanGrad)"
          strokeWidth="9"
        />

        {/* 4. شبكة العقد والروابط التكنولوجية الزهرية (Circuits & Nodes Rosette) */}
        <g fill="#0f172a" stroke="#0f172a" strokeWidth="3.5">
          {/* العقد الخارجية الدائرية المترابطة (12 عقدة) */}
          <line x1="200" y1="95" x2="200" y2="120" />
          <line x1="242" y1="106" x2="225" y2="128" />
          <line x1="274" y1="138" x2="252" y2="152" />
          <line x1="285" y1="180" x2="260" y2="180" />
          <line x1="274" y1="222" x2="252" y2="208" />
          <line x1="242" y1="254" x2="225" y2="232" />
          <line x1="200" y1="265" x2="200" y2="240" />
          <line x1="158" y1="254" x2="175" y2="232" />
          <line x1="126" y1="222" x2="148" y2="208" />
          <line x1="115" y1="180" x2="140" y2="180" />
          <line x1="126" y1="138" x2="148" y2="152" />
          <line x1="158" y1="106" x2="175" y2="128" />

          {/* روابط العقد ببعضها بشكل حلقة */}
          <polygon
            points="200,95 242,106 274,138 285,180 274,222 242,254 200,265 158,254 126,222 115,180 126,138 158,106"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
          />

          {/* الدوائر / كرات العقد */}
          <circle cx="200" cy="95" r="7.5" />
          <circle cx="242" cy="106" r="7.5" />
          <circle cx="274" cy="138" r="7.5" />
          <circle cx="285" cy="180" r="7.5" />
          <circle cx="274" cy="222" r="7.5" />
          <circle cx="242" cy="254" r="7.5" />
          <circle cx="200" cy="265" r="7.5" />
          <circle cx="158" cy="254" r="7.5" />
          <circle cx="126" cy="222" r="7.5" />
          <circle cx="115" cy="180" r="7.5" />
          <circle cx="126" cy="138" r="7.5" />
          <circle cx="158" cy="106" r="7.5" />

          {/* الحلقة الداخلية للعقد */}
          <circle cx="200" cy="120" r="6" />
          <circle cx="225" cy="128" r="6" />
          <circle cx="252" cy="152" r="6" />
          <circle cx="260" cy="180" r="6" />
          <circle cx="252" cy="208" r="6" />
          <circle cx="225" cy="232" r="6" />
          <circle cx="200" cy="240" r="6" />
          <circle cx="175" cy="232" r="6" />
          <circle cx="148" cy="208" r="6" />
          <circle cx="140" cy="180" r="6" />
          <circle cx="148" cy="152" r="6" />
          <circle cx="175" cy="128" r="6" />
        </g>

        {/* 5. قبعة التخرج في المنتصف (Graduation Mortarboard Cap) */}
        <g id="graduation-cap">
          {/* قمة القبعة الماسية */}
          <polygon
            points="200,140 248,155 200,168 152,155"
            fill="#0f172a"
          />
          {/* قاعدة القبعة الدائرية تحتها */}
          <path
            d="M 172 162 L 172 176 C 172 186, 228 186, 228 176 L 228 162 Z"
            fill="#1e293b"
          />
          {/* زر القبعة وشريطة التخرج المعلقة */}
          <circle cx="200" cy="154" r="2.5" fill="#38bdf8" />
          <path
            d="M 200 154 Q 166 160 160 182"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <circle cx="160" cy="183" r="2" fill="#38bdf8" />
        </g>

        {/* 6. الجوهرة الماسية أسفل قبعة التخرج (Cyan Diamond Gem) */}
        <g id="diamond-gem">
          {/* أوجه الماسة المنعكسة */}
          <polygon
            points="174,188 226,188 200,225"
            fill="url(#diamondGrad)"
          />
          <polygon
            points="174,188 200,188 188,206"
            fill="#7dd3fc"
            opacity="0.8"
          />
          <polygon
            points="200,188 226,188 212,206"
            fill="#0284c7"
            opacity="0.6"
          />
          <polygon
            points="188,206 200,188 212,206 200,225"
            fill="#38bdf8"
          />
          {/* خطوط تقسيم الأوجه */}
          <line x1="174" y1="188" x2="200" y2="225" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <line x1="226" y1="188" x2="200" y2="225" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          <line x1="200" y1="188" x2="200" y2="225" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
        </g>

        {/* 7. الكتاب المفتوح في القاعدة (The Open Book) */}
        <g id="open-book">
          {/* صفحات الكتاب الخارجية باللون السماوي النابض */}
          <path
            d="M 85 305 Q 145 285 200 305 Q 255 285 315 305 L 305 318 Q 255 300 200 318 Q 145 300 95 318 Z"
            fill="#00b4d8"
          />

          {/* الصفحات الرئيسية العميقة بالكحلي */}
          <path
            d="M 98 285 Q 150 265 200 285 Q 250 265 302 285 L 310 298 Q 255 278 200 298 Q 145 278 90 298 Z"
            fill="#0f172a"
          />

          {/* جسم الكتاب وقاعدته السفلية */}
          <path
            d="M 110 268 Q 155 250 200 268 Q 245 250 290 268 L 298 280 Q 250 260 200 280 Q 150 260 102 280 Z"
            fill="#1e293b"
          />

          {/* ثنية العمود الفقري للكتاب في المنتصف */}
          <path
            d="M 200 268 L 200 322"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>
      </svg>

      {/* كتابة اسم المدرسة إن طلب ذلك */}
      {showText && (
        <div className="text-center sm:text-right">
          <div className="text-base sm:text-lg font-black text-[#0284c7] font-['Cairo'] tracking-wide">
            مدرسة الإبــــداع
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#0f172a] font-['Cairo'] -mt-1">
            للبنيــــن (5-8)
          </div>
        </div>
      )}
    </div>
  );
};
