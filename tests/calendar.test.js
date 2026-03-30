import { describe, it, expect } from 'vitest';
import { getCycleWeek, getFocusForDay, isTrainingDay, getISODayOfWeek, formatDateISO } from '../src/utils/calendar.js';

describe('Calendar utils', () => {
  it('getCycleWeek returns 1 for first week', () => {
    expect(getCycleWeek('2026-03-30', '2026-03-30')).toBe(1);
  });

  it('getCycleWeek returns 2 for second week', () => {
    expect(getCycleWeek('2026-04-06', '2026-03-30')).toBe(2);
  });

  it('getCycleWeek returns 1 for third week (cycles back)', () => {
    expect(getCycleWeek('2026-04-13', '2026-03-30')).toBe(1);
  });

  it('getFocusForDay Monday week 1 = press', () => {
    expect(getFocusForDay(1, 1)).toBe('press');
  });

  it('getFocusForDay Wednesday week 1 = pull', () => {
    expect(getFocusForDay(3, 1)).toBe('pull');
  });

  it('getFocusForDay Friday week 1 = press', () => {
    expect(getFocusForDay(5, 1)).toBe('press');
  });

  it('getFocusForDay Monday week 2 = pull', () => {
    expect(getFocusForDay(1, 2)).toBe('pull');
  });

  it('getFocusForDay Wednesday week 2 = press', () => {
    expect(getFocusForDay(3, 2)).toBe('press');
  });

  it('getFocusForDay Tuesday returns null (rest day)', () => {
    expect(getFocusForDay(2, 1)).toBeNull();
  });

  it('isTrainingDay for Mon/Wed/Fri', () => {
    // Use T12:00:00 to avoid timezone boundary issues
    expect(isTrainingDay(new Date('2026-03-30T12:00:00'))).toBe(true);  // Mon
    expect(isTrainingDay(new Date('2026-03-31T12:00:00'))).toBe(false); // Tue
    expect(isTrainingDay(new Date('2026-04-01T12:00:00'))).toBe(true);  // Wed
    expect(isTrainingDay(new Date('2026-04-02T12:00:00'))).toBe(false); // Thu
    expect(isTrainingDay(new Date('2026-04-03T12:00:00'))).toBe(true);  // Fri
    expect(isTrainingDay(new Date('2026-04-04T12:00:00'))).toBe(false); // Sat
    expect(isTrainingDay(new Date('2026-04-05T12:00:00'))).toBe(false); // Sun
  });

  it('formatDateISO returns YYYY-MM-DD', () => {
    expect(formatDateISO(new Date('2026-03-30T15:00:00'))).toBe('2026-03-30');
  });
});
