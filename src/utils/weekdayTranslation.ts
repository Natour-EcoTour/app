const REVERSE_WEEKDAY_TRANSLATIONS: Record<string, string> = {
  'segunda': 'monday',
  'segunda-feira': 'monday',
  'terça': 'tuesday',
  'terca': 'tuesday',
  'terça-feira': 'tuesday',
  'terca-feira': 'tuesday',
  'quarta': 'wednesday',
  'quarta-feira': 'wednesday',
  'quinta': 'thursday',
  'quinta-feira': 'thursday',
  'sexta': 'friday',
  'sexta-feira': 'friday',
  'sábado': 'saturday',
  'sabado': 'saturday',
  'domingo': 'sunday',
};

export function translateWeekdayToEnglish(weekday?: string | null): string {
  if (!weekday) return '';
  const key = weekday.toLowerCase().trim();
  return REVERSE_WEEKDAY_TRANSLATIONS[key] || '';
}
