import React, { useState } from 'react';
import { SchoolSettings } from '../../types';
import { testFirestoreConnection } from '../../services/firebase';
import {
  Database,
  Copy,
  Check,
  ExternalLink,
  Wifi,
  Sparkles,
  Layers,
  Monitor,
  Smartphone,
  Globe,
  Tv,
  HelpCircle,
  Lock,
  KeyRound,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface IntegrationGuideTabProps {
  settings: SchoolSettings;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onTestConnection: () => Promise<boolean>;
  onForceSync: () => Promise<void>;
  onUploadAllToFirebase?: () => Promise<{ success: boolean; message: string }>;
  isTesting: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
}

export const IntegrationGuideTab: React.FC<IntegrationGuideTabProps> = ({
  settings,
  onUpdateSettings,
  onTestConnection,
  onForceSync,
  onUploadAllToFirebase,
  isTesting,
  isSyncing,
  lastSyncTime,
}) => {
  const [gasUrl, setGasUrl] = useState(settings.gasUrl || '');
  const [adminPinInput, setAdminPinInput] = useState(settings.adminPin || '1234');
  const [pinSavedFeedback, setPinSavedFeedback] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeGuideSection, setActiveGuideSection] = useState<'sheets' | 'apps_script' | 'kiosk' | 'hosting'>('apps_script');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingFirestore, setIsTestingFirestore] = useState(false);
  const [isUploadingToFirebase, setIsUploadingToFirebase] = useState(false);
  const [firestoreTestResult, setFirestoreTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestFirestore = async () => {
    setIsTestingFirestore(true);
    setFirestoreTestResult(null);
    try {
      const ok = await testFirestoreConnection();
      if (ok) {
        setFirestoreTestResult({
          success: true,
          message: 'تم فحص الاتصال بـ Firebase Firestore بنجاح! قاعدة البيانات السحابية مهيأة ومتصلة لحظياً.',
        });
      } else {
        setFirestoreTestResult({
          success: false,
          message: 'تعذر الاتصال بـ Firebase. تأكد من اتصال الإنترنت.',
        });
      }
    } catch (err) {
      setFirestoreTestResult({
        success: false,
        message: `خطأ في اتصال Firebase: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setIsTestingFirestore(false);
    }
  };

  const handleTriggerUploadAll = async () => {
    if (!onUploadAllToFirebase) return;
    setIsUploadingToFirebase(true);
    setFirestoreTestResult(null);
    try {
      const res = await onUploadAllToFirebase();
      setFirestoreTestResult({
        success: res.success,
        message: res.message,
      });
    } catch (err) {
      setFirestoreTestResult({
        success: false,
        message: `حدث خطأ أثناء الرفع: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setIsUploadingToFirebase(false);
    }
  };

  const googleAppsScriptCode = `/**
 * كود Google Apps Script النهائي المعتمد لنظام الشاشات الذكية المدرسية
 * مدرسة الإبداع للتعليم الأساسي (5 - 9) للبنين
 * قم بنسخ هذا الكود بالكامل ولصقه في Extensions > Apps Script في جدول Google Sheets
 */

const SHEET_NAMES = {
  SUBSTITUTIONS: 'الاحتياط_اليومي',
  DUTY: 'المناوبة_اليومية',
  DAY_SUBJECT_DUTIES: 'مناوبة_المواد_الأسبوعية',
  TIMETABLE: 'الجدول_الدراسي',
  PERIODS: 'أوقات_الحصص',
  ANNOUNCEMENTS: 'الإعلانات_المدرسية',
  TEACHERS: 'دليل_المعلمين'
};

/**
 * دالة التهيئة الأولية: تنشئ جميع الأوراق وتنسق الأعمدة وتملأ البيانات الأساسية بنقرة واحدة
 * لتشغيلها: اختر دالة setupSchoolSpreadsheet من القائمة العلوية واضغط زر تشغيل (Run)
 */
function setupSchoolSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. ورقة الاحتياط اليومي
  let subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
  if (!subSheet) {
    subSheet = ss.insertSheet(SHEET_NAMES.SUBSTITUTIONS);
    subSheet.appendRow(['المعرف', 'التاريخ', 'اليوم', 'الحصة', 'الصف', 'المعلم_الغائب', 'المعلم_البديل', 'المادة', 'الحالة', 'ملاحظات', 'وقت_التحديث']);
    subSheet.getRange(1, 1, 1, 11).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 2. ورقة المناوبة اليومية
  let dutySheet = ss.getSheetByName(SHEET_NAMES.DUTY);
  if (!dutySheet) {
    dutySheet = ss.insertSheet(SHEET_NAMES.DUTY);
    dutySheet.appendRow(['المعرف', 'اليوم', 'الموقع_والمهمة', 'المشرف_الرئيسي', 'المعاونون', 'وقت_المناوبة', 'المادة_أو_القسم', 'ملاحظات']);
    dutySheet.getRange(1, 1, 1, 8).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 3. ورقة مناوبة المواد الأسبوعية ورؤساء الأقسام
  let dayDutiesSheet = ss.getSheetByName(SHEET_NAMES.DAY_SUBJECT_DUTIES);
  if (!dayDutiesSheet) {
    dayDutiesSheet = ss.insertSheet(SHEET_NAMES.DAY_SUBJECT_DUTIES);
    dayDutiesSheet.appendRow(['اليوم', 'المادة_المناوبة', 'المعلم_الأول_رئيس_القسم', 'ملاحظات']);
    dayDutiesSheet.getRange(1, 1, 1, 4).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
    
    // إضافة البيانات المعتمدة لأيام الأسبوع
    const defaultDays = [
      ['الأحد', 'التربية الإسلامية واللغة العربية', 'أ. سالم الهنائي', 'الإشراف العام وتوزيع المواقع'],
      ['الاثنين', 'الرياضيات', 'أ. سعيد الفزاري', 'متابعة الاصطفاف والانصراف'],
      ['الثلاثاء', 'العلوم', 'أ. وفاء السعيدي', 'تنظيم الفسح والمصلى'],
      ['الأربعاء', 'اللغة الإنجليزية والدراسات الاجتماعية', 'أ. ناجي اسماعيل', 'متابعة هدوء الأدوار'],
      ['الخميس', 'المهارات الرقمية والتربية الرياضية والفنية', 'أ. خالد المعمري', 'إشراف نهاية الأسبوع والانصراف']
    ];
    dayDutiesSheet.getRange(2, 1, defaultDays.length, 4).setValues(defaultDays);
  }

  // 4. ورقة مواعيد الحصص
  let periodSheet = ss.getSheetByName(SHEET_NAMES.PERIODS);
  if (!periodSheet) {
    periodSheet = ss.insertSheet(SHEET_NAMES.PERIODS);
    periodSheet.appendRow(['المعرف', 'اسم_الفترة', 'وقت_البدء', 'وقت_الانتهاء', 'هل_هي_فسحة', 'الترتيب']);
    periodSheet.getRange(1, 1, 1, 6).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');

    const defaultPeriods = [
      ['p0', 'طابور الصباح', '07:10', '07:25', 'نعم', 0],
      ['p1', 'الحصة الأولى', '07:25', '08:05', 'لا', 1],
      ['p2', 'الحصة الثانية', '08:10', '08:50', 'لا', 2],
      ['p3', 'الحصة الثالثة', '08:55', '09:35', 'لا', 3],
      ['p4', 'الحصة الرابعة', '09:40', '10:20', 'لا', 4],
      ['b1', 'الفسحة', '10:20', '10:45', 'نعم', 5],
      ['p5', 'الحصة الخامسة', '10:45', '11:25', 'لا', 6],
      ['p6', 'الحصة السادسة', '11:30', '12:10', 'لا', 7],
      ['p7', 'الحصة السابعة', '12:15', '12:55', 'لا', 8],
      ['p8', 'الحصة الثامنة', '13:00', '13:40', 'لا', 9]
    ];
    periodSheet.getRange(2, 1, defaultPeriods.length, 6).setValues(defaultPeriods);
  }

  // 5. ورقة الإعلانات
  let annSheet = ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS);
  if (!annSheet) {
    annSheet = ss.insertSheet(SHEET_NAMES.ANNOUNCEMENTS);
    annSheet.appendRow(['المعرف', 'نص_الإعلان', 'النوع', 'نشط', 'تاريخ_الإنشاء']);
    annSheet.getRange(1, 1, 1, 5).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');

    annSheet.appendRow([
      'ANN-001',
      'أهلاً بكم في مدرسة الإبداع للتعليم الأساسي (5 - 9) للبنين.. «طلب العلم فريضة»',
      'hadith',
      'نعم',
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')
    ]);
  }

  // 6. ورقة الجدول الدراسي
  let timeTableSheet = ss.getSheetByName(SHEET_NAMES.TIMETABLE);
  if (!timeTableSheet) {
    timeTableSheet = ss.insertSheet(SHEET_NAMES.TIMETABLE);
    timeTableSheet.appendRow(['المعرف', 'اليوم', 'معرف_الحصة', 'الصف', 'المادة', 'المعلم', 'القاعة']);
    timeTableSheet.getRange(1, 1, 1, 7).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
  }
}

/**
 * معالج طلبات GET: لقراءة البيانات الحية والمزامنة التلقائية مع الشاشات وهواتف المعلمين
 */
function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action;
    if (action === 'ping') {
      return createJsonResponse({ status: 'success', message: 'pong', timestamp: new Date().toISOString() });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // قراءة وتنسيق مناوبة المواد اليومية
    const dayDutiesSheet = ss.getSheetByName(SHEET_NAMES.DAY_SUBJECT_DUTIES);
    const daySubjectDuties = {};
    if (dayDutiesSheet) {
      const dayRows = getSheetDataAsObjects(dayDutiesSheet);
      dayRows.forEach(function(r) {
        const day = r['اليوم'] || r['day'];
        if (day) {
          daySubjectDuties[day] = {
            subject: r['المادة_المناوبة'] || r['subject'] || '',
            departmentLead: r['المعلم_الأول_رئيس_القسم'] || r['departmentLead'] || '',
            notes: r['ملاحظات'] || r['notes'] || ''
          };
        }
      });
    }

    const teachersSheet = ss.getSheetByName(SHEET_NAMES.TEACHERS) || 
                          ss.getSheetByName('دليل_المعلمين') || 
                          ss.getSheetByName('قائمة_المعلمين') || 
                          ss.getSheetByName('معلمي_المواد');

    const payload = {
      status: 'success',
      timestamp: new Date().toISOString(),
      schoolName: 'مدرسة الإبداع للتعليم الأساسي (5 - 9) للبنين',
      substitutions: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS)),
      duties: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.DUTY)),
      daySubjectDuties: daySubjectDuties,
      periods: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.PERIODS)),
      announcements: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS)),
      timetable: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.TIMETABLE)),
      teachers: teachersSheet ? getSheetDataAsObjects(teachersSheet) : []
    };
    return createJsonResponse(payload);
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * معالج طلبات POST: لحفظ التعديلات والتحديثات من لوحة تحكم المشرفين
 */
function doPost(e) {
  try {
    var requestData = {};
    if (e.postData && e.postData.contents) {
      try {
        requestData = JSON.parse(e.postData.contents);
      } catch (err) {
        requestData = e.parameter || {};
      }
    } else {
      requestData = e.parameter || {};
    }

    const action = requestData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. إضافة أو تعديل حصة احتياط
    if (action === 'add_substitution') {
      const subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
      const item = requestData.data || requestData;
      const targetId = item.id || ('SUB-' + new Date().getTime().toString().slice(-6));
      const rows = subSheet.getDataRange().getValues();
      let updatedIndex = -1;

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(targetId)) {
          updatedIndex = i + 1;
          break;
        }
      }

      const rowData = [
        targetId,
        item.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        item.day || '',
        item.period || '',
        item.gradeClass || '',
        item.absentTeacher || '',
        item.substituteTeacher || '',
        item.subject || '',
        item.status || 'مؤكد',
        item.notes || '',
        new Date().toISOString()
      ];

      if (updatedIndex > 0) {
        subSheet.getRange(updatedIndex, 1, 1, rowData.length).setValues([rowData]);
      } else {
        subSheet.appendRow(rowData);
      }

      return createJsonResponse({ status: 'success', message: 'تم حفظ الاحتياط في Google Sheets بنجاح', id: targetId });
    }

    // 2. حذف سجل احتياط
    if (action === 'delete_substitution') {
      const subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
      if (subSheet) {
        const targetId = String((requestData.data && requestData.data.id) || requestData.id || '');
        const rows = subSheet.getDataRange().getValues();
        for (let i = rows.length - 1; i >= 1; i--) {
          if (String(rows[i][0]) === targetId) {
            subSheet.deleteRow(i + 1);
            break;
          }
        }
      }
      return createJsonResponse({ status: 'success', message: 'تم حذف السجل من Google Sheets' });
    }

    // 3. مسح جميع سجلات الاحتياط
    if (action === 'clear_all_substitutions') {
      const subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
      if (subSheet) {
        const lastRow = subSheet.getLastRow();
        if (lastRow > 1) {
          subSheet.deleteRows(2, lastRow - 1);
        }
      }
      return createJsonResponse({ status: 'success', message: 'تم مسح كافة سجلات الاحتياط من Google Sheets' });
    }

    // 4. تحديث أو إضافة موقع مناوبة
    if (action === 'update_duty') {
      const dutySheet = ss.getSheetByName(SHEET_NAMES.DUTY);
      const item = requestData.data || requestData;
      const targetId = item.id || ('DUTY-' + new Date().getTime().toString().slice(-6));
      const rows = dutySheet.getDataRange().getValues();
      let updatedIndex = -1;

      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(targetId)) {
          updatedIndex = i + 1;
          break;
        }
      }

      const rowData = [
        targetId,
        item.day || 'الأحد',
        item.location || '',
        item.leadTeacher || '',
        item.assistants || '',
        item.timeSlot || '',
        item.subject || '',
        item.notes || ''
      ];

      if (updatedIndex > 0) {
        dutySheet.getRange(updatedIndex, 1, 1, rowData.length).setValues([rowData]);
      } else {
        dutySheet.appendRow(rowData);
      }

      return createJsonResponse({ status: 'success', message: 'تم تحديث المناوبة في Google Sheets' });
    }

    // 5. حذف موقع مناوبة
    if (action === 'delete_duty') {
      const dutySheet = ss.getSheetByName(SHEET_NAMES.DUTY);
      if (dutySheet) {
        const targetId = String((requestData.data && requestData.data.id) || requestData.id || '');
        const rows = dutySheet.getDataRange().getValues();
        for (let i = rows.length - 1; i >= 1; i--) {
          if (String(rows[i][0]) === targetId) {
            dutySheet.deleteRow(i + 1);
            break;
          }
        }
      }
      return createJsonResponse({ status: 'success', message: 'تم حذف المناوبة من Google Sheets' });
    }

    // 6. مسح جميع المناوبات
    if (action === 'clear_all_duties') {
      const dutySheet = ss.getSheetByName(SHEET_NAMES.DUTY);
      if (dutySheet) {
        const lastRow = dutySheet.getLastRow();
        if (lastRow > 1) dutySheet.deleteRows(2, lastRow - 1);
      }
      return createJsonResponse({ status: 'success', message: 'تم مسح المناوبات من Google Sheets' });
    }

    // 7. تحديث مادة ومناوبة اليوم ورئيس القسم
    if (action === 'update_day_subject_duty') {
      const daySheet = ss.getSheetByName(SHEET_NAMES.DAY_SUBJECT_DUTIES);
      const item = requestData.data || requestData;
      if (daySheet && item.day) {
        const rows = daySheet.getDataRange().getValues();
        let found = false;
        for (let i = 1; i < rows.length; i++) {
          if (String(rows[i][0]) === String(item.day)) {
            daySheet.getRange(i + 1, 2).setValue(item.subject || '');
            daySheet.getRange(i + 1, 3).setValue(item.departmentLead || '');
            daySheet.getRange(i + 1, 4).setValue(item.notes || '');
            found = true;
            break;
          }
        }
        if (!found) {
          daySheet.appendRow([item.day, item.subject || '', item.departmentLead || '', item.notes || '']);
        }
      }
      return createJsonResponse({ status: 'success', message: 'تم تحديث مادة اليوم ورئيس القسم' });
    }

    // 8. إضافة إعلان
    if (action === 'add_announcement') {
      const annSheet = ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS);
      const item = requestData.data || requestData;
      const targetId = item.id || ('ANN-' + new Date().getTime().toString().slice(-6));
      annSheet.appendRow([
        targetId,
        item.text || '',
        item.type || 'info',
        item.active ? 'نعم' : 'لا',
        item.createdAt || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')
      ]);
      return createJsonResponse({ status: 'success', message: 'تم نشر الإعلان في Google Sheets' });
    }

    // 9. حذف إعلان
    if (action === 'delete_announcement') {
      const annSheet = ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS);
      if (annSheet) {
        const targetId = String((requestData.data && requestData.data.id) || requestData.id || '');
        const rows = annSheet.getDataRange().getValues();
        for (let i = rows.length - 1; i >= 1; i--) {
          if (String(rows[i][0]) === targetId) {
            annSheet.deleteRow(i + 1);
            break;
          }
        }
      }
      return createJsonResponse({ status: 'success', message: 'تم حذف الإعلان' });
    }

    // 10. تفعيل / تعطيل إعلان
    if (action === 'toggle_announcement') {
      const annSheet = ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS);
      const item = requestData.data || requestData;
      if (annSheet && item.id) {
        const rows = annSheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
          if (String(rows[i][0]) === String(item.id)) {
            annSheet.getRange(i + 1, 4).setValue(item.active ? 'نعم' : 'لا');
            break;
          }
        }
      }
      return createJsonResponse({ status: 'success', message: 'تم تعديل حالة الإعلان' });
    }

    // 11. تحديث جدول الـ 32 فصلاً بالكامل (Bulk Timetable Update - الاستبدال السحابي الآمن)
    if (action === 'bulk_update_timetable') {
      const timeTableSheet = ss.getSheetByName(SHEET_NAMES.TIMETABLE);
      if (!timeTableSheet) throw new Error('ورقة الجدول الدراسي غير موجودة');

      const items = requestData.data || requestData.timetable || [];
      if (!Array.isArray(items) || items.length === 0) {
        return createJsonResponse({ status: 'error', success: false, message: 'بيانات الجدول المستوردة فارغة' });
      }

      const validPeriodIds = { 'p1': true, 'p2': true, 'p3': true, 'p4': true, 'p5': true, 'p6': true, 'p7': true, 'p8': true };
      const rows = [];
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const periodId = String(it.periodId || '').trim().toLowerCase();
        if (!validPeriodIds[periodId]) {
          return createJsonResponse({ status: 'error', success: false, message: 'معرف حصة غير صالح بالسجل ' + (i + 1) + ' (' + periodId + ')' });
        }
        if (!it.day || !it.gradeClass || !it.teacher || !it.subject) {
          return createJsonResponse({ status: 'error', success: false, message: 'حقول ناقصة بالسجل ' + (i + 1) });
        }
        rows.push([
          it.id || ('TT-' + Utilities.getUuid().slice(0, 8)),
          String(it.day).trim(),
          periodId,
          String(it.gradeClass).trim(),
          String(it.subject).trim(),
          String(it.teacher).trim(),
          String(it.room || ('قاعة ' + it.gradeClass)).trim()
        ]);
      }

      // حذف الصفوف القديمة أسفل العناوين فقط بعد نجاح التحقق بالكامل
      const lastRow = timeTableSheet.getLastRow();
      if (lastRow > 1) timeTableSheet.deleteRows(2, lastRow - 1);

      // كتابة الصفوف الجديدة وعمل flush
      timeTableSheet.getRange(2, 1, rows.length, 7).setValues(rows);
      SpreadsheetApp.flush();

      return createJsonResponse({
        status: 'success',
        success: true,
        count: rows.length,
        operation: 'replace',
        message: 'تم استبدال الجدول بالكامل'
      });
    }

    // 12. تحديث مواقيت الحصص والفسحة وطابور الصباح
    if (action === 'update_periods' || action === 'bulk_update_periods') {
      const periodsSheet = ss.getSheetByName(SHEET_NAMES.PERIODS);
      if (!periodsSheet) throw new Error('ورقة مواقيت الحصص غير موجودة');
      const items = requestData.data || requestData.periods || [];
      const lastRow = periodsSheet.getLastRow();
      if (lastRow > 1) periodsSheet.deleteRows(2, lastRow - 1);
      if (items.length > 0) {
        const rows = items.map(function(p, idx) {
          return [
            p.id || ('p' + idx),
            p.name || ('الفترة ' + (idx + 1)),
            p.startTime || '07:00',
            p.endTime || '07:45',
            p.isBreak ? 'نعم' : 'لا',
            p.order !== undefined ? p.order : idx
          ];
        });
        periodsSheet.getRange(2, 1, rows.length, 6).setValues(rows);
      }
      return createJsonResponse({ status: 'success', message: 'تم تحديث مواقيت الحصص في Google Sheets بنجاح', count: items.length });
    }

    // 13. حفظ وتحديث قائمة معلمي المواد بالكامل (دليل المعلمين والمتدربين)
    if (action === 'save_teachers' || action === 'bulk_update_teachers') {
      let teachersSheet = ss.getSheetByName(SHEET_NAMES.TEACHERS) || 
                          ss.getSheetByName('دليل_المعلمين') || 
                          ss.getSheetByName('قائمة_المعلمين') || 
                          ss.getSheetByName('معلمي_المواد');
      if (!teachersSheet) {
        teachersSheet = ss.insertSheet(SHEET_NAMES.TEACHERS);
        teachersSheet.appendRow(['المعرف', 'المعلم', 'المادة', 'نوع_المعلم', 'ملاحظات', 'تاريخ_التحديث']);
        teachersSheet.getRange(1, 1, 1, 6).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
      }

      const rawItems = requestData.data || requestData.teachers || [];
      const rows = [];
      if (Array.isArray(rawItems)) {
        for (let i = 0; i < rawItems.length; i++) {
          const it = rawItems[i];
          const tName = String(it.teacher || it.name || '').trim();
          if (tName) {
            rows.push([
              it.id || ('TCH-' + (i + 1)),
              tName,
              String(it.subject || '').trim(),
              String(it.type || (tName.includes('متدرب') ? 'معلم متدرب' : 'معلم أساسي')).trim(),
              String(it.notes || '').trim(),
              new Date().toISOString()
            ]);
          }
        }
      } else if (typeof rawItems === 'object') {
        let counter = 1;
        const subjs = Object.keys(rawItems);
        for (let s = 0; s < subjs.length; s++) {
          const subj = subjs[s];
          const list = rawItems[subj] || [];
          for (let t = 0; t < list.length; t++) {
            const tName = String(list[t] || '').trim();
            if (tName) {
              rows.push([
                'TCH-' + (counter++),
                tName,
                subj,
                tName.includes('متدرب') ? 'معلم متدرب' : 'معلم أساسي',
                '',
                new Date().toISOString()
              ]);
            }
          }
        }
      }

      const lastRow = teachersSheet.getLastRow();
      if (lastRow > 1) teachersSheet.deleteRows(2, lastRow - 1);
      if (rows.length > 0) {
        teachersSheet.getRange(2, 1, rows.length, 6).setValues(rows);
      }
      SpreadsheetApp.flush();
      return createJsonResponse({ status: 'success', success: true, count: rows.length, message: 'تم حفظ وتحديث دليل المعلمين في السحابة بنجاح' });
    }

    // 14. إضافة معلم جديد / متدرب فردياً للسحابة
    if (action === 'add_teacher') {
      let teachersSheet = ss.getSheetByName(SHEET_NAMES.TEACHERS) || 
                          ss.getSheetByName('دليل_المعلمين') || 
                          ss.getSheetByName('قائمة_المعلمين') || 
                          ss.getSheetByName('معلمي_المواد');
      if (!teachersSheet) {
        teachersSheet = ss.insertSheet(SHEET_NAMES.TEACHERS);
        teachersSheet.appendRow(['المعرف', 'المعلم', 'المادة', 'نوع_المعلم', 'ملاحظات', 'تاريخ_التحديث']);
        teachersSheet.getRange(1, 1, 1, 6).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
      }

      const item = requestData.data || requestData;
      const newId = item.id || ('TCH-' + new Date().getTime().toString().slice(-6));
      const tName = String(item.teacher || item.name || '').trim();
      const subj = String(item.subject || '').trim();
      const type = String(item.type || (tName.includes('متدرب') ? 'معلم متدرب' : 'معلم أساسي')).trim();
      const notes = String(item.notes || '').trim();
      teachersSheet.appendRow([newId, tName, subj, type, notes, new Date().toISOString()]);
      SpreadsheetApp.flush();
      return createJsonResponse({ status: 'success', success: true, message: 'تمت إضافة المعلم بنجاح إلى السحابة', id: newId });
    }

    return createJsonResponse({ status: 'success', message: 'تمت العملية بنجاح' });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

function getSheetDataAsObjects(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  const data = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = row[j];
      if (val instanceof Date) {
        const headerStr = String(headers[j] || '').toLowerCase();
        if (headerStr.includes('وقت') || headerStr.includes('time') || headerStr.includes('بدء') || headerStr.includes('انتهاء') || val.getFullYear() <= 1910) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'HH:mm');
        } else {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
        }
      }
      obj[headers[j]] = val;
    }
    data.push(obj);
  }
  return data;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSaveUrl = () => {
    onUpdateSettings({ ...settings, gasUrl: gasUrl.trim() });
    setTestResult({ success: true, message: 'تم حفظ الرابط في التطبيق' });
  };

  const handleSavePin = () => {
    const cleanPin = adminPinInput.trim();
    if (!cleanPin) return;
    onUpdateSettings({ ...settings, adminPin: cleanPin });
    setPinSavedFeedback(true);
    setTimeout(() => setPinSavedFeedback(false), 3000);
  };

  const handleRunTest = async () => {
    setTestResult(null);
    const ok = await onTestConnection();
    if (ok) {
      setTestResult({ success: true, message: 'الاتصال ناجح تماماً! تم استلام البيانات من Google Apps Script.' });
    } else {
      setTestResult({
        success: false,
        message: 'تعذر الاتصال. تأكد من نشر Web App بصلاحية Who has access: Anyone وأن الرابط ينتهي بـ /exec',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. قاعدة بيانات Firebase Firestore والمصادقة السحابية */}
      <div className="bg-gradient-to-br from-white to-orange-50/40 border border-orange-200/80 rounded-3xl p-5 md:p-7 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-orange-100 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-['Cairo']">
                  قاعدة بيانات Firebase السحابية (Firestore & Auth)
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  مفعل ومتصل
                </span>
              </div>
              <p className="text-xs text-slate-500">
                مزامنة فورية مشفرة لبيانات الاحتياط اليومي، المناوبة، الجداول والإعلانات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleTriggerUploadAll}
              disabled={isUploadingToFirebase}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
              title="رفع كافة الحصص والاحتياط والمناوبة الحالية إلى Firebase"
            >
              <Sparkles className={`w-4 h-4 ${isUploadingToFirebase ? 'animate-spin' : ''}`} />
              <span>{isUploadingToFirebase ? 'جارٍ رفع كافة البيانات...' : 'رفع ومزامنة كافة البيانات إلى Firebase الآن'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestFirestore}
              disabled={isTestingFirestore}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs transition border border-orange-200 disabled:opacity-50 cursor-pointer"
            >
              <Flame className={`w-4 h-4 ${isTestingFirestore ? 'animate-bounce' : 'text-orange-600'}`} />
              <span>{isTestingFirestore ? 'جارٍ فحص Firebase...' : 'فحص الاتصال'}</span>
            </button>

            <a
              href="https://console.firebase.google.com/project/gen-lang-client-0627927211/firestore/databases/ai-studio-schoolsignagekio-1ff6ab9a-4e8c-4af3-80f3-f05f53b6ebb9/data"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200"
            >
              <span>فتح لوحة تحكم Firebase</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-xs">
          <div className="bg-white/80 border border-orange-100 rounded-2xl p-3">
            <span className="text-[11px] text-slate-500 block mb-1">المشروع السحابي (Project ID):</span>
            <code className="text-slate-800 font-mono font-bold text-[11px]">gen-lang-client-0627927211</code>
          </div>
          <div className="bg-white/80 border border-orange-100 rounded-2xl p-3">
            <span className="text-[11px] text-slate-500 block mb-1">قاعدة البيانات (Database ID):</span>
            <span className="text-slate-800 font-mono text-[10px] break-all">ai-studio-schoolsignagekio-1ff6ab9a-4e8c-4af3-80f3-f05f53b6ebb9</span>
          </div>
          <div className="bg-white/80 border border-orange-100 rounded-2xl p-3">
            <span className="text-[11px] text-slate-500 block mb-1">منطقة الاستضافة:</span>
            <span className="text-emerald-700 font-bold">europe-west1 (Cloud Firestore)</span>
          </div>
        </div>

        <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-3.5 mb-3 text-xs text-slate-700 space-y-1.5">
          <p className="font-bold text-orange-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
            <span>كيف تعمل المزامنة وأين تجد بياناتك في Firebase Console؟</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pr-2">
            <li><strong>المزامنة اللحظية:</strong> أي إضافة أو تعديل أو حذف في حصص الاحتياط أو المناوبة أو الجدول يُحفظ <strong>تلقائياً ولحظياً</strong> في السحابة.</li>
            <li><strong>مجلدات ومجموعات البيانات (Collections) في Firestore:</strong></li>
            <ul className="list-none pr-4 space-y-0.5 text-[11px]">
              <li>📁 <code className="text-indigo-700 font-mono font-bold">substitutions</code> : سجلات حصص الاحتياط اليومي.</li>
              <li>📁 <code className="text-indigo-700 font-mono font-bold">timetable</code> : جدول الحصص الأسبوعي لجميع فصول المدرسة (32 فصلاً).</li>
              <li>📁 <code className="text-indigo-700 font-mono font-bold">duties</code> : سجلات المناوبة اليومية وتوزيع مواقع المعلمين.</li>
              <li>📁 <code className="text-indigo-700 font-mono font-bold">periods</code> : مواعيد الحصص والفسح اليومية.</li>
              <li>📁 <code className="text-indigo-700 font-mono font-bold">announcements</code> : الإعلانات وشريط الأخبار المتحرك.</li>
              <li>📁 <code className="text-indigo-700 font-mono font-bold">settings/main</code> : إعدادات المدرسة، الشاشة، ورمز PIN.</li>
            </ul>
          </ul>
        </div>

        {firestoreTestResult && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-semibold animate-fade-in flex items-center gap-2 ${
              firestoreTestResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {firestoreTestResult.success ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{firestoreTestResult.message}</span>
          </div>
        )}
      </div>

      {/* 1. إعداد رابط Google Apps Script واختبار الاتصال */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Cairo']">
              إعدادات الربط المباشر مع Google Sheets عبر Apps Script
            </h2>
            <p className="text-xs text-slate-500">
              اربط التطبيق بجدول بيانات مدرستك لتحديث الاحتياط والمناوبة تلقائياً وبشكل حي
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رابط تطبيق الويب (Google Apps Script Web App URL):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={gasUrl}
                onChange={(e) => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
              <button
                onClick={handleSaveUrl}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs"
              >
                حفظ الرابط
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              * احرص أن ينتهي الرابط بكلمة <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">/exec</code> وليس <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-mono">/edit</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleRunTest}
              disabled={isTesting || !gasUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition disabled:opacity-50"
            >
              <Wifi className={`w-4 h-4 text-emerald-600 ${isTesting ? 'animate-pulse' : ''}`} />
              <span>{isTesting ? 'جارٍ فحص الاتصال...' : 'اختبار الاتصال بالخادم'}</span>
            </button>

            <button
              onClick={onForceSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isSyncing ? 'جارٍ المزامنة...' : 'مزامنة فورية الآن'}</span>
            </button>

            {lastSyncTime && (
              <span className="text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
                آخر مزامنة: {lastSyncTime}
              </span>
            )}
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold animate-fade-in flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? <Check className="w-4 h-4 text-emerald-600" /> : <HelpCircle className="w-4 h-4 text-rose-600" />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. قسم قفل الأمان لمشرف النظام (PIN) لمنع التلاعب */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
              رمز أمان قفل لوحة الإدارة والإعدادات (PIN)
            </h3>
            <p className="text-xs text-slate-500">
              حماية لوحة الإدارة والإعدادات لمنع أي شخص لديه رابط الموقع من الدخول أو التلاعب بالجداول
            </p>
          </div>
        </div>

        <div className="max-w-md space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رمز الأمان المعتمد (PIN):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                placeholder="1234"
                maxLength={10}
                className="w-44 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-center font-mono font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={handleSavePin}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>حفظ رمز الأمان الجديد</span>
              </button>
            </div>
            {pinSavedFeedback && (
              <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تم تحديث وحفظ رمز الأمان بنجاح! تم تفعيل الحماية فوراً.</span>
              </p>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              * الرمز الافتراضي للنظام هو <code className="bg-slate-100 text-slate-800 font-mono px-1 rounded">1234</code>. لن يتمكن أحد من فتح لوحة الإدارة في شاشة العرض أو الهاتف إلا بعد إدخال هذا الرمز.
            </p>
          </div>
        </div>
      </div>

      {/* 2. أزرار التنقل بين أدلة الشرح البرمجية */}
      <div className="flex overflow-x-auto gap-2">
        <button
          onClick={() => setActiveGuideSection('apps_script')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition ${
            activeGuideSection === 'apps_script'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>كود Google Apps Script الكامل</span>
        </button>

        <button
          onClick={() => setActiveGuideSection('sheets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition ${
            activeGuideSection === 'sheets'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>هيكل أوراق وأعمدة Google Sheets</span>
        </button>

        <button
          onClick={() => setActiveGuideSection('kiosk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition ${
            activeGuideSection === 'kiosk'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>طريقة تشغيل وضع ملء الشاشة (Kiosk) على التلفاز</span>
        </button>

        <button
          onClick={() => setActiveGuideSection('hosting')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition ${
            activeGuideSection === 'hosting'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>النشر المجاني (Vercel / Netlify / GitHub)</span>
        </button>
      </div>

      {/* قسم 1: كود Apps Script */}
      {activeGuideSection === 'apps_script' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                ملف Code.gs جاهز بالكامل ومعالج لطلبات CORS و JSON
              </h3>
              <p className="text-xs text-slate-500">
                انسخ الكود بالكامل، ثم الصقه في محرر سكريبت Google Sheets واضغط "نشر تطبيق ويب".
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'تم نسخ الكود!' : 'نسخ الكود بالكامل'}</span>
            </button>
          </div>

          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden">
            <pre className="text-[11px] font-mono text-slate-200 overflow-x-auto max-h-96 pr-2 scrollbar-thin">
              {googleAppsScriptCode}
            </pre>
          </div>
        </div>
      )}

      {/* قسم 2: هيكل Google Sheets */}
      {activeGuideSection === 'sheets' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Cairo'] mb-1">
              هيكل أوراق العمل والأعمدة المعتمدة في ملف Google Sheets
            </h3>
            <p className="text-xs text-slate-500">
              الدالة <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">setupSchoolSpreadsheet()</code> في Apps Script تنشئ هذه الأوراق والأعمدة تلقائياً بنقرة واحدة!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ورقة الاحتياط */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-amber-700 block mb-2">1. ورقة: الاحتياط_اليومي</span>
              <ul className="text-xs text-slate-600 space-y-1 font-mono">
                <li>• المعرف (SUB-xxxxxx)</li>
                <li>• التاريخ (YYYY-MM-DD)</li>
                <li>• اليوم (الأحد - الخميس)</li>
                <li>• الحصة</li>
                <li>• الصف</li>
                <li>• المعلم_الغائب</li>
                <li>• المعلم_البديل</li>
                <li>• المادة</li>
                <li>• الحالة (مؤكد / تم الحضور / ...)</li>
                <li>• ملاحظات</li>
                <li>• وقت_التحديث</li>
              </ul>
            </div>

            {/* ورقة المناوبة */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-cyan-700 block mb-2">2. ورقة: المناوبة_اليومية</span>
              <ul className="text-xs text-slate-600 space-y-1 font-mono">
                <li>• المعرف (DUTY-xxxxxx)</li>
                <li>• اليوم (الأحد - الخميس)</li>
                <li>• الموقع_والمهمة</li>
                <li>• المشرف_الرئيسي</li>
                <li>• المعاونون</li>
                <li>• وقت_المناوبة</li>
                <li>• المادة_أو_القسم</li>
                <li>• ملاحظات</li>
              </ul>
            </div>

            {/* ورقة مناوبة المواد ورؤساء الأقسام */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-purple-700 block mb-2">3. ورقة: مناوبة_المواد_الأسبوعية</span>
              <ul className="text-xs text-slate-600 space-y-1 font-mono">
                <li>• اليوم (الأحد - الخميس)</li>
                <li>• المادة_المناوبة</li>
                <li>• المعلم_الأول_رئيس_القسم</li>
                <li>• ملاحظات</li>
              </ul>
            </div>

            {/* ورقة الحصص */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-indigo-700 block mb-2">4. ورقة: أوقات_الحصص</span>
              <ul className="text-xs text-slate-600 space-y-1 font-mono">
                <li>• المعرف (p1, p2, b1...)</li>
                <li>• اسم_الفترة</li>
                <li>• وقت_البدء (HH:mm)</li>
                <li>• وقت_الانتهاء (HH:mm)</li>
                <li>• هل_هي_فسحة (نعم / لا)</li>
                <li>• الترتيب</li>
              </ul>
            </div>

            {/* ورقة الإعلانات */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-rose-700 block mb-2">5. ورقة: الإعلانات_المدرسية</span>
              <ul className="text-xs text-slate-600 space-y-1 font-mono">
                <li>• المعرف (ANN-xxxxxx)</li>
                <li>• نص_الإعلان</li>
                <li>• النوع (info / urgent / hadith)</li>
                <li>• نشط (نعم / لا)</li>
                <li>• تاريخ_الإنشاء</li>
              </ul>
            </div>

            {/* ورقة الجدول */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-emerald-700 block mb-2">6. ورقة: الجدول_الدراسي</span>
              <ul className="text-xs text-slate-600 space-y-1 font-mono">
                <li>• المعرف</li>
                <li>• اليوم</li>
                <li>• معرف_الحصة</li>
                <li>• الصف (32 فصلاً)</li>
                <li>• المادة</li>
                <li>• المعلم</li>
                <li>• القاعة</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* قسم 3: دليل تشغيل وضع ملء الشاشة على شاشة التلفاز Kiosk */}
      {activeGuideSection === 'kiosk' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs space-y-5 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Tv className="w-6 h-6 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                دليل تشغيل الشاشة بنظام ملء الشاشة (Kiosk Mode) على شاشات أندرويد الذكية
              </h3>
              <p className="text-[11px] text-slate-500">
                لضمان عمل الشاشة تلقائياً 24/7 طوال اليوم الدراسي دون ظهور أشرطة المتصفح
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-sm font-bold text-indigo-800 block mb-2">الخيار 1: تطبيق Fully Kiosk Browser (الأفضل)</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-700">
                <li>حمّل تطبيق <strong>Fully Kiosk Browser</strong> من متجر Google Play على شاشة الأندرويد.</li>
                <li>افتح إعدادات التطبيق وضع رابط الموقع في حقل <strong>Start URL</strong>.</li>
                <li>فعّل خيار <strong>Enable Kiosk Mode</strong> لقفل الشاشة على الموقع.</li>
                <li>فعّل خيار <strong>Run on Boot</strong> ليبدأ العرض تلقائياً عند تشغيل الكهرباء.</li>
              </ol>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-sm font-bold text-emerald-800 block mb-2">الخيار 2: متصفح Google Chrome PWA</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-700">
                <li>افتح الموقع على متصفح Chrome بالشاشة.</li>
                <li>اضغط على القائمة (ثلاث نقاط) واختر <strong>تثبيت التطبيق (Install App)</strong>.</li>
                <li>سيفتح التطبيق كنافذة مستقلة بدون أي أشرطة عنوان.</li>
                <li>اضغط على زر ملء الشاشة في الترويسة العلوية لإخفاء شريط المهام.</li>
              </ol>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-sm font-bold text-amber-800 block mb-2">نصائح لشاشات المدارس</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>عطّل وضع السكون (Sleep Mode) من إعدادات شاشة التلفاز.</li>
                <li>اضبط الدقة على 1080p أو 4K (Landscape 16:9).</li>
                <li>استخدم كابل شبكة Ethernet أو شبكة Wi-Fi مدرسية مستقرة.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* قسم 4: النشر المجاني */}
      {activeGuideSection === 'hosting' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-xs space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Globe className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                دليل النشر المجاني لتطبيق الويب (Deployment Guide)
              </h3>
              <p className="text-[11px] text-slate-500">
                خطوات رفع الموقع برابط دائم ومجاني وسريع
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-emerald-800 mb-2">1. النشر عبر Vercel (الموصى به)</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>ارفع الكود إلى مستودع <strong>GitHub</strong> الخاص بك.</li>
                <li>سجل دخولك مجاناً إلى <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">Vercel.com</a>.</li>
                <li>اضغط <strong>Add New Project</strong> واختر المستودع.</li>
                <li>سيتعرف Vercel على إعدادات Vite تلقائياً (Build Command: <code className="text-emerald-700 bg-emerald-50 px-1 rounded font-mono">npm run build</code>, Output: <code className="text-emerald-700 bg-emerald-50 px-1 rounded font-mono">dist</code>).</li>
                <li>اضغط <strong>Deploy</strong> وخلال 30 ثانية ستحصل على رابط دائم مجاني (مثل: <code>https://school-display.vercel.app</code>).</li>
              </ol>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-bold text-indigo-800 mb-2">2. النشر عبر Netlify</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>سجل دخولك إلى <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">Netlify.com</a>.</li>
                <li>اختر <strong>Import from Git</strong> ثم حدد المستودع.</li>
                <li>اكتب أمر البناء <code className="text-emerald-700 bg-emerald-50 px-1 rounded font-mono">npm run build</code> ومجلد النشر <code className="text-emerald-700 bg-emerald-50 px-1 rounded font-mono">dist</code>.</li>
                <li>اضغط <strong>Deploy Site</strong>، وسيعمل الرابط فوراً.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
