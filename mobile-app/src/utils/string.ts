export function isStringEmpty(str: string): boolean {
  return /^\s*$/.test(str);
}

export function parseStringifiedBoolean(stringified: string) {
  if (stringified === 'true') {
    return true;
  }
  return false;
}

export function hexToRgb(hex: string): string {
  const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

  if (!hexRegex.test(hex)) {
    return '';
  }

  const newHex = hex.replace(/^#/, '');

  const bigint = parseInt(newHex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgb(${r}, ${g}, ${b})`;
}

export function stringToHex(hex: string): string {
  const hexRegex = /^#[a-fA-F0-9]{6}$/;

  if (hexRegex.test(hex)) return hex;

  return `#${hex}`;
}
