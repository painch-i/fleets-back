export const addHoursToDate = (date: Date, h: number): Date => {
  date.setHours(date.getHours() + h);
  return date;
};

export const formatDateToHoursMinutes = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};

export const formatDateToString = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

export const formatDateToStringISO = (date: Date) => {
  const minDate = new Date(date);
  const tzoffset = minDate.getTimezoneOffset() * 60000;

  return new Date(minDate.getTime() - tzoffset).toISOString();
};

export function formatTime(durationInSeconds: number): string {
  const days = Math.floor(durationInSeconds / (3600 * 24));
  const hours = Math.floor((durationInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  let timeString = '';

  if (days > 0) {
    timeString += days.toString().padStart(2, '0') + ':';
  }

  if (hours > 0 || days > 0) {
    timeString += hours.toString().padStart(2, '0') + ':';
  }

  timeString +=
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');

  return timeString;
}
