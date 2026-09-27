import type { Spider } from './schema';

/** Lowercase bez diakritiky, aby „krizak“ našlo „Křižák“. */
export const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const matchesQuery = (spider: Spider, query: string) => {
  const q = normalize(query);
  if (!q) return true;
  return [spider.nameCs, spider.nameLat, spider.family ?? ''].some((v) => normalize(v).includes(q));
};

export const MONTHS_SHORT = [
  'led',
  'úno',
  'bře',
  'dub',
  'kvě',
  'čvn',
  'čvc',
  'srp',
  'zář',
  'říj',
  'lis',
  'pro',
];

export const formatMm = ([min, max]: [number, number]) =>
  min === max ? `${min} mm` : `${min}–${max} mm`;
