// Validates public/data/spiders.json against the schema and checks that photo files exist.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { SpiderListSchema } from '../src/data/schema';

const root = resolve(import.meta.dirname, '..');
const dataPath = resolve(root, 'public/data/spiders.json');

const raw = JSON.parse(readFileSync(dataPath, 'utf8'));
const result = SpiderListSchema.safeParse(raw);

if (!result.success) {
  console.error('❌ spiders.json neodpovídá schématu:');
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

let missing = 0;
for (const spider of result.data) {
  if (spider.photos.length === 0) console.warn(`⚠️  ${spider.nameCs}: žádná fotka`);
  for (const photo of spider.photos) {
    for (const rel of [photo.src, photo.thumb].filter(Boolean) as string[]) {
      if (!existsSync(resolve(root, 'public', rel))) {
        console.error(`❌ ${spider.nameCs}: chybí soubor public/${rel}`);
        missing++;
      }
    }
  }
}

if (missing > 0) process.exit(1);
console.log(`✅ ${result.data.length} pavouků v pořádku`);
