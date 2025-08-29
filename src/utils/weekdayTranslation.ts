const WEEKDAY_TRANSLATIONS: { [key: string]: string } = {
  'monday': 'Segunda-feira',
  'tuesday': 'Terça-feira',
  'wednesday': 'Quarta-feira',
  'thursday': 'Quinta-feira',
  'friday': 'Sexta-feira',
  'saturday': 'Sábado',
  'sunday': 'Domingo',
};

// Reverse mapping for Portuguese to English translation
const REVERSE_WEEKDAY_TRANSLATIONS: { [key: string]: string } = {
  'Segunda-feira': 'monday',
  'Terça-feira': 'tuesday',
  'Quarta-feira': 'wednesday',
  'Quinta-feira': 'thursday',
  'Sexta-feira': 'friday',
  'Sábado': 'saturday',
  'Domingo': 'sunday',
};

/**
 * Translates an English weekday (lowercase) to Portuguese
 * @param weekday - The English weekday in lowercase
 * @returns The Portuguese weekday name or empty string if invalid
 */
export function translateWeekday(weekday: string | null | undefined): string {
  if (!weekday) {
    return '';
  }
  
  return WEEKDAY_TRANSLATIONS[weekday] || '';
}

/**
 * Translates a Portuguese weekday to English (lowercase)
 * @param weekday - The Portuguese weekday name
 * @returns The English weekday name in lowercase or empty string if invalid
 */
export function translateWeekdayToEnglish(weekday: string | null | undefined): string {
  if (!weekday) {
    return '';
  }
  
  return REVERSE_WEEKDAY_TRANSLATIONS[weekday] || '';
}
