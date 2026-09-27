import { createContext, useContext, useState, type ReactNode } from 'react';

export type ListFilter = 'all' | 'favorites' | 'seen';

interface ListState {
  query: string;
  setQuery: (q: string) => void;
  filter: ListFilter;
  setFilter: (f: ListFilter) => void;
}

const Ctx = createContext<ListState | null>(null);

/** Stav vyhledávání a filtru přežije přechod na detail a zpět. */
export const ListStateProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ListFilter>('all');
  return <Ctx.Provider value={{ query, setQuery, filter, setFilter }}>{children}</Ctx.Provider>;
};

export function useListState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useListState musí být uvnitř ListStateProvider');
  return ctx;
}
