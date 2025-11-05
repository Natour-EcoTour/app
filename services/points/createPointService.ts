import apiClient from '@/services/apiClient';
import { handleApiError } from '@/src/utils/errorHandling';
import { translateWeekdayToEnglish } from '@/src/utils/weekdayTranslation';

// Week enum
const WEEK_ENUM = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const;
type WeekDay = typeof WEEK_ENUM[number];

// Convert time to HH:MM:SS format
const toHHMMSS = (t?: string) => {
  if (!t) return '';
  if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
  return '';
};

// Sanitize string
const sanitizeStr = (v?: string) => (typeof v === 'string' ? v.trim() : '');

// Check if valid point type
const isPointType = (t: string): t is 'trail'|'water_fall'|'park'|'farm'|'other' =>
  ['trail','water_fall','park','farm','other'].includes(t);

// Point data input interface
interface PointDataInput {
  name: string;
  description: string;
  week_start: string;
  week_end: string;
  open_time: string;
  close_time: string;
  point_type: 'trail'|'water_fall'|'park'|'farm'|'other';
  link?: string;
  latitude?: number;
  longitude?: number;
  zip_code?: string;
  city?: string;
  neighborhood?: string;
  state?: string;
  street?: string;
  number?: number;
}

interface PointDataAPI {
  name: string;
  description: string;
  week_start: WeekDay;
  week_end: WeekDay;
  open_time: string;
  close_time: string;
  point_type: 'trail'|'water_fall'|'park'|'farm'|'other';
  link: string;
  latitude?: number;
  longitude?: number;
  zip_code: string;
  city: string;
  neighborhood: string;
  state: string;
  street: string;
  number?: number;
}

export const createPoint = async (pointData: PointDataInput) => {
  try {
    // 1) Traduz e valida dias da semana
    const startEn = translateWeekdayToEnglish(pointData.week_start)?.toLowerCase();
    const endEn   = translateWeekdayToEnglish(pointData.week_end)?.toLowerCase();

    if (!WEEK_ENUM.includes(startEn as WeekDay)) {
      throw new Error(`week_start inválido: "${pointData.week_start}" → "${startEn}"`);
    }
    if (!WEEK_ENUM.includes(endEn as WeekDay)) {
      throw new Error(`week_end inválido: "${pointData.week_end}" → "${endEn}"`);
    }

    // 2) Normaliza horário
    const open = toHHMMSS(pointData.open_time);
    const close = toHHMMSS(pointData.close_time);
    if (!open || !close) {
      throw new Error(`Horário inválido. Envie "HH:MM" ou "HH:MM:SS". Recebi open="${pointData.open_time}", close="${pointData.close_time}"`);
    }

    // 3) Confere point_type
    if (!isPointType(pointData.point_type)) {
      throw new Error(`point_type inválido: "${pointData.point_type}"`);
    }

    // 4) Monta payload limpinho (sem undefined)
    const apiData: PointDataAPI = {
      name: sanitizeStr(pointData.name),
      description: sanitizeStr(pointData.description),
      week_start: startEn as WeekDay,
      week_end: endEn as WeekDay,
      open_time: open,
      close_time: close,
      point_type: pointData.point_type,
      link: sanitizeStr(pointData.link) || '',

      zip_code: sanitizeStr(pointData.zip_code),
      city: sanitizeStr(pointData.city),
      neighborhood: sanitizeStr(pointData.neighborhood),
      state: sanitizeStr(pointData.state),
      street: sanitizeStr(pointData.street),
      ...(typeof pointData.number === 'number' && pointData.number > 0 ? { number: pointData.number } : {}),

      ...(typeof pointData.latitude === 'number' && typeof pointData.longitude === 'number'
        ? { latitude: pointData.latitude, longitude: pointData.longitude }
        : {}),
    };


    const res = await apiClient.post('points/create/', apiData, {
      headers: { 'Accept': 'application/json' },
    });
    return res.data;
  } catch (error: any) {
    if (error?.response) {
      const ct = String(error.response.headers?.['content-type'] || '');
      console.error('createPoint status:', error.response.status);
      console.error('createPoint headers:', error.response.headers);
      if (ct.includes('text/html')) {
        console.error('createPoint HTML error (first 800):', String(error.response.data).slice(0, 800));
      } else {
        console.error('createPoint JSON error:', error.response.data);
      }
    } else {
      console.error('createPoint network/unknown error:', error?.message || error);
    }
    handleApiError(error);
    throw error;
  }
};
