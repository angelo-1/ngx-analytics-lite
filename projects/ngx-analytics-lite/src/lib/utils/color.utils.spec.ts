import { generatePalette, hexToRgba } from './color.utils';

describe('color.utils', () => {

  describe('generatePalette()', () => {
    it('should return the correct number of colors', () => {
      expect(generatePalette(3).length).toBe(3);
    });

    it('should return empty array for count 0', () => {
      expect(generatePalette(0)).toEqual([]);
    });

    it('should cycle palette when count exceeds palette length', () => {
      const palette = ['#aaa', '#bbb'];
      const result = generatePalette(5, palette);
      expect(result.length).toBe(5);
      expect(result[0]).toBe('#aaa');
      expect(result[2]).toBe('#aaa'); // wraps
    });

    it('should return valid hex strings from default palette', () => {
      const result = generatePalette(4);
      result.forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe('hexToRgba()', () => {
    it('should convert hex to rgba with correct alpha', () => {
      expect(hexToRgba('#6366f1', 0.5)).toBe('rgba(99, 102, 241, 0.5)');
    });

    it('should return original string for invalid hex', () => {
      expect(hexToRgba('not-a-hex', 1)).toBe('not-a-hex');
    });

    it('should handle alpha = 1 (fully opaque)', () => {
      expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)');
    });
  });
});
