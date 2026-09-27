// Finds freely licensed photos on Wikimedia Commons for every spider without photos,
// downloads them, converts to WebP (large + thumbnail) and writes author/license into spiders.json.
// Usage: npm run fetch-photos [-- --force] [-- --only=<id>]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { SpiderListSchema, type Photo, type Spider } from '../src/data/schema';

const UA = 'spider-enc-family-project/0.1 (https://github.com/ ; family encyclopedia)';
const PER_SPIDER = 3;
const MIN_WIDTH = 800;
const ALLOWED_LICENSE = /^(CC0|CC BY( |-SA )\d(\.\d)?|Public domain)/i;

const root = resolve(import.meta.dirname, '..');
const dataPath = resolve(root, 'public/data/spiders.json');
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.find((a) => a.startsWith('--only='))?.slice('--only='.length);

interface CommonsPage {
  title: string;
  imageinfo: {
    width: number;
    height: number;
    mime: string;
    thumburl: string;
    descriptionurl: string;
    extmetadata?: Record<string, { value: string }>;
  }[];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string | URL, tries = 5): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status !== 429 || attempt === tries) return res;
    const wait = attempt * 5000;
    console.warn(`  … 429, čekám ${wait / 1000}s`);
    await sleep(wait);
  }
}

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

async function searchCommons(latin: string): Promise<CommonsPage[]> {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `"${latin}" filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '15',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime',
    iiurlwidth: '1400',
    iiextmetadatafilter: 'Artist|LicenseShortName',
  }).toString();
  const res = await fetchWithRetry(url);
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  const json = (await res.json()) as { query?: { pages?: Record<string, CommonsPage> } };
  return Object.values(json.query?.pages ?? {});
}

async function download(url: string): Promise<Buffer> {
  const res = await fetchWithRetry(url);
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processSpider(spider: Spider): Promise<Photo[]> {
  const pages = await searchCommons(spider.nameLat);
  const candidates = pages
    .filter((p) => p.imageinfo?.[0])
    .filter((p) => /^image\/(jpeg|png)$/.test(p.imageinfo[0].mime))
    .filter((p) => p.imageinfo[0].width >= MIN_WIDTH)
    .filter((p) => ALLOWED_LICENSE.test(p.imageinfo[0].extmetadata?.LicenseShortName?.value ?? ''))
    .slice(0, PER_SPIDER);

  const dir = resolve(root, 'public/images', spider.id);
  mkdirSync(dir, { recursive: true });
  const photos: Photo[] = [];

  for (const [i, page] of candidates.entries()) {
    const info = page.imageinfo[0];
    const n = i + 1;
    try {
      await sleep(1500);
      const buf = await download(info.thumburl);
      await sharp(buf)
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(resolve(dir, `${n}.webp`));
      await sharp(buf)
        .rotate()
        .resize({ width: 320, height: 320, fit: 'cover' })
        .webp({ quality: 75 })
        .toFile(resolve(dir, `${n}-thumb.webp`));
      photos.push({
        src: `images/${spider.id}/${n}.webp`,
        thumb: `images/${spider.id}/${n}-thumb.webp`,
        alt: spider.nameCs,
        author: stripHtml(info.extmetadata?.Artist?.value ?? 'neznámý autor') || 'neznámý autor',
        license: info.extmetadata?.LicenseShortName?.value ?? '',
        sourceUrl: info.descriptionurl,
      });
      console.log(`  ✓ ${page.title} (${photos[photos.length - 1].license})`);
    } catch (err) {
      console.warn(`  ✗ ${page.title}: ${(err as Error).message}`);
    }
  }
  return photos;
}

const spiders = SpiderListSchema.parse(JSON.parse(readFileSync(dataPath, 'utf8')));
for (const spider of spiders) {
  if (only && spider.id !== only) continue;
  if (spider.photos.length > 0 && !force) continue;
  console.log(`${spider.nameCs} (${spider.nameLat})`);
  spider.photos = await processSpider(spider);
  if (spider.photos.length === 0) console.warn('  ⚠️  nic vhodného nenalezeno');
  writeFileSync(dataPath, JSON.stringify(spiders, null, 2) + '\n'); // průběžné ukládání
  await sleep(2000);
}
console.log('Hotovo, spiders.json aktualizován.');
