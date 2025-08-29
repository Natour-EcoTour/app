const WEEKDAY_TRANSLATIONS: { [key: string]: string } = {
  'monday': 'Segunda-feira',
  'tuesday': 'Terça-feira',
  'wednesday': 'Quarta-feira',
  'thursday': 'Quinta-feira',
  'friday': 'Sexta-feira',
  'saturday': 'Sábado',
  'sunday': 'Domingo',
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
