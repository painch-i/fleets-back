import {
  hexToRgb,
  isStringEmpty,
  parseStringifiedBoolean,
} from '@/utils/string';

describe('Utils | string | isStringEmpty', () => {
  it('should return true for an empty string', () => {
    expect(isStringEmpty('')).toBe(true);
  });

  it('should return true for a string containing only spaces', () => {
    expect(isStringEmpty('   ')).toBe(true);
  });

  it('should return true for a string containing only newlines', () => {
    expect(isStringEmpty('\n\n\n')).toBe(true);
  });

  it('should return false for a non-empty string', () => {
    expect(isStringEmpty('Hello, world!')).toBe(false);
  });

  it('should return false for a string containing only spaces with characters', () => {
    expect(isStringEmpty('   Hello   ')).toBe(false);
  });
});

describe('Utils | string | parseStringifiedBoolean', () => {
  it('should return true for the string "true"', () => {
    expect(parseStringifiedBoolean('true')).toBe(true);
  });

  it('should return false for the string "false"', () => {
    expect(parseStringifiedBoolean('false')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(parseStringifiedBoolean('')).toBe(false);
  });
});

describe('Utils | string | hexToRgb', () => {
  it('should return the correct rgb', () => {
    const expectedOutput = 'rgb(255, 255, 255)';

    expect(hexToRgb('#ffffff')).toBe(expectedOutput);
  });

  it('should handle incorrect hex string', () => {
    expect(hexToRgb('Not an hex string')).toBe('');
  });
});
