import { describe, expect, it } from 'vitest';
import { formatDate, formatFileSize } from './format';
import { countStoresCreatedSince } from './storeStats';
import { toPercent } from './api/files';

describe('formatFileSize', () => {
  it.each([
    [0, '0 Bytes'],
    [undefined, '0 Bytes'],
    [512, '512 Bytes'],
    [1536, '1.5 KB'],
    [5 * 1024 * 1024, '5 MB'],
    [3 * 1024 ** 4, '3072 GB'],
  ])('formats %s as %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});

describe('formatDate', () => {
  it('returns Unknown for missing or invalid values', () => {
    expect(formatDate(undefined)).toBe('Unknown');
    expect(formatDate('not a date')).toBe('Unknown');
  });

  it('formats a valid timestamp', () => {
    expect(formatDate('2026-03-02T09:15:00Z', { year: 'numeric', timeZone: 'UTC' })).toBe('2026');
  });
});

describe('countStoresCreatedSince', () => {
  const stores = [
    { create_time: '2026-11-09T10:00:00Z' },
    { create_time: '2026-11-07T10:00:00Z' },
    { create_time: 'garbage' },
  ];

  it('counts stores newer than the cut-off and ignores bad dates', () => {
    expect(countStoresCreatedSince(stores, Date.parse('2026-11-08T12:00:00Z'))).toBe(1);
  });

  it('handles a missing list', () => {
    expect(countStoresCreatedSince(undefined)).toBe(0);
  });
});

describe('toPercent', () => {
  it('returns 0 when the browser reports no total', () => {
    expect(toPercent(500, undefined)).toBe(0);
  });

  it('rounds and caps at 100', () => {
    expect(toPercent(1, 3)).toBe(33);
    expect(toPercent(12, 10)).toBe(100);
  });
});
