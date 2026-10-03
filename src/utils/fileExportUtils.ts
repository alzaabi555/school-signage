import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * فحص ما إذا كان التطبيق يعمل داخل بيئة تطبيق أندرويد أصلية (Capacitor Native)
 */
export function isNativeAndroidApp(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * تحويل كائن Blob إلى سلسلة Base64 مناسبة لمكتبة Filesystem في Capacitor
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة الملف كـ Base64'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // استخراج الجزء المشفر بـ Base64 بعد الفاصلة
      const commaIndex = dataUrl.indexOf(',');
      const base64 = commaIndex !== -1 ? dataUrl.substring(commaIndex + 1) : dataUrl;
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

export interface ExportOrShareOptions {
  blob: Blob;
  fileName: string;
  title?: string;
  text?: string;
  dialogTitle?: string;
}

export interface ExportResult {
  success: boolean;
  method: 'capacitor' | 'web-share' | 'browser-download' | 'cancelled';
  message: string;
}

/**
 * دالة عامة وقوية لحفظ ومشاركة وتنزيل الملفات (Excel, HTML, PDF)
 * تدعم بيئة تطبيقات الأندرويد (WebView / Capacitor) ومتصفحات الويب دون أي مشاكل
 */
export async function downloadOrShareFile(options: ExportOrShareOptions): Promise<ExportResult> {
  const { blob, fileName, title = 'تصدير ملف مدرسي', text = '', dialogTitle = 'مشاركة أو حفظ الملف' } = options;

  // 1. إذا كان التطبيق يعمل كتطبيق أندرويد عبر Capacitor
  if (isNativeAndroidApp()) {
    try {
      const base64Data = await blobToBase64(blob);

      // حفظ الملف في مجلد Cache أو Documents الخاص بالتطبيق
      const fileResult = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      // استدعاء نافذة المشاركة والطباعة وحفظ الملفات الرسمية في نظام أندرويد
      await Share.share({
        title: title || fileName,
        text: text || title,
        url: fileResult.uri,
        dialogTitle: dialogTitle,
      });

      return {
        success: true,
        method: 'capacitor',
        message: 'تم فتح نافذة المشاركة والحفظ في الأندرويد بنجاح',
      };
    } catch (capError) {
      console.warn('Capacitor Filesystem/Share error, trying web fallback:', capError);
      // إذا كان الخطأ هو إلغاء المستخدم للمشاركة فلا نعتبره فشلاً
      if (capError instanceof Error && (capError.message.includes('abort') || capError.message.includes('dismiss'))) {
        return {
          success: true,
          method: 'cancelled',
          message: 'تم إغلاق نافذة المشاركة',
        };
      }
    }
  }

  // 2. تجربة Web Share API القياسية للمتصفحات المدعومة
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      const mimeType = blob.type || 'application/octet-stream';
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title || fileName,
          text: text || title,
        });
        return {
          success: true,
          method: 'web-share',
          message: 'تمت المشاركة بنجاح عبر المتصفح',
        };
      }
    } catch (shareErr) {
      if (shareErr instanceof Error && shareErr.name === 'AbortError') {
        return {
          success: true,
          method: 'cancelled',
          message: 'تم إلغاء المشاركة بواسطة المستخدم',
        };
      }
      console.warn('Web Share failed, proceeding to direct browser download', shareErr);
    }
  }

  // 3. طريقة التنزيل القياسية لمتصفحات الحواسيب والهواتف
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 4000);

    return {
      success: true,
      method: 'browser-download',
      message: 'بدأ تنزيل الملف في المتصفح بنجاح',
    };
  } catch (downloadErr) {
    console.error('Browser download failed:', downloadErr);
    return {
      success: false,
      method: 'browser-download',
      message: downloadErr instanceof Error ? downloadErr.message : 'فشل تنزيل الملف',
    };
  }
}
