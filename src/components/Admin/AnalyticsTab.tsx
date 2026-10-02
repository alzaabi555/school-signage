import React, { useState, useMemo } from 'react';
import { Substitution, ClassScheduleItem, Period } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  BookOpen,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
  Download,
  Info,
} from 'lucide-react';
import { SCHOOL_WEEK_DAYS } from '../../utils/excelUtils';

interface AnalyticsTabProps {
  substitutions: Substitution[];
  timetable: ClassScheduleItem[];
  periods: Period[];
}

// ألوان مخصصة احترافية ومتناسقة مع الثيم الداكن
const SUBJECT_COLORS = [
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#84cc16', // Lime
  '#a855f7', // Purple
  '#e11d48', // Rose
];

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  substitutions,
  timetable,
  periods,
}) => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | 'week'>('all');

  // 1. حساب مؤشرات الأداء الرئيسية (KPIs)
  const stats = useMemo(() => {
    const totalSubs = substitutions.length;

    // المعلمون الغائبون الفريدون
    const absentTeachersSet = new Set<string>();
    substitutions.forEach((s) => {
      if (s.absentTeacher && s.absentTeacher.trim()) {
        absentTeachersSet.add(s.absentTeacher.trim());
      }
    });

    // المعلمون البدلاء المكلفون
    const substituteTeachersSet = new Set<string>();
    substitutions.forEach((s) => {
      if (s.substituteTeacher && s.substituteTeacher.trim()) {
        substituteTeachersSet.add(s.substituteTeacher.trim());
      }
    });

    // نسبة التغطية (مؤكد أو تم الحضور)
    const coveredSubs = substitutions.filter(
      (s) => s.status === 'مؤكد' || s.status === 'تم الحضور'
    ).length;
    const coverageRate = totalSubs > 0 ? Math.round((coveredSubs / totalSubs) * 100) : 100;

    // احتياط نفس المادة (تخصص)
    const sameSubjectSubs = substitutions.filter(
      (s) => s.notes?.includes('نفس المادة') || s.notes?.includes('تخصص')
    ).length;
    const sameSubjectRate = totalSubs > 0 ? Math.round((sameSubjectSubs / totalSubs) * 100) : 0;

    // حساب المادة الأكثر تسجيلاً للاحتياط
    const subjectCounts: Record<string, number> = {};
    substitutions.forEach((s) => {
      const subj = s.subject?.trim() || 'عام';
      subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
    });

    let topSubject = 'لا يوجد';
    let topSubjectCount = 0;
    Object.entries(subjectCounts).forEach(([subj, count]) => {
      if (count > topSubjectCount) {
        topSubjectCount = count;
        topSubject = subj;
      }
    });

    // حساب اليوم الأكثر تسجيلاً للاحتياط
    const dayCounts: Record<string, number> = {
      الأحد: 0,
      الاثنين: 0,
      الثلاثاء: 0,
      الأربعاء: 0,
      الخميس: 0,
    };

    // استخراج اليوم من تاريخ السجل أو توزيع الحصص
    substitutions.forEach((s) => {
      if (s.date) {
        const d = new Date(s.date);
        const dayIdx = d.getDay();
        const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const dayName = arabicDays[dayIdx];
        if (dayCounts[dayName] !== undefined) {
          dayCounts[dayName] += 1;
        } else {
          dayCounts['الأحد'] += 1;
        }
      } else {
        dayCounts['الأحد'] += 1;
      }
    });

    let peakDay = 'الأحد';
    let peakDayCount = 0;
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > peakDayCount) {
        peakDayCount = count;
        peakDay = day;
      }
    });

    return {
      totalSubs,
      uniqueAbsentTeachers: absentTeachersSet.size,
      uniqueSubstituteTeachers: substituteTeachersSet.size,
      coverageRate,
      sameSubjectRate,
      topSubject,
      topSubjectCount,
      peakDay,
      peakDayCount,
    };
  }, [substitutions]);

  // 2. بيانات الرسم البياني لمعدلات الغياب والاحتياط اليومية عبر أيام الأسبوع
  const dailyAbsenceData = useMemo(() => {
    // تجميع الحصص حسب أيام الأسبوع (الأحد إلى الخميس)
    const dayMap: Record<
      string,
      { day: string; substitutions: number; absentTeachers: Set<string>; confirmed: number }
    > = {
      الأحد: { day: 'الأحد', substitutions: 0, absentTeachers: new Set(), confirmed: 0 },
      الاثنين: { day: 'الاثنين', substitutions: 0, absentTeachers: new Set(), confirmed: 0 },
      الثلاثاء: { day: 'الثلاثاء', substitutions: 0, absentTeachers: new Set(), confirmed: 0 },
      الأربعاء: { day: 'الأربعاء', substitutions: 0, absentTeachers: new Set(), confirmed: 0 },
      الخميس: { day: 'الخميس', substitutions: 0, absentTeachers: new Set(), confirmed: 0 },
    };

    substitutions.forEach((s) => {
      let dayName = 'الأحد';
      if (s.date) {
        const d = new Date(s.date);
        const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const calculated = arabicDays[d.getDay()];
        if (dayMap[calculated]) {
          dayName = calculated;
        }
      }

      dayMap[dayName].substitutions += 1;
      if (s.absentTeacher && s.absentTeacher.trim()) {
        dayMap[dayName].absentTeachers.add(s.absentTeacher.trim());
      }
      if (s.status === 'مؤكد' || s.status === 'تم الحضور') {
        dayMap[dayName].confirmed += 1;
      }
    });

    return SCHOOL_WEEK_DAYS.map((day) => ({
      name: day,
      'حصص الاحتياط': dayMap[day].substitutions,
      'المعلمون المتغيبون': dayMap[day].absentTeachers.size,
      'المكلفون الفعليون': dayMap[day].confirmed,
    }));
  }, [substitutions]);

  // 3. بيانات الرسم البياني لتوزيع الاحتياط حسب المواد الدراسية
  const subjectDistributionData = useMemo(() => {
    const subjectMap: Record<string, { count: number; sameSubjectCount: number }> = {};

    substitutions.forEach((s) => {
      const subj = s.subject?.trim() || 'عام';
      if (!subjectMap[subj]) {
        subjectMap[subj] = { count: 0, sameSubjectCount: 0 };
      }
      subjectMap[subj].count += 1;
      if (s.notes?.includes('نفس المادة') || s.notes?.includes('تخصص')) {
        subjectMap[subj].sameSubjectCount += 1;
      }
    });

    const list = Object.entries(subjectMap).map(([subjectName, data]) => ({
      name: subjectName,
      'إجمالي الاحتياط': data.count,
      'احتياط نفس المادة': data.sameSubjectCount,
      percentage: substitutions.length > 0 ? Math.round((data.count / substitutions.length) * 100) : 0,
    }));

    // الترتيب من الأكثر للأقل
    return list.sort((a, b) => b['إجمالي الاحتياط'] - a['إجمالي الاحتياط']);
  }, [substitutions]);

  // 4. بيانات الرسم البياني الدائري (Pie Chart) للمواد
  const pieSubjectData = useMemo(() => {
    return subjectDistributionData.slice(0, 6).map((item) => ({
      name: item.name,
      value: item['إجمالي الاحتياط'],
    }));
  }, [subjectDistributionData]);

  // 5. بيانات توزيع الاحتياط حسب الحصص الدراسية (من الحصة 1 إلى 8)
  const periodDistributionData = useMemo(() => {
    const periodMap: Record<string, number> = {
      'الحصة الأولى': 0,
      'الحصة الثانية': 0,
      'الحصة الثالثة': 0,
      'الحصة الرابعة': 0,
      'الحصة الخامسة': 0,
      'الحصة السادسة': 0,
      'الحصة السابعة': 0,
      'الحصة الثامنة': 0,
    };

    substitutions.forEach((s) => {
      const pName = s.period?.trim();
      if (pName && periodMap[pName] !== undefined) {
        periodMap[pName] += 1;
      } else {
        // مطابقة ذكية
        const matchedKey = Object.keys(periodMap).find((k) => pName?.includes(k.replace('الحصة ', '')));
        if (matchedKey) {
          periodMap[matchedKey] += 1;
        } else {
          periodMap['الحصة الأولى'] += 1;
        }
      }
    });

    return Object.entries(periodMap).map(([periodName, count]) => ({
      name: periodName.replace('الحصة ', 'ح '),
      fullName: periodName,
      'حصص الاحتياط': count,
    }));
  }, [substitutions]);

  // 6. قائمة المعلمين الأكثر تكليفاً بالاحتياط
  const topSubstituteTeachers = useMemo(() => {
    const teacherMap: Record<string, number> = {};
    substitutions.forEach((s) => {
      const t = s.substituteTeacher?.trim();
      if (t && !t.includes('شاغر')) {
        teacherMap[t] = (teacherMap[t] || 0) + 1;
      }
    });

    return Object.entries(teacherMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [substitutions]);

  // المكون المخصص لنافذة التلميحات (Custom Tooltip) في Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs space-y-1 z-50">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 font-['Cairo']">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 font-medium">{entry.name}:</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 1. الترويسة وبطاقات المؤشرات الرئيسية (KPI Cards) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 font-['Cairo']">
                لوحة إحصائيات الغياب والاحتياط
              </h2>
              <span className="text-[10px] bg-cyan-50 text-cyan-700 border border-cyan-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-600" />
                <span>تحليل تفاعلي Recharts</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              رسوم بيانية تحليلية لمعدلات الغياب وتوزيع حصص الاحتياط حسب المواد والأيام والحصص
            </p>
          </div>
        </div>

        {/* أزرار التصفية والتصدير */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSelectedTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedTimeFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              كافة السجلات
            </button>
            <button
              onClick={() => setSelectedTimeFilter('week')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedTimeFilter === 'week'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              هذا الأسبوع
            </button>
          </div>
        </div>
      </div>

      {/* شبكة بطاقات الأرقام والمؤشرات السريعة */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* إجمالي حصص الاحتياط */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden group hover:border-cyan-400 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold font-['Cairo']">إجمالي حصص الاحتياط</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {stats.totalSubs}
            </span>
            <span className="text-xs text-slate-400">حصة مسجلة</span>
          </div>
          <div className="mt-2 text-[11px] text-cyan-700 font-medium flex items-center gap-1">
            <span>نسبة التغطية المكتملة:</span>
            <span className="font-bold font-mono">{stats.coverageRate}%</span>
          </div>
        </div>

        {/* المعلمون المتغيبون */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden group hover:border-rose-400 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold font-['Cairo']">المعلمون المتغيبون</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
              {stats.uniqueAbsentTeachers}
            </span>
            <span className="text-xs text-slate-400">معلماً</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            تم تغطية حصصهم بـ <strong className="text-emerald-700">{stats.uniqueSubstituteTeachers}</strong> معلماً بديلاً
          </div>
        </div>

        {/* المادة الأكثر احتياطاً */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden group hover:border-amber-400 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold font-['Cairo']">المادة الأكثر احتياطاً</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-amber-800 truncate font-['Cairo']">
              {stats.topSubject}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            سجلت <strong className="text-amber-700 font-mono">{stats.topSubjectCount}</strong> حصص احتياط
          </div>
        </div>

        {/* ذروة الغياب الأسبوعي */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold font-['Cairo']">يوم ذروة الغياب</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-indigo-700 font-['Cairo']">
              يوم {stats.peakDay}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            سجل <strong className="text-indigo-600 font-mono">{stats.peakDayCount}</strong> حصص احتياط
          </div>
        </div>
      </div>

      {/* 2. الرسم البياني الأول: معدلات الغياب والاحتياط اليومية عبر أيام الأسبوع */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                معدلات الغياب والاحتياط اليومية على أيام الأسبوع
              </h3>
              <p className="text-xs text-slate-500">
                مقارنة بين عدد حصص الاحتياط المطلوبة وعدد المعلمين المتغيبين والمكلفين فعلياً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-cyan-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
              حصص الاحتياط
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              المعلمون المتغيبون
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              المكلفون الفعليون
            </span>
          </div>
        </div>

        {/* مساحة الرسم البياني التفاعلي Recharts */}
        <div className="h-72 w-full pt-2" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyAbsenceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="حصص الاحتياط"
                stroke="#0891b2"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSubs)"
              />
              <Area
                type="monotone"
                dataKey="المعلمون المتغيبون"
                stroke="#e11d48"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorAbsent)"
              />
              <Area
                type="monotone"
                dataKey="المكلفون الفعليون"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConfirmed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. شبكة الرسوم البيانية: توزيع الاحتياط حسب المواد (أعمدة + دائري) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* مخطط الأعمدة: توزيع الاحتياط حسب المواد (ثلثا المساحة) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                  توزيع الاحتياط حسب المواد الدراسية
                </h3>
                <p className="text-xs text-slate-500">
                  عدد حصص الاحتياط المسجلة لكل مادة ونسبة احتياط معلمي نفس المادة
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200 font-bold">
              {subjectDistributionData.length} مواد مسجلة
            </span>
          </div>

          <div className="h-72 w-full pt-2" dir="ltr">
            {subjectDistributionData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <BookOpen className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs">لا توجد بيانات احتياط مسجلة حتى الآن</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectDistributionData.slice(0, 8)}
                  margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    tick={{ fill: '#475569', fontSize: 11 }}
                  />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="إجمالي الاحتياط" fill="#4f46e5" radius={[8, 8, 0, 0]}>
                    {subjectDistributionData.slice(0, 8).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* المخطط الدائري المجوف (Donut Chart) للنسب المئوية (ثلث المساحة) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-pink-600" />
              <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                النسبة المئوية للمواد
              </h3>
            </div>
            <span className="text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200 font-bold">
              أعلى المواد
            </span>
          </div>

          <div className="h-52 w-full relative" dir="ltr">
            {pieSubjectData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                لا توجد بيانات
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieSubjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieSubjectData.map((_, index) => (
                      <Cell
                        key={`cell-pie-${index}`}
                        fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* وسيلة إيضاح المواد (Legend) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {pieSubjectData.map((entry, index) => {
              const color = SUBJECT_COLORS[index % SUBJECT_COLORS.length];
              const pct = stats.totalSubs > 0 ? Math.round((entry.value / stats.totalSubs) * 100) : 0;
              return (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-slate-700 truncate text-[11px] font-medium">{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-500 font-mono text-[11px] shrink-0">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. قسم إضافي: توزيع الاحتياط حسب الحصص وقائمة المعلمين الأكثر تكليفاً */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* توزيع الاحتياط حسب الحصص الدراسية (1 إلى 8) */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                  كثافة الاحتياط حسب فترات الحصص (1 - 8)
                </h3>
                <p className="text-xs text-slate-500">
                  تحديد الحصص التي تشهد أعلى معدلات غياب في المدرسة
                </p>
              </div>
            </div>
          </div>

          <div className="h-60 w-full pt-1" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodDistributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="حصص الاحتياط" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* بطاقة المعلمين الأكثر تكليفاً بالاحتياط والتقرير السريع */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                    المعلمون الأكثر تكليفاً بالاحتياط
                  </h3>
                  <p className="text-xs text-slate-500">
                    متابعة عدالة توزيع حصص الاحتياط على الكادر التعليمي
                  </p>
                </div>
              </div>

              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                عدالة التكليف
              </span>
            </div>

            {topSubstituteTeachers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                لا توجد تكليفات احتياط مسجلة حتى الآن
              </div>
            ) : (
              <div className="space-y-2.5">
                {topSubstituteTeachers.map((item, idx) => {
                  const maxCount = topSubstituteTeachers[0]?.count || 1;
                  const percent = Math.round((item.count / maxCount) * 100);

                  return (
                    <div
                      key={item.name}
                      className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {item.name}
                          </span>
                          {/* شريط التقدم المرئي */}
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="text-sm font-black text-emerald-700 font-mono">
                          {item.count}
                        </span>
                        <span className="text-[10px] text-slate-400 block">حصص</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-600" />
              تحديث الإحصائيات فوري مع كل تسجيل جديد
            </span>
            <span className="font-bold text-indigo-600">Recharts v2+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
