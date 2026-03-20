export function formatDateToThai(input?: Date): string {
  const date = input ? new Date(input) : new Date();

  // Convert to Thailand timezone (UTC+7)
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const thaiTime = new Date(utc + 7 * 3600000);

  const year = thaiTime.getFullYear();
  const month = String(thaiTime.getMonth() + 1).padStart(2, '0');
  const day = String(thaiTime.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}