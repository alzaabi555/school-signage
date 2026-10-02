/**
 * =========================================================================
 * كود Google Apps Script النهائي لنظام الشاشات الذكية المدرسية
 * School Digital Signage System - Google Apps Script Backend (API)
 * =========================================================================
 * 
 * طريقة التثبيت والنشر:
 * 1. أنشئ ملف Google Sheets جديد وسمّه "قاعدة بيانات الشاشة المدرسية الذكية".
 * 2. اضغط على (الإضافات Extensions) > (Apps Script).
 * 3. امسح أي كود موجود والصق هذا الكود كاملاً في ملف Code.gs.
 * 4. شغّل الدالة setupSchoolSpreadsheet() مرة واحدة لإنشاء وتجهيز جميع أوراق العمل والأعمدة تلقائياً!
 * 5. اضغط على (نشر Deploy) > (نشر جديد New deployment) > اختر نوع (تطبيق ويب Web app).
 * 6. اضبط الصلاحيات كالتالي:
 *    - تنفيذ كـ (Execute as): أنا (Me / حسابك الشخصي).
 *    - من لديه حق الوصول (Who has access): أي شخص (Anyone - حتى بدون تسجيل دخول).
 * 7. انسخ الرابط النهائي (Web App URL) والصقه في شاشة إعدادات التطبيق.
 */

// أسماء أوراق العمل في Google Sheets
const SHEET_NAMES = {
  SUBSTITUTIONS: 'الاحتياط_اليومي',
  DUTY: 'المناوبة_اليومية',
  TIMETABLE: 'الجدول_الدراسي',
  PERIODS: 'أوقات_الحصص',
  ANNOUNCEMENTS: 'الإعلانات_المدرسية',
  SETTINGS: 'إعدادات_المدرسة',
  TEACHERS: 'دليل_المعلمين'
};

/**
 * دالة التهيئة الأولية: تنشئ الأوراق بالأعمدة والبيانات النموذجية تلقائياً
 */
function setupSchoolSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. ورقة الاحتياط اليومي
  let subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
  if (!subSheet) {
    subSheet = ss.insertSheet(SHEET_NAMES.SUBSTITUTIONS);
    subSheet.appendRow(['المعرف', 'التاريخ', 'الحصة', 'الصف', 'المعلم_الغائب', 'المعلم_البديل', 'المادة', 'الحالة', 'ملاحظات', 'وقت_التحديث']);
    subSheet.getRange(1, 1, 1, 10).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
    
    // إضافة بيانات تجريبية
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    subSheet.appendRow(['SUB-1', today, 'الحصة الثانية', 'أول ثانوي (أ)', 'أ. خالد الشمري', 'أ. أحمد السعيد', 'رياضيات', 'مؤكد', 'تغطية كاملة مع حل التمارين', new Date().toISOString()]);
    subSheet.appendRow(['SUB-2', today, 'الحصة الرابعة', 'ثاني ثانوي (علمي)', 'أ. فهد الدوسري', 'أ. محمد الزهراني', 'فيزياء', 'قيد الانتظار', 'في معمل الفيزياء', new Date().toISOString()]);
    subSheet.appendRow(['SUB-3', today, 'الحصة السادسة', 'ثالث متوسط (1)', 'أ. سلطان العتيبي', 'أ. طارق الماجد', 'لغة إنجليزية', 'مؤكد', 'قاعة 104', new Date().toISOString()]);
  }

  // 2. ورقة المناوبة اليومية
  let dutySheet = ss.getSheetByName(SHEET_NAMES.DUTY);
  if (!dutySheet) {
    dutySheet = ss.insertSheet(SHEET_NAMES.DUTY);
    dutySheet.appendRow(['المعرف', 'اليوم', 'الموقع_والمهمة', 'المشرف_الرئيسي', 'المعاونون', 'وقت_المناوبة', 'ملاحظات']);
    dutySheet.getRange(1, 1, 1, 7).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
    
    // بيانات تجريبية لأيام الأسبوع
    dutySheet.appendRow(['DUTY-1', 'الأحد', 'البوابة الرئيسية واستقبال الطلاب', 'أ. عبد الله الشهري', 'أ. ماجد الحربي، أ. صالح العمري', 'الصباح والانصراف', 'متابعة دخول الطلاب']);
    dutySheet.appendRow(['DUTY-2', 'الأحد', 'الساحة الداخلية والمصلى', 'أ. علي القحطاني', 'أ. تركي السبيعي', 'الفسحة والصلاة', 'تنظيم الطابور والصفوف']);
    dutySheet.appendRow(['DUTY-3', 'الأحد', 'المقصف المدرسي والممرات', 'أ. إبراهيم الفهد', 'أ. فيصل القرني', 'الفسحة', 'تنظيم الشراء والهدوء']);
    
    dutySheet.appendRow(['DUTY-4', 'الاثنين', 'البوابة الرئيسية واستقبال الطلاب', 'أ. عبد الرحمن السعد', 'أ. خالد المطيري', 'الصباح والانصراف', 'التواجد من 6:45 صباحاً']);
    dutySheet.appendRow(['DUTY-5', 'الاثنين', 'الساحة الداخلية والمصلى', 'أ. طلال العنزي', 'أ. سعود الدوسري', 'الفسحة والصلاة', 'الإشراف على الوضوء']);
  }

  // 3. ورقة مواعيد الحصص
  let periodSheet = ss.getSheetByName(SHEET_NAMES.PERIODS);
  if (!periodSheet) {
    periodSheet = ss.insertSheet(SHEET_NAMES.PERIODS);
    periodSheet.appendRow(['المعرف', 'اسم_الفترة', 'وقت_البدء', 'وقت_الانتهاء', 'هل_هي_فسحة', 'الترتيب']);
    periodSheet.getRange(1, 1, 1, 6).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
    
    periodSheet.appendRow(['p0', 'طابور الصباح والإذاعة', '06:45', '07:00', 'نعم', 0]);
    periodSheet.appendRow(['p1', 'الحصة الأولى', '07:00', '07:45', 'لا', 1]);
    periodSheet.appendRow(['p2', 'الحصة الثانية', '07:45', '08:30', 'لا', 2]);
    periodSheet.appendRow(['b1', 'الفسحة الأولى وتناول الإفطار', '08:30', '09:00', 'نعم', 3]);
    periodSheet.appendRow(['p3', 'الحصة الثالثة', '09:00', '09:45', 'لا', 4]);
    periodSheet.appendRow(['p4', 'الحصة الرابعة', '09:45', '10:30', 'لا', 5]);
    periodSheet.appendRow(['b2', 'صلاة الظهر والفسحة الثانية', '10:30', '11:00', 'نعم', 6]);
    periodSheet.appendRow(['p5', 'الحصة الخامسة', '11:00', '11:45', 'لا', 7]);
    periodSheet.appendRow(['p6', 'الحصة السادسة', '11:45', '12:30', 'لا', 8]);
    periodSheet.appendRow(['p7', 'الحصة السابعة', '12:30', '13:10', 'لا', 9]);
    periodSheet.appendRow(['p8', 'الحصة الثامنة والانصراف', '13:10', '13:50', 'لا', 10]);
  }

  // 4. ورقة الإعلانات المدرسية
  let annSheet = ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS);
  if (!annSheet) {
    annSheet = ss.insertSheet(SHEET_NAMES.ANNOUNCEMENTS);
    annSheet.appendRow(['المعرف', 'نص_الإعلان', 'النوع', 'نشط', 'تاريخ_الإنشاء']);
    annSheet.getRange(1, 1, 1, 5).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
    
    annSheet.appendRow(['ANN-1', 'نرحب بأبنائنا الطلاب ومعلمينا الأفاضل ونتمنى لكم يوماً دراسياً متميزاً وحافلاً بالإنجاز.', 'info', 'نعم', new Date().toISOString()]);
    annSheet.appendRow(['ANN-2', 'تنبيه: اجتماع لجنة التوجيه الطلابي اليوم في مركز مصادر التعلم بعد نهاية الحصة الرابعة.', 'urgent', 'نعم', new Date().toISOString()]);
    annSheet.appendRow(['ANN-3', 'حديث شريف: «طلب العلم فريضة على كل مسلم» - حثوا أبناءكم على الجد والاجتهاد.', 'hadith', 'نعم', new Date().toISOString()]);
  }

  // 5. ورقة الجدول الدراسي اليومي
  let timeTableSheet = ss.getSheetByName(SHEET_NAMES.TIMETABLE);
  if (!timeTableSheet) {
    timeTableSheet = ss.insertSheet(SHEET_NAMES.TIMETABLE);
    timeTableSheet.appendRow(['المعرف', 'اليوم', 'معرف_الحصة', 'الصف', 'المادة', 'المعلم', 'القاعة']);
    timeTableSheet.getRange(1, 1, 1, 7).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
    
    const sampleClasses = [
      ['TT-1', 'الأحد', 'p1', 'أول ثانوي (أ)', 'رياضيات', 'أ. أحمد الغامدي', 'قاعة 101'],
      ['TT-2', 'الأحد', 'p1', 'أول ثانوي (ب)', 'كيمياء', 'أ. سامي الحربي', 'معمل الكيمياء'],
      ['TT-3', 'الأحد', 'p1', 'ثاني ثانوي (علمي)', 'لغة إنجليزية', 'أ. طارق الماجد', 'قاعة 201'],
      ['TT-4', 'الأحد', 'p1', 'ثاني ثانوي (أدبي)', 'تاريخ', 'أ. بدر المطيري', 'قاعة 203'],
      ['TT-5', 'الأحد', 'p1', 'ثالث ثانوي (أ)', 'فيزياء', 'أ. فهد الدوسري', 'مختبر الفيزياء'],
      ['TT-6', 'الأحد', 'p1', 'ثالث ثانوي (ب)', 'أحياء', 'أ. عبد الله الزهراني', 'معمل الأحياء'],
      
      ['TT-7', 'الأحد', 'p2', 'أول ثانوي (أ)', 'لغة عربية', 'أ. محمد القحطاني', 'قاعة 101'],
      ['TT-8', 'الأحد', 'p2', 'أول ثانوي (ب)', 'رياضيات', 'أ. أحمد الغامدي', 'قاعة 102'],
      ['TT-9', 'الأحد', 'p2', 'ثاني ثانوي (علمي)', 'فيزياء', 'أ. فهد الدوسري', 'قاعة 201'],
      ['TT-10', 'الأحد', 'p2', 'ثاني ثانوي (أدبي)', 'جغرافيا', 'أ. منصور العتيبي', 'قاعة 203'],
      ['TT-11', 'الأحد', 'p2', 'ثالث ثانوي (أ)', 'حاسب وتقنية', 'أ. إبراهيم الخالد', 'معمل الحاسب'],
      ['TT-12', 'الأحد', 'p2', 'ثالث ثانوي (ب)', 'علوم إسلامية', 'أ. سليمان الراجحي', 'قاعة 302']
    ];
    sampleClasses.forEach(row => timeTableSheet.appendRow(row));
  }

  // 6. ورقة دليل ومعلمي المواد (تشمل المعلمين الرسميين والمتدربين)
  let teachersSheet = ss.getSheetByName(SHEET_NAMES.TEACHERS);
  if (!teachersSheet) {
    teachersSheet = ss.insertSheet(SHEET_NAMES.TEACHERS);
    teachersSheet.appendRow(['المعرف', 'المعلم', 'المادة', 'نوع_المعلم', 'ملاحظات', 'تاريخ_التحديث']);
    teachersSheet.getRange(1, 1, 1, 6).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
  }
}

/**
 * معالج طلبات GET: جلب جميع بيانات الشاشة دفعة واحدة
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'getAllData';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'ping') {
      return createJsonResponse({
        status: 'success',
        message: 'Google Apps Script API متصل ويعمل بنجاح',
        timestamp: new Date().toISOString()
      });
    }

    const teachersSheet = ss.getSheetByName(SHEET_NAMES.TEACHERS) ||
                          ss.getSheetByName('دليل_المعلمين') ||
                          ss.getSheetByName('قائمة_المعلمين') ||
                          ss.getSheetByName('معلمي_المواد');

    const payload = {
      status: 'success',
      timestamp: new Date().toISOString(),
      schoolName: 'ثانوية النخبة النموذجية الذكية',
      substitutions: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS)),
      duties: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.DUTY)),
      periods: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.PERIODS)),
      announcements: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS)),
      timetable: getSheetDataAsObjects(ss.getSheetByName(SHEET_NAMES.TIMETABLE)),
      teachers: teachersSheet ? getSheetDataAsObjects(teachersSheet) : []
    };

    return createJsonResponse(payload);
  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * معالج طلبات POST: إدخال أو تعديل الاحتياط، المناوبة، الإعلانات
 */
function doPost(e) {
  try {
    let requestData;
    if (e.postData && e.postData.contents) {
      requestData = JSON.parse(e.postData.contents);
    } else {
      requestData = e.parameter || {};
    }

    const action = requestData.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (action) {
      case 'add_substitution': {
        let subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
        if (!subSheet) {
          subSheet = ss.insertSheet(SHEET_NAMES.SUBSTITUTIONS);
          subSheet.appendRow(['المعرف', 'التاريخ', 'اليوم', 'الحصة', 'الصف', 'المعلم_الغائب', 'المعلم_البديل', 'المادة', 'الحالة', 'ملاحظات', 'وقت_التحديث']);
          subSheet.getRange(1, 1, 1, 11).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
        }
        
        const item = requestData.data || requestData;
        const newId = item.id || ('SUB-' + new Date().getTime().toString().slice(-6));
        const date = item.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
        const day = item.day || '';
        const period = item.period || '';
        const gradeClass = item.gradeClass || '';
        const absentTeacher = item.absentTeacher || '';
        const substituteTeacher = item.substituteTeacher || '';
        const subject = item.subject || '';
        const status = item.status || 'مؤكد';
        const notes = item.notes || '';
        const updatedAt = new Date().toISOString();

        // فحص رؤوس الأعمدة لمعرفة موضع عمود اليوم
        const headers = subSheet.getRange(1, 1, 1, Math.max(subSheet.getLastColumn(), 1)).getValues()[0];
        const dayIdx = headers.indexOf('اليوم');

        if (dayIdx !== -1) {
          // الورقة تحتوي عمود اليوم
          const rowData = [];
          for (let c = 0; c < headers.length; c++) {
            const h = String(headers[c]).trim();
            if (h === 'المعرف') rowData.push(newId);
            else if (h === 'التاريخ') rowData.push(date);
            else if (h === 'اليوم') rowData.push(day);
            else if (h === 'الحصة') rowData.push(period);
            else if (h === 'الصف') rowData.push(gradeClass);
            else if (h === 'المعلم_الغائب') rowData.push(absentTeacher);
            else if (h === 'المعلم_البديل') rowData.push(substituteTeacher);
            else if (h === 'المادة') rowData.push(subject);
            else if (h === 'الحالة') rowData.push(status);
            else if (h === 'ملاحظات') rowData.push(notes);
            else if (h === 'وقت_التحديث') rowData.push(updatedAt);
            else rowData.push('');
          }
          subSheet.appendRow(rowData);
        } else {
          // الورقة القديمة ذات 10 أعمدة، نضيف عمود اليوم في نهايتها تلقائياً لضمان التوافق
          subSheet.getRange(1, headers.length + 1).setValue('اليوم');
          subSheet.appendRow([newId, date, period, gradeClass, absentTeacher, substituteTeacher, subject, status, notes, updatedAt, day]);
        }
        SpreadsheetApp.flush();
        
        return createJsonResponse({
          status: 'success',
          message: 'تم تسجيل الاحتياط بنجاح في Google Sheets',
          id: newId
        });
      }

      case 'bulk_add_substitutions': {
        let subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
        if (!subSheet) {
          subSheet = ss.insertSheet(SHEET_NAMES.SUBSTITUTIONS);
          subSheet.appendRow(['المعرف', 'التاريخ', 'اليوم', 'الحصة', 'الصف', 'المعلم_الغائب', 'المعلم_البديل', 'المادة', 'الحالة', 'ملاحظات', 'وقت_التحديث']);
          subSheet.getRange(1, 1, 1, 11).setBackground('#1e293b').setFontColor('#ffffff').setFontWeight('bold');
        }

        const items = requestData.data || requestData.items || [];
        if (!Array.isArray(items) || items.length === 0) {
          return createJsonResponse({ status: 'success', success: true, count: 0, message: 'لا توجد حصص احتياط للإضافة' });
        }

        const headers = subSheet.getRange(1, 1, 1, Math.max(subSheet.getLastColumn(), 1)).getValues()[0];
        let hasDayCol = headers.indexOf('اليوم') !== -1;
        if (!hasDayCol) {
          subSheet.getRange(1, headers.length + 1).setValue('اليوم');
          headers.push('اليوم');
          hasDayCol = true;
        }

        const rowsToAppend = [];
        const nowIso = new Date().toISOString();
        const defaultDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const newId = item.id || ('SUB-' + (Date.now() + i).toString().slice(-6));
          const date = item.date || defaultDate;
          const day = item.day || '';
          const period = item.period || '';
          const gradeClass = item.gradeClass || '';
          const absentTeacher = item.absentTeacher || '';
          const substituteTeacher = item.substituteTeacher || '';
          const subject = item.subject || '';
          const status = item.status || 'مؤكد';
          const notes = item.notes || '';

          const rowData = [];
          for (let c = 0; c < headers.length; c++) {
            const h = String(headers[c]).trim();
            if (h === 'المعرف') rowData.push(newId);
            else if (h === 'التاريخ') rowData.push(date);
            else if (h === 'اليوم') rowData.push(day);
            else if (h === 'الحصة') rowData.push(period);
            else if (h === 'الصف') rowData.push(gradeClass);
            else if (h === 'المعلم_الغائب') rowData.push(absentTeacher);
            else if (h === 'المعلم_البديل') rowData.push(substituteTeacher);
            else if (h === 'المادة') rowData.push(subject);
            else if (h === 'الحالة') rowData.push(status);
            else if (h === 'ملاحظات') rowData.push(notes);
            else if (h === 'وقت_التحديث') rowData.push(nowIso);
            else rowData.push('');
          }
          rowsToAppend.push(rowData);
        }

        if (rowsToAppend.length > 0) {
          const startRow = subSheet.getLastRow() + 1;
          subSheet.getRange(startRow, 1, rowsToAppend.length, headers.length).setValues(rowsToAppend);
          SpreadsheetApp.flush();
        }

        return createJsonResponse({
          status: 'success',
          success: true,
          count: rowsToAppend.length,
          message: 'تم حفظ وتوزيع عدد (' + rowsToAppend.length + ') حصص احتياط دفعة واحدة بنجاح في Google Sheets'
        });
      }

      case 'delete_substitution': {
        const subSheet = ss.getSheetByName(SHEET_NAMES.SUBSTITUTIONS);
        const targetId = requestData.id;
        const rows = subSheet.getDataRange().getValues();
        let deleted = false;
        
        for (let i = 1; i < rows.length; i++) {
          if (String(rows[i][0]) === String(targetId)) {
            subSheet.deleteRow(i + 1);
            deleted = true;
            break;
          }
        }
        
        return createJsonResponse({
          status: deleted ? 'success' : 'not_found',
          message: deleted ? 'تم حذف السجل بنجاح' : 'لم يتم العثور على السجل'
        });
      }

      case 'update_duty': {
        const dutySheet = ss.getSheetByName(SHEET_NAMES.DUTY);
        const item = requestData.data || requestData;
        const rows = dutySheet.getDataRange().getValues();
        let updated = false;

        for (let i = 1; i < rows.length; i++) {
          if (String(rows[i][0]) === String(item.id)) {
            // تحديث المشرف والمعاونين
            if (item.leadTeacher) dutySheet.getRange(i + 1, 4).setValue(item.leadTeacher);
            if (item.assistants) dutySheet.getRange(i + 1, 5).setValue(item.assistants);
            if (item.notes) dutySheet.getRange(i + 1, 7).setValue(item.notes);
            updated = true;
            break;
          }
        }

        return createJsonResponse({
          status: updated ? 'success' : 'not_found',
          message: updated ? 'تم تحديث جدول المناوبة بنجاح' : 'السجل غير موجود'
        });
      }

      case 'bulk_update_timetable': {
        const timeTableSheet = ss.getSheetByName(SHEET_NAMES.TIMETABLE);
        if (!timeTableSheet) throw new Error('ورقة الجدول الدراسي غير موجودة');

        // 1 & 2. استقبال الجدول الجديد والتأكد أنه مصفوفة غير فارغة
        const items = requestData.data || requestData.timetable || [];
        if (!Array.isArray(items) || items.length === 0) {
          return createJsonResponse({
            status: 'error',
            success: false,
            message: 'تم رفض العملية: بيانات الجدول المستورد فارغة أو ليست مصفوفة صالحة'
          });
        }

        // 3 & 4 & 5. تطبيع periodId والتحقق من جميع السجلات في الذاكرة قبل حذف أي بيانات
        const validPeriodIds = { 'p1': true, 'p2': true, 'p3': true, 'p4': true, 'p5': true, 'p6': true, 'p7': true, 'p8': true };
        const rowsToAppend = [];

        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          if (!it || typeof it !== 'object') {
            return createJsonResponse({
              status: 'error',
              success: false,
              message: 'تم رفض العملية: السجل رقم ' + (i + 1) + ' غير صالح'
            });
          }

          const day = String(it.day || '').trim();
          const periodId = String(it.periodId || '').trim().toLowerCase();
          const gradeClass = String(it.gradeClass || '').trim();
          const subject = String(it.subject || '').trim();
          const teacher = String(it.teacher || '').trim();
          const room = String(it.room || ('قاعة ' + gradeClass)).trim();

          // لا يجوز تحويل معرف مفقود أو فاسد إلى p1 - إذا كان غير صالح يجب رفض العملية بالكامل
          if (!validPeriodIds[periodId]) {
            return createJsonResponse({
              status: 'error',
              success: false,
              message: 'تم رفض العملية: معرف الحصة (' + periodId + ') في السجل رقم ' + (i + 1) + ' غير صالح. يجب أن يكون حصراً بين p1 و p8'
            });
          }

          if (!day || !gradeClass || !subject || !teacher) {
            return createJsonResponse({
              status: 'error',
              success: false,
              message: 'تم رفض العملية: حقول ناقصة في السجل رقم ' + (i + 1)
            });
          }

          rowsToAppend.push([
            it.id || ('TT-' + Utilities.getUuid().slice(0, 8)),
            day,
            periodId,
            gradeClass,
            subject,
            teacher,
            room
          ]);
        }

        // 6. بعد نجاح التحقق فقط: حذف صفوف الجدول القديمة أسفل العناوين دون حذف الورقة نفسها
        const lastRow = timeTableSheet.getLastRow();
        if (lastRow > 1) {
          timeTableSheet.deleteRows(2, lastRow - 1);
        }

        // 7. كتابة الصفوف الجديدة دفعة واحدة
        timeTableSheet.getRange(2, 1, rowsToAppend.length, 7).setValues(rowsToAppend);

        // 8. تنفيذ SpreadsheetApp.flush() لضمان اكتمال الكتابة في السحابة فوراً
        SpreadsheetApp.flush();

        // 9. إعادة استجابة واضحة ومطابقة للمواصفات
        return createJsonResponse({
          status: 'success',
          success: true,
          count: rowsToAppend.length,
          operation: 'replace',
          message: 'تم استبدال الجدول بالكامل'
        });
      }

      case 'add_announcement': {
        const annSheet = ss.getSheetByName(SHEET_NAMES.ANNOUNCEMENTS);
        const item = requestData.data || requestData;
        const newId = 'ANN-' + new Date().getTime().toString().slice(-6);
        annSheet.appendRow([newId, item.text, item.type || 'info', 'نعم', new Date().toISOString()]);
        
        return createJsonResponse({
          status: 'success',
          message: 'تم إضافة الإعلان بنجاح',
          id: newId
        });
      }

      case 'update_periods':
      case 'bulk_update_periods': {
        const periodsSheet = ss.getSheetByName(SHEET_NAMES.PERIODS);
        if (!periodsSheet) throw new Error('ورقة مواقيت الحصص غير موجودة');

        const items = requestData.data || requestData.periods || [];
        const lastRow = periodsSheet.getLastRow();
        if (lastRow > 1) {
          periodsSheet.deleteRows(2, lastRow - 1);
        }

        if (Array.isArray(items) && items.length > 0) {
          const rowsToAppend = items.map((p, idx) => [
            p.id || ('p' + idx),
            p.name || ('الفترة ' + (idx + 1)),
            p.startTime || '07:00',
            p.endTime || '07:45',
            p.isBreak ? 'نعم' : 'لا',
            p.order !== undefined ? p.order : idx
          ]);
          periodsSheet.getRange(2, 1, rowsToAppend.length, 6).setValues(rowsToAppend);
        }

        return createJsonResponse({
          status: 'success',
          message: 'تم تحديث مواقيت الحصص في Google Sheets بنجاح',
          count: items.length
        });
      }

      case 'save_teachers':
      case 'bulk_update_teachers': {
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
        const rowsToAppend = [];

        if (Array.isArray(rawItems)) {
          for (let i = 0; i < rawItems.length; i++) {
            const it = rawItems[i];
            const teacherName = String(it.teacher || it.name || '').trim();
            const subject = String(it.subject || '').trim();
            const type = String(it.type || (teacherName.includes('متدرب') ? 'معلم متدرب' : 'معلم أساسي')).trim();
            const notes = String(it.notes || '').trim();
            if (teacherName) {
              rowsToAppend.push([
                it.id || ('TCH-' + (i + 1)),
                teacherName,
                subject,
                type,
                notes,
                new Date().toISOString()
              ]);
            }
          }
        } else if (typeof rawItems === 'object') {
          let counter = 1;
          const subjects = Object.keys(rawItems);
          for (let s = 0; s < subjects.length; s++) {
            const subj = subjects[s];
            const list = rawItems[subj] || [];
            for (let t = 0; t < list.length; t++) {
              const teacherName = String(list[t] || '').trim();
              if (teacherName) {
                rowsToAppend.push([
                  'TCH-' + (counter++),
                  teacherName,
                  subj,
                  teacherName.includes('متدرب') ? 'معلم متدرب' : 'معلم أساسي',
                  '',
                  new Date().toISOString()
                ]);
              }
            }
          }
        }

        const lastRow = teachersSheet.getLastRow();
        if (lastRow > 1) {
          teachersSheet.deleteRows(2, lastRow - 1);
        }
        if (rowsToAppend.length > 0) {
          teachersSheet.getRange(2, 1, rowsToAppend.length, 6).setValues(rowsToAppend);
        }
        SpreadsheetApp.flush();

        return createJsonResponse({
          status: 'success',
          success: true,
          count: rowsToAppend.length,
          message: 'تم حفظ وتحديث قائمة معلمي المواد في Google Sheets بنجاح'
        });
      }

      case 'add_teacher': {
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
        const teacherName = String(item.teacher || item.name || '').trim();
        const subject = String(item.subject || '').trim();
        const type = String(item.type || (teacherName.includes('متدرب') ? 'معلم متدرب' : 'معلم أساسي')).trim();
        const notes = String(item.notes || '').trim();

        teachersSheet.appendRow([newId, teacherName, subject, type, notes, new Date().toISOString()]);
        SpreadsheetApp.flush();

        return createJsonResponse({
          status: 'success',
          success: true,
          message: 'تمت إضافة المعلم بنجاح إلى دليل المعلمين في السحابة',
          id: newId
        });
      }

      default:
        return createJsonResponse({
          status: 'error',
          message: 'إجراء غير معروف: ' + action
        });
    }

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  }
}

/**
 * دالة مساعدة لتحويل صفوف ورقة العمل إلى مصفوفة كائنات JSON
 */
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
      const header = headers[j];
      let val = row[j];
      if (val instanceof Date) {
        const headerStr = String(header || '').toLowerCase();
        if (headerStr.includes('وقت') || headerStr.includes('time') || headerStr.includes('بدء') || headerStr.includes('انتهاء') || val.getFullYear() <= 1910) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'HH:mm');
        } else {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
        }
      }
      obj[header] = val;
    }
    data.push(obj);
  }

  return data;
}

/**
 * دالة استجابة JSON مع رؤوس الأمان وتخطي قيود CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
