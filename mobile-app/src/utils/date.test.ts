import {
  addHoursToDate,
  formatDateToHoursMinutes,
  formatDateToString,
  formatDateToStringISO,
  formatTime,
} from '@/utils/date';

describe('Utils | date | addHoursToDate', () => {
  it('should correctly add hours to the date', () => {
    const initialDate = new Date('2024-01-01T12:00:00');
    const hoursToAdd = 5;

    const expectedOutput = new Date('2024-01-01T17:00:00');

    expect(addHoursToDate(initialDate, hoursToAdd)).toEqual(expectedOutput);
  });

  it('should handle negative hours correctly', () => {
    const initialDate = new Date('2024-01-01T12:00:00');
    const hoursToAdd = -3;

    const expectedOutput = new Date('2024-01-01T09:00:00');

    expect(addHoursToDate(initialDate, hoursToAdd)).toEqual(expectedOutput);
  });
});

describe('Utils | date | formatDateToHoursMinutes', () => {
  it('should return the correct formatted string', () => {
    const initialDate = new Date('2024-01-01T12:05:00');

    const expectedOutput = '12:05';

    expect(formatDateToHoursMinutes(initialDate)).toBe(expectedOutput);
  });

  it('should handle midnight correctly', () => {
    const initialDate = new Date('2024-01-01T00:00:00');

    const expectedOutput = '00:00';

    expect(formatDateToHoursMinutes(initialDate)).toBe(expectedOutput);
  });
});

describe('Utils | date | formatDateToString', () => {
  it('should return the correct formatted string', () => {
    const initialDate = new Date('2024-01-01T12:00:00');

    const expectedOutput = '1 janvier 2024';

    expect(formatDateToString(initialDate)).toBe(expectedOutput);
  });
});

describe('Utils | date | formatDateToStringISO', () => {
  it('should return the ISO string with one hour added', () => {
    const initialDate = new Date('2024-01-01T12:05:00');

    const expectedOutput = new Date('2024-01-01T13:05:00').toISOString();

    expect(formatDateToStringISO(initialDate)).toBe(expectedOutput);
  });
});

describe('Utils | date | formatTime', () => {
  it('should return the correct formatted time string for seconds', () => {
    const durationInSeconds = 1;

    const expectedOutput = '00:01';

    expect(formatTime(durationInSeconds)).toBe(expectedOutput);
  });

  it('should return the correct formatted time string for minutes', () => {
    const durationInSeconds = 60;

    const expectedOutput = '01:00';

    expect(formatTime(durationInSeconds)).toBe(expectedOutput);
  });

  it('should return the correct formatted time string for hours', () => {
    const durationInSeconds = 3600;

    const expectedOutput = '01:00:00';

    expect(formatTime(durationInSeconds)).toBe(expectedOutput);
  });

  it('should return the correct formatted time string for days', () => {
    const durationInSeconds = 86400;

    const expectedOutput = '01:00:00:00';

    expect(formatTime(durationInSeconds)).toBe(expectedOutput);
  });
});
