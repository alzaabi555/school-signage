import QRCode from 'qrcode';

/**
 * بناء الرابط المباشر لتأكيد استلام تكليف الاحتياط
 */
export function getAssignmentAcknowledgmentUrl(subId: string): string {
  if (typeof window === 'undefined') return `?action=ack_sub&id=${encodeURIComponent(subId)}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?action=ack_sub&id=${encodeURIComponent(subId)}`;
}

/**
 * توليد رمز QR بصيغة DataURL (PNG base64) للاستخدام في الوسوم <img>
 * معدّل افتراضياً ليكون شديد التباين باللون الأسود النقي على خلفية بيضاء لسهولة القراءة من مسافة بعيدة
 */
export async function generateQrDataUrl(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 280,
      margin: options?.margin ?? 1,
      color: {
        dark: options?.color?.dark || '#000000', // أسود نقي 100% لأعلى سرعة في قراءة الكاميرا
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.warn('Failed to generate QR code:', error);
    return '';
  }
}

/**
 * توليد رمز QR بصيغة SVG خفيفة جداً ومناسبة للطباعة بدون تشويش
 */
export async function generateQrSvgString(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      width: options?.width || 140,
      margin: options?.margin ?? 1,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.warn('Failed to generate QR SVG:', error);
    return '';
  }
}

/**
 * تنسيق وقت الاستلام والتأكيد بالعربية (مثلاً: 08:35 ص)
 */
export function formatAcknowledgmentTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}
