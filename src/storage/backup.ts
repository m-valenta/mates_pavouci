import type { Spider } from '../data/schema';
import type { UserMarks } from './useUserMarks';

/**
 * Záloha značek do krátkého kódu vhodného do URL.
 * Pavouci jsou zapsaní stálým číslem `num` (base36), ne id, aby byl kód co nejkratší.
 * Formát před kompresí: `2|<num>[F][S<dny>]|<num>...`, num a dny (od 1. 1. 2020) v base36.
 * Příznaky F (oblíbený) a S (viděn) jsou velká písmena, která se v base36 nevyskytují.
 * Kód začíná písmenem: `z` = deflate-raw + base64url, `p` = jen base64url (starý prohlížeč).
 */

const VERSION = '2';
const EPOCH = Date.UTC(2020, 0, 1);
const DAY = 86_400_000;
export const MAX_LINK_LENGTH = 2000;

const toDays = (iso: string) =>
  Math.max(0, Math.round((Date.parse(iso) - EPOCH) / DAY)).toString(36);
const fromDays = (b36: string) =>
  new Date(EPOCH + parseInt(b36, 36) * DAY).toISOString().slice(0, 10);

const b64url = {
  encode: (bytes: Uint8Array) =>
    btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''),
  decode: (s: string) =>
    Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)),
};

async function pipe(bytes: Uint8Array, stream: GenericTransformStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

type Lookup = Pick<Spider, 'id' | 'num'>[];

export function serialize(marks: UserMarks, spiders: Lookup): string {
  const entries = spiders
    .filter((s) => marks.favorites.includes(s.id) || s.id in marks.seen)
    .sort((a, b) => a.num - b.num)
    .map((s) => {
      const f = marks.favorites.includes(s.id) ? 'F' : '';
      const seen = marks.seen[s.id];
      const sd = seen ? `S${toDays(seen)}` : '';
      return `${s.num.toString(36)}${f}${sd}`;
    });
  return [VERSION, ...entries].join('|');
}

export function deserialize(text: string, spiders: Lookup): UserMarks {
  const [version, ...entries] = text.split('|');
  if (version !== VERSION) throw new Error('Neznámý formát zálohy');
  const byNum = new Map(spiders.map((s) => [s.num, s.id]));
  const favorites: string[] = [];
  const seen: Record<string, string> = {};
  for (const entry of entries) {
    const m = entry.match(/^([0-9a-z]+)(F)?(?:S([0-9a-z]+))?$/);
    if (!m) throw new Error('Poškozený kód');
    const id = byNum.get(parseInt(m[1], 36));
    if (!id) continue; // pavouk, kterého tahle verze dat nezná
    if (m[2]) favorites.push(id);
    if (m[3]) seen[id] = fromDays(m[3]);
  }
  return { favorites, seen };
}

export async function encodeBackup(marks: UserMarks, spiders: Lookup): Promise<string> {
  const bytes = new TextEncoder().encode(serialize(marks, spiders));
  if (typeof CompressionStream === 'function') {
    return 'z' + b64url.encode(await pipe(bytes, new CompressionStream('deflate-raw')));
  }
  return 'p' + b64url.encode(bytes);
}

export async function decodeBackup(code: string, spiders: Lookup): Promise<UserMarks> {
  const kind = code[0];
  const body = code.slice(1).trim();
  if (!body) throw new Error('Prázdný kód');
  let bytes = b64url.decode(body);
  if (kind === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  else if (kind !== 'p') throw new Error('Neznámý formát zálohy');
  return deserialize(new TextDecoder().decode(bytes), spiders);
}

/** Odkaz, po jehož otevření aplikace nabídne obnovu. Část za # se na server neposílá. */
export const backupLink = (code: string) =>
  `${location.origin}${location.pathname}#/obnovit?d=${code}`;

/** Z odkazu nebo holého kódu vytáhne kód. */
export function extractCode(input: string): string {
  const trimmed = input.trim();
  const m = trimmed.match(/[?&]d=([A-Za-z0-9_-]+)/);
  return m ? m[1] : trimmed;
}

/** Sloučení: sjednocení oblíbených, u viděných zůstává starší datum. */
export function mergeMarks(current: UserMarks, incoming: UserMarks): UserMarks {
  const favorites = [...new Set([...current.favorites, ...incoming.favorites])];
  const seen = { ...incoming.seen };
  for (const [id, date] of Object.entries(current.seen)) {
    seen[id] = seen[id] && seen[id] < date ? seen[id] : date;
  }
  return { favorites, seen };
}
