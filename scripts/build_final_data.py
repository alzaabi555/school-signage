# Python script to compile the complete and verified 69 teachers timetable
import json
import os
import re

# We will build all teacher schedules directly from the 52 pages of the PDF

teachers_data = []

def add_lessons(teacher, subject_default, lessons_list):
    """
    lessons_list is list of tuples: (day, period_or_periods, grade_class, optional_subject)
    day: str e.g. "الأحد"
    period_or_periods: int or tuple/list e.g. 4 or (7, 8)
    grade_class: str e.g. "7/3"
    optional_subject: str or None
    """
    for item in lessons_list:
        day = item[0]
        periods = item[1] if isinstance(item[1], (list, tuple)) else [item[1]]
        grade_class = item[2]
        subj = item[3] if len(item) > 3 and item[3] else subject_default
        for p in periods:
            teachers_data.append({
                "teacher": teacher,
                "subject": subj,
                "day": day,
                "period": p,
                "periodId": f"p{p}",
                "gradeClass": grade_class,
                "room": f"قاعة {grade_class}"
            })

print("Helper defined")
