import { MELLSTROYS } from '../data/mellstroys';

/**
 * Generates a random Mellstroy ID (1 to total available), ensuring it is different
 * from previousId so consecutive rolls are always different.
 */
export function getRandomMellstroyId(previousId?: number): number {
  const total = MELLSTROYS.length;
  if (total <= 1) return 1;

  if (!previousId) {
    const randomIndex = Math.floor(Math.random() * total);
    return MELLSTROYS[randomIndex].id;
  }

  let newId: number;
  do {
    const randomIndex = Math.floor(Math.random() * total);
    newId = MELLSTROYS[randomIndex].id;
  } while (newId === previousId && total > 1);

  return newId;
}

export function formatRussianDate(birthdayStr: string): string {
  if (!birthdayStr) return '';
  try {
    const parts = birthdayStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      return `${day} ${months[monthIndex] || ''} ${year} года`;
    }
  } catch {
    // fallback
  }
  return birthdayStr;
}
