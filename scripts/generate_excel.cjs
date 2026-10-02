const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_lessons.json'), 'utf-8'));
const lessons = raw.lessons;
const teachersBySubject = raw.teachersBySubject;
const teacherStats = raw.teacherStats;

const wb = xlsx.utils.book_new();

// 1. ورقة الجدول العام المعتمد
const scheduleRows = lessons.map((item, idx) => ({
  'م': idx + 1,
  'المعلم': item.teacher,
  'المادة الدراسية': item.subject,
  'اليوم': item.day,
  'الحصة': `الحصة ${item.period}`,
  'الصف / الفصل': item.gradeClass,
  'القاعة الدراسية': item.room
}));

const wsSchedule = xlsx.utils.json_to_sheet(scheduleRows);
wsSchedule['!cols'] = [
  { wch: 6 },
  { wch: 26 },
  { wch: 22 },
  { wch: 14 },
  { wch: 14 },
  { wch: 16 },
  { wch: 16 },
];
xlsx.utils.book_append_sheet(wb, wsSchedule, 'الجدول العام المعتمد');

// 2. ورقة دليل المعلمين وتوزيع المواد
const teachersListRows = [];
Object.entries(teachersBySubject).forEach(([subject, teachers]) => {
  teachers.forEach((teacher, idx) => {
    const st = teacherStats[teacher] || {};
    teachersListRows.push({
      'المادة الدراسية': subject,
      'م المعلم': idx + 1,
      'اسم المعلم': teacher,
      'إجمالي الحصص الأسبوعية': st.totalLessons || 0,
      'الفصول المسندة': (st.classes || []).join('، '),
      'أيام التدريس': (st.daysActive || []).join('، ')
    });
  });
});

const wsTeachers = xlsx.utils.json_to_sheet(teachersListRows);
wsTeachers['!cols'] = [
  { wch: 24 },
  { wch: 8 },
  { wch: 26 },
  { wch: 20 },
  { wch: 30 },
  { wch: 35 }
];
xlsx.utils.book_append_sheet(wb, wsTeachers, 'دليل المعلمين والمواد');

// 3. ورقة توزيع الفصول (32 فصلاً)
const CLASSES_32 = [
  '5/1', '5/2', '5/3', '5/4', '5/5', '5/6', '5/7', '5/8',
  '6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7', '6/8', '6/9',
  '7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7', '7/8',
  '8/1', '8/2', '8/3', '8/4', '8/5', '8/6', '8/7'
];

const classSummaryRows = CLASSES_32.map((c, idx) => {
  const cLessons = lessons.filter(l => l.gradeClass === c);
  const subjectsMap = {};
  cLessons.forEach(l => {
    subjectsMap[l.subject] = (subjectsMap[l.subject] || 0) + 1;
  });
  const subStr = Object.entries(subjectsMap).map(([s, cnt]) => `${s} (${cnt})`).join('، ');
  return {
    'م': idx + 1,
    'الصف / الفصل': c,
    'إجمالي الحصص': cLessons.length,
    'المواد المسجلة وحصصها': subStr
  };
});

const wsClasses = xlsx.utils.json_to_sheet(classSummaryRows);
wsClasses['!cols'] = [
  { wch: 6 },
  { wch: 16 },
  { wch: 14 },
  { wch: 60 }
];
xlsx.utils.book_append_sheet(wb, wsClasses, 'توزيع فصول المدرسة');

const outPath = path.join(__dirname, '..', 'public', 'جدول_المدرسة_العام_المعتمد.xlsx');
xlsx.writeFile(wb, outPath);

console.log(`Successfully written Excel file to ${outPath}`);
