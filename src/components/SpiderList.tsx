import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CATEGORY_LABELS, type Category, type Spider } from '../data/schema';
import { matchesQuery } from '../data/search';
import { useUserMarks } from '../storage/useUserMarks';
import { useListState } from '../storage/ListStateContext';
import { SearchBar } from './SearchBar';
import { FilterChips } from './FilterChips';
import { SpiderCard } from './SpiderCard';
import { EmptyState } from './EmptyState';

interface Props {
  spiders: Spider[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const CATEGORY_ORDER: Category[] = ['cz', 'tarantula'];
const collator = new Intl.Collator('cs');

export const SpiderList = ({ spiders, selectedId, onSelect }: Props) => {
  const { query, setQuery, filter, setFilter } = useListState();
  const { marks, isFavorite, isSeen } = useUserMarks();

  const sections = useMemo(() => {
    const visible = spiders
      .filter((s) => matchesQuery(s, query))
      .filter((s) =>
        filter === 'favorites' ? isFavorite(s.id) : filter === 'seen' ? isSeen(s.id) : true,
      )
      .sort((a, b) => {
        const fav = Number(isFavorite(b.id)) - Number(isFavorite(a.id)); // oblíbení první
        return fav !== 0 ? fav : collator.compare(a.nameCs, b.nameCs);
      });
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: visible.filter((s) => s.category === category),
    })).filter((sec) => sec.items.length > 0);
  }, [spiders, query, filter, isFavorite, isSeen]);

  const multipleCategories = new Set(spiders.map((s) => s.category)).size > 1;
  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <Stack spacing={1.5} sx={{ p: 2, pb: 4 }}>
      <SearchBar value={query} onChange={setQuery} />
      <FilterChips
        value={filter}
        onChange={setFilter}
        favoritesCount={marks.favorites.length}
        seenCount={Object.keys(marks.seen).length}
      />

      {total === 0 && filter === 'favorites' && (
        <EmptyState
          emoji="💚"
          title="Zatím žádný oblíbený pavouk"
          hint="Otevři pavouka a klepni na srdíčko."
        />
      )}
      {total === 0 && filter === 'seen' && (
        <EmptyState
          emoji="🔍"
          title="Zatím jsme žádného neviděli"
          hint="Až nějakého potkáš, označ ho v detailu."
        />
      )}
      {total === 0 && filter === 'all' && (
        <EmptyState emoji="🕸️" title="Nic jsme nenašli" hint="Zkus napsat jen část jména." />
      )}

      {sections.map((sec) => (
        <Box key={sec.category}>
          {multipleCategories && (
            <Typography
              variant="overline"
              sx={{ display: 'block', px: 1, pb: 0.5, fontWeight: 700 }}
            >
              {CATEGORY_LABELS[sec.category]}
            </Typography>
          )}
          <Stack spacing={1}>
            {sec.items.map((s) => (
              <SpiderCard
                key={s.id}
                spider={s}
                selected={s.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};
