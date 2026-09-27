import { z } from 'zod';

export const CategorySchema = z.enum(['cz', 'tarantula']);
export type Category = z.infer<typeof CategorySchema>;

export const CATEGORY_LABELS: Record<Category, string> = {
  cz: 'Čeští pavouci',
  tarantula: 'Sklípkani',
};

export const DangerSchema = z.enum(['neskodny', 'muze-kousnout', 'jedovaty']);
export type Danger = z.infer<typeof DangerSchema>;

export const DANGER_LABELS: Record<Danger, string> = {
  neskodny: 'Neškodný',
  'muze-kousnout': 'Může štípnout',
  jedovaty: 'Jedovatý',
};

const MmRange = z.tuple([z.number().nonnegative(), z.number().nonnegative()]);

export const PhotoSchema = z.object({
  src: z.string().min(1),
  thumb: z.string().min(1).optional(),
  alt: z.string().min(1),
  author: z.string().min(1),
  license: z.string().min(1),
  sourceUrl: z.string().url(),
});
export type Photo = z.infer<typeof PhotoSchema>;

export const SpiderSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'id musí být slug (malá písmena, číslice, pomlčky)'),
  /** Stálé pořadové číslo. Nikdy se nemění ani znovu nepoužívá, slouží v zálohách místo id. */
  num: z.number().int().positive(),
  category: CategorySchema,
  nameCs: z.string().min(1),
  nameLat: z.string().min(1),
  family: z.string().min(1).optional(),
  size: z.object({
    femaleMm: MmRange,
    maleMm: MmRange.optional(),
    note: z.string().optional(),
  }),
  lifespan: z.string().min(1),
  lifestyle: z.object({
    hunting: z.string().min(1),
    food: z.string().min(1),
    wintering: z.string().min(1),
  }),
  occurrence: z.object({
    czech: z.string().min(1),
    habitat: z.string().min(1),
    months: z.array(z.number().int().min(1).max(12)).optional(),
  }),
  dangerToHumans: DangerSchema,
  funFact: z.string().optional(),
  photos: z.array(PhotoSchema),
});
export type Spider = z.infer<typeof SpiderSchema>;

export const SpiderListSchema = z.array(SpiderSchema).superRefine((list, ctx) => {
  const seenIds = new Set<string>();
  const seenNums = new Set<number>();
  list.forEach((s, i) => {
    if (seenIds.has(s.id)) {
      ctx.addIssue({ code: 'custom', path: [i, 'id'], message: `Duplicitní id "${s.id}"` });
    }
    if (seenNums.has(s.num)) {
      ctx.addIssue({
        code: 'custom',
        path: [i, 'num'],
        message: `Duplicitní num ${s.num} (${s.id})`,
      });
    }
    seenIds.add(s.id);
    seenNums.add(s.num);
  });
});
