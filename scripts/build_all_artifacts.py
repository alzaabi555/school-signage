# Build all timetable files and Excel export
import json
import subprocess
from scripts.teachers_chunk1 import get_chunk1
from scripts.teachers_chunk2 import get_chunk2
from scripts.teachers_chunk3 import get_chunk3
from scripts.teachers_chunk4 import get_chunk4

all_lessons = get_chunk1() + get_chunk2() + get_chunk3() + get_chunk4()

# Group teachers by subject
teachers_by_subject = {}
teacher_stats = {}

# Map each teacher to their primary subject
for item in all_lessons:
    t = item['teacher']
    s = item['subject']
    c = item['gradeClass']
    
    if s not in teachers_by_subject:
        teachers_by_subject[s] = []
    if t not in teachers_by_subject[s]:
        teachers_by_subject[s].append(t)
        
    if t not in teacher_stats:
        teacher_stats[t] = {
            'teacher': t,
            'subject': s,
            'totalLessons': 0,
            'classes': set(),
            'daysActive': set()
        }
    teacher_stats[t]['totalLessons'] += 1
    teacher_stats[t]['classes'].add(c)
    teacher_stats[t]['daysActive'].add(item['day'])

# Convert sets to sorted lists
for t, st in teacher_stats.items():
    st['classes'] = sorted(list(st['classes']))
    st['daysActive'] = sorted(list(st['daysActive']))

# Give every lesson a unique ID
for idx, lesson in enumerate(all_lessons):
    lesson['id'] = f"tt-official-{idx + 1}"

# Save JSON intermediate for Node to generate Excel
with open('scripts/all_lessons.json', 'w', encoding='utf-8') as f:
    json.dump({
        'lessons': all_lessons,
        'teachersBySubject': teachers_by_subject,
        'teacherStats': teacher_stats
    }, f, ensure_ascii=False, indent=2)

print(f"Saved {len(all_lessons)} lessons to all_lessons.json")

# Generate src/data/officialTimetableData.ts
ts_content = f"""// جدول المدرسة العام المعتمد لجميع المعلمين (69 معلماً) والصفوف الـ 32
// مستخرج ومعتمد بالكامل من الجدول النهائي الرسمي لتوزيع المعلمين وحصصهم وفصولهم
import {{ ClassScheduleItem }} from '../types';

export const OFFICIAL_TEACHERS_BY_SUBJECT: Record<string, string[]> = {json.dumps(teachers_by_subject, ensure_ascii=False, indent=2)};

export const OFFICIAL_SUBJECTS_LIST: string[] = Object.keys(OFFICIAL_TEACHERS_BY_SUBJECT);

export const OFFICIAL_CLASSES_LIST: string[] = [
  '5/1', '5/2', '5/3', '5/4', '5/5', '5/6', '5/7', '5/8',
  '6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7', '6/8', '6/9',
  '7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7', '7/8',
  '8/1', '8/2', '8/3', '8/4', '8/5', '8/6', '8/7'
];

export const OFFICIAL_CLASSES_32: string[] = OFFICIAL_CLASSES_LIST;

export const OFFICIAL_TEACHERS_LIST: string[] = Object.values(OFFICIAL_TEACHERS_BY_SUBJECT).flat();

export const OFFICIAL_TIMETABLE_ITEMS: ClassScheduleItem[] = {json.dumps(all_lessons, ensure_ascii=False, indent=2)};
"""

with open('src/data/officialTimetableData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Generated src/data/officialTimetableData.ts successfully!")
