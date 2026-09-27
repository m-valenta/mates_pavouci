import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Srdíčka a „viděli jsme“ žijí jen v prohlížeči (localStorage). Nic se neposílá na server.
const STORAGE_KEY = 'mates-pavouci:v1';

export interface UserMarks {
  favorites: string[];
  /** id pavouka -> datum (ISO), kdy jsme ho viděli */
  seen: Record<string, string>;
}

const EMPTY: UserMarks = { favorites: [], seen: {} };

function load(): UserMarks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<UserMarks>;
    return {
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites.filter((x) => typeof x === 'string')
        : [],
      seen: parsed.seen && typeof parsed.seen === 'object' ? parsed.seen : {},
    };
  } catch {
    return EMPTY;
  }
}

function save(marks: UserMarks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
  } catch {
    // soukromý režim nebo plné úložiště: nic nezachráníme, ale aplikace běží dál
  }
}

interface UserMarksApi {
  marks: UserMarks;
  isFavorite: (id: string) => boolean;
  isSeen: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  toggleSeen: (id: string) => void;
  replaceAll: (marks: UserMarks) => void;
}

const Ctx = createContext<UserMarksApi | null>(null);

export const UserMarksProvider = ({ children }: { children: ReactNode }) => {
  const [marks, setMarks] = useState<UserMarks>(load);
  useEffect(() => save(marks), [marks]);

  const api = useMemo<UserMarksApi>(
    () => ({
      marks,
      isFavorite: (id) => marks.favorites.includes(id),
      isSeen: (id) => id in marks.seen,
      toggleFavorite: (id) =>
        setMarks((m) => ({
          ...m,
          favorites: m.favorites.includes(id)
            ? m.favorites.filter((x) => x !== id)
            : [...m.favorites, id],
        })),
      toggleSeen: (id) =>
        setMarks((m) => {
          const seen = { ...m.seen };
          if (id in seen) delete seen[id];
          else seen[id] = new Date().toISOString().slice(0, 10);
          return { ...m, seen };
        }),
      replaceAll: (next) => setMarks(next),
    }),
    [marks],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};

export function useUserMarks(): UserMarksApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUserMarks musí být uvnitř UserMarksProvider');
  return ctx;
}

/** Stabilní callbacky pro jednoho pavouka. */
export function useSpiderMarks(id: string) {
  const { isFavorite, isSeen, toggleFavorite, toggleSeen } = useUserMarks();
  return {
    favorite: isFavorite(id),
    seen: isSeen(id),
    toggleFavorite: useCallback(() => toggleFavorite(id), [toggleFavorite, id]),
    toggleSeen: useCallback(() => toggleSeen(id), [toggleSeen, id]),
  };
}
