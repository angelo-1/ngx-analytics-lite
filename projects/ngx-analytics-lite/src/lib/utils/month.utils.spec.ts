import { extractMonths, isInDateRange } from './month.utils';

describe('month.utils', () => {

  describe('extractMonths()', () => {
    it('should extract unique months in sorted order', () => {
      const input = ['2025-03-10', '2025-01-05', '2025-03-22', '2025-02-14'];
      expect(extractMonths(input)).toEqual(['2025-01', '2025-02', '2025-03']);
    });

    it('should return empty array for empty input', () => {
      expect(extractMonths([])).toEqual([]);
    });

    it('should filter out null and undefined entries', () => {
      const input = ['2025-01-01', null, undefined, ''];
      expect(extractMonths(input)).toEqual(['2025-01']);
    });

    it('should deduplicate months within the same month', () => {
      const input = ['2025-06-01', '2025-06-15', '2025-06-30'];
      expect(extractMonths(input)).toEqual(['2025-06']);
    });
  });

  describe('isInDateRange()', () => {
    it('should return true for date within range', () => {
      expect(isInDateRange('2025-03-15', '2025-01-01', '2025-06-30')).toBeTrue();
    });

    it('should return true for date on boundary (from)', () => {
      expect(isInDateRange('2025-01-01', '2025-01-01', '2025-06-30')).toBeTrue();
    });

    it('should return true for date on boundary (to)', () => {
      expect(isInDateRange('2025-06-30', '2025-01-01', '2025-06-30')).toBeTrue();
    });

    it('should return false for date before range', () => {
      expect(isInDateRange('2024-12-31', '2025-01-01', '2025-06-30')).toBeFalse();
    });

    it('should return false for date after range', () => {
      expect(isInDateRange('2025-07-01', '2025-01-01', '2025-06-30')).toBeFalse();
    });
  });
});
