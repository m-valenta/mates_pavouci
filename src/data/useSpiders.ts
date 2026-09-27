import { useEffect, useState } from 'react';
import { SpiderListSchema, type Spider } from './schema';

type State =
  | { status: 'loading' }
  | { status: 'ready'; spiders: Spider[] }
  | { status: 'error'; message: string };

/** Loads and validates public/data/spiders.json once per page load. */
export function useSpiders(): State {
  const [state, setState] = useState<State>({ status: 'loading' });
  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data/spiders.json`;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => setState({ status: 'ready', spiders: SpiderListSchema.parse(json) }))
      .catch((e: Error) => setState({ status: 'error', message: e.message }));
  }, []);
  return state;
}
