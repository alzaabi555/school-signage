import { Period, PeriodProgress } from '../types';
import { INITIAL_PERIODS } from '../data/initialData';

/**
 * تحويل وقت بنسق HH:mm إلى عدد الدقائق منذ منتصف الليل
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * تحويل تاريخ Date إلى عدد الدقائق والثواني بدقة
 */
export function getMinutesAndSecondsFromDate(date: Date): { totalMinutes: number; totalSeconds: number; currentHours: number; currentMinutes: number; currentSeconds: number } {
  const currentHours = date.getHours();
  const currentMinutes = date.getMinutes();
  const currentSeconds = date.getSeconds();
  const totalMinutes = currentHours * 60 + currentMinutes + currentSeconds / 60;
  const totalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
  return { totalMinutes, totalSeconds, currentHours, currentMinutes, currentSeconds };
}

/**
 * حساب حالة الحصة الجارية، النسبة المئوية للمنقضي، والوقت المتبقي بدقة
 */
export function calculatePeriodProgress(
  periods: Period[],
  currentTime: Date
): PeriodProgress {
  if (!periods || periods.length === 0) {
    return {
      state: 'before_school',
      activePeriod: null,
      nextPeriod: null,
      progressPercent: 0,
      timeRemainingMinutes: 0,
      timeRemainingSeconds: 0,
      elapsedMinutes: 0,
      totalDurationMinutes: 0,
      formattedRemaining: '00:00',
    };
  }

  // ترتيب الحصص زمنياً
  const sortedPeriods = [...periods].sort(
    (a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime)
  );

  const { totalSeconds } = getMinutesAndSecondsFromDate(currentTime);
  const firstPeriodStart = timeStringToMinutes(sortedPeriods[0].startTime) * 60;
  const lastPeriodEnd = timeStringToMinutes(sortedPeriods[sortedPeriods.length - 1].endTime) * 60;

  // قبل بداية اليوم الدراسي
  if (totalSeconds < firstPeriodStart) {
    const diffSeconds = firstPeriodStart - totalSeconds;
    const remainingMins = Math.floor(diffSeconds / 60);
    const remainingSecs = Math.floor(diffSeconds % 60);
    return {
      state: 'before_school',
      activePeriod: null,
      nextPeriod: sortedPeriods[0],
      progressPercent: 0,
      timeRemainingMinutes: remainingMins,
      timeRemainingSeconds: remainingSecs,
      elapsedMinutes: 0,
      totalDurationMinutes: 0,
      formattedRemaining: `${String(remainingMins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`,
    };
  }

  // بعد نهاية اليوم الدراسي
  if (totalSeconds >= lastPeriodEnd) {
    return {
      state: 'after_school',
      activePeriod: null,
      nextPeriod: null,
      progressPercent: 100,
      timeRemainingMinutes: 0,
      timeRemainingSeconds: 0,
      elapsedMinutes: 0,
      totalDurationMinutes: 0,
      formattedRemaining: '00:00',
    };
  }

  // فحص الحصة الحالية
  for (let i = 0; i < sortedPeriods.length; i++) {
    const period = sortedPeriods[i];
    const startSec = timeStringToMinutes(period.startTime) * 60;
    const endSec = timeStringToMinutes(period.endTime) * 60;
    const nextPeriod = i < sortedPeriods.length - 1 ? sortedPeriods[i + 1] : null;

    if (totalSeconds >= startSec && totalSeconds < endSec) {
      const durationSec = endSec - startSec;
      const elapsedSec = totalSeconds - startSec;
      const remainingSec = endSec - totalSeconds;

      const progressPercent = Math.min(100, Math.max(0, (elapsedSec / durationSec) * 100));
      const remainingMins = Math.floor(remainingSec / 60);
      const remainingSecsOnly = Math.floor(remainingSec % 60);

      return {
        state: period.isBreak ? 'in_break' : 'in_period',
        activePeriod: period,
        nextPeriod: nextPeriod,
        progressPercent: parseFloat(progressPercent.toFixed(1)),
        timeRemainingMinutes: remainingMins,
        timeRemainingSeconds: remainingSecsOnly,
        elapsedMinutes: Math.floor(elapsedSec / 60),
        totalDurationMinutes: Math.floor(durationSec / 60),
        formattedRemaining: `${String(remainingMins).padStart(2, '0')}:${String(remainingSecsOnly).padStart(2, '0')}`,
      };
    }

    // إذا كان بين حصتين (فترة انتقال)
    if (nextPeriod) {
      const nextStartSec = timeStringToMinutes(nextPeriod.startTime) * 60;
      if (totalSeconds >= endSec && totalSeconds < nextStartSec) {
        const gapDurationSec = nextStartSec - endSec;
        const gapElapsedSec = totalSeconds - endSec;
        const gapRemainingSec = nextStartSec - totalSeconds;
        const progress = Math.min(100, Math.max(0, (gapElapsedSec / gapDurationSec) * 100));
        const remMins = Math.floor(gapRemainingSec / 60);
        const remSecs = Math.floor(gapRemainingSec % 60);

        return {
          state: 'between_periods',
          activePeriod: period, // آخر حصة منتهية
          nextPeriod: nextPeriod,
          progressPercent: parseFloat(progress.toFixed(1)),
          timeRemainingMinutes: remMins,
          timeRemainingSeconds: remSecs,
          elapsedMinutes: Math.floor(gapElapsedSec / 60),
          totalDurationMinutes: Math.floor(gapDurationSec / 60),
          formattedRemaining: `${String(remMins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`,
        };
      }
    }
  }

  // افتراضي
  return {
    state: 'after_school',
    activePeriod: null,
    nextPeriod: null,
    progressPercent: 100,
    timeRemainingMinutes: 0,
    timeRemainingSeconds: 0,
    elapsedMinutes: 0,
    totalDurationMinutes: 0,
    formattedRemaining: '00:00',
  };
}

/**
 * جلب اسم يوم الأسبوع باللغة العربية
 */
export function getArabicDayName(date: Date): string {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[date.getDay()];
}

/**
 * تنسيق التاريخ بالتقويم الهجري والميلادي
 */
export function formatFullArabicDate(date: Date): { hijri: string; gregorian: string; dayName: string; formattedTime: string } {
  const dayName = getArabicDayName(date);
  
  // التاريخ الهجري التقريبي الدقيق
  let hijriStr = '';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriStr = hijriFormatter.format(date);
  } catch {
    hijriStr = '1448 هـ';
  }

  // التاريخ الميلادي بالعربية
  const gregorianFormatter = new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const gregorianStr = gregorianFormatter.format(date);

  // تنسيق الوقت HH:mm:ss
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return {
    hijri: hijriStr,
    gregorian: gregorianStr,
    dayName,
    formattedTime
  };
}

/**
 * تنقية ومعالجة قائمة الفترات والحصص:
 * 1. منع أي تكرار للحصص التدريسية (p1 إلى p8).
 * 2. الحصص التدريسية حصراً تأخذ معرفات p1 إلى p8 ولا تأخذ معرفات b1 أو b2 أبداً.
 * 3. معرفات b1 و b2 مخصصة حصراً للفسح والاستراحات (isBreak: true).
 * 4. تصحيح أي تضارب ناتج عن دمج الجداول مع Google Sheets أو Firestore.
 */
export function sanitizeAndDeduplicatePeriods(periods: Period[]): Period[] {
  if (!periods || !Array.isArray(periods) || periods.length === 0) {
    return INITIAL_PERIODS;
  }

  // 1. تنقية كل عنصر ومعالجة المعرفات الشاذة
  const candidatePeriods: Period[] = [];
  
  for (const raw of periods) {
    if (!raw) continue;
    const name = String(raw.name || '').trim();
    const id = String(raw.id || '').trim().toLowerCase();
    const isBreak = Boolean(
      raw.isBreak ||
      id.startsWith('b') ||
      id === 'p0' ||
      name.includes('فسح') ||
      name.includes('استراح') ||
      name.includes('طابور') ||
      name.includes('نشيد') ||
      name.includes('صلاة')
    );

    let resolvedId = id;
    let resolvedName = name;
    let resolvedIsBreak = isBreak;

    if (name.includes('طابور') || name.includes('اصطفاف')) {
      resolvedId = 'p0';
      resolvedIsBreak = true;
      resolvedName = 'طابور الصباح';
    } else if (name.includes('الأولى') || name.includes('الاولى')) {
      resolvedId = 'p1';
      resolvedIsBreak = false;
      resolvedName = 'الحصة الأولى';
    } else if (name.includes('الثانية')) {
      resolvedId = 'p2';
      resolvedIsBreak = false;
      resolvedName = 'الحصة الثانية';
    } else if (name.includes('الثالثة')) {
      resolvedId = 'p3';
      resolvedIsBreak = false;
      resolvedName = 'الحصة الثالثة';
    } else if (name.includes('الرابعة')) {
      resolvedId = 'p4';
      resolvedIsBreak = false;
      resolvedName = 'الحصة الرابعة';
    } else if (name.includes('الخامسة')) {
      resolvedId = 'p5';
      resolvedIsBreak = false;
      resolvedName = 'الحصة الخامسة';
    } else if (name.includes('السادسة')) {
      resolvedId = 'p6';
      resolvedIsBreak = false;
      resolvedName = 'الحصة السادسة';
    } else if (name.includes('السابعة')) {
      resolvedId = 'p7';
      resolvedIsBreak = false;
      resolvedName = 'الحصة السابعة';
    } else if (name.includes('الثامنة')) {
      resolvedId = 'p8';
      resolvedIsBreak = false;
      resolvedName = 'الحصة الثامنة';
    } else if (resolvedId === 'break' || resolvedId === 'b1' || name.includes('فسح')) {
      resolvedId = 'b1';
      resolvedIsBreak = true;
      resolvedName = 'الفسحة';
    }

    // لا نسمح إطلاقاً بأن تأخذ الفسحة معرف حصة تدريسية (p1 إلى p8)
    if (resolvedIsBreak && /^p[1-8]$/.test(resolvedId)) {
      resolvedId = 'b1';
      resolvedName = 'الفسحة';
    }

    // لا نسمح إطلاقاً بأن تأخذ الحصة التدريسية معرف فسحة (b1, b2, break)
    if (!resolvedIsBreak && (resolvedId.startsWith('b') || resolvedId === 'break')) {
      if (name.includes('فسح') || name.includes('استراح')) {
        resolvedIsBreak = true;
      }
    }

    candidatePeriods.push({
      ...raw,
      id: resolvedId,
      name: resolvedName,
      startTime: raw.startTime || '07:10',
      endTime: raw.endTime || '07:45',
      isBreak: resolvedIsBreak,
      order: raw.order ?? 0,
    });
  }

  // 2. إزالة التكرارات: نمنع تكرار أي معرف فترة
  const mapById = new Map<string, Period>();
  for (const item of candidatePeriods) {
    if (!item.id) continue;
    const existing = mapById.get(item.id);
    if (!existing) {
      mapById.set(item.id, item);
    } else {
      if (item.startTime && item.endTime) {
        mapById.set(item.id, { ...existing, ...item });
      }
    }
  }

  // 3. التحقق من وجود الحصص الأساسية (p1 إلى p8) والطابور (p0) والفسحة (b1)
  const defaultMap = new Map(INITIAL_PERIODS.map((p) => [p.id, p]));
  for (const [id, defPeriod] of defaultMap.entries()) {
    if (!mapById.has(id)) {
      mapById.set(id, defPeriod);
    }
  }

  // 4. الفرز الزمني وإعادة الترتيب التسلسلي
  const sorted = Array.from(mapById.values()).sort((a, b) => {
    const tA = timeStringToMinutes(a.startTime);
    const tB = timeStringToMinutes(b.startTime);
    if (tA !== tB) return tA - tB;
    return (a.order ?? 0) - (b.order ?? 0);
  });

  return sorted.map((p, idx) => ({ ...p, order: idx }));
}
