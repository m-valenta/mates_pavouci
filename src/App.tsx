import { useSpiders } from './data/useSpiders';

// Placeholder until the real UI (phase 2) lands: proves that data loading and validation work.
export default function App() {
  const data = useSpiders();
  if (data.status === 'loading') return <p>Načítám…</p>;
  if (data.status === 'error') return <p>Chyba: {data.message}</p>;
  return (
    <ul>
      {data.spiders.map((s) => (
        <li key={s.id}>
          {s.nameCs} ({s.photos.length} fotky)
        </li>
      ))}
    </ul>
  );
}
