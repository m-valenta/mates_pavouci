import { createContext, useContext, type ReactNode } from 'react';
import type { Spider } from './schema';

const SpidersContext = createContext<Spider[]>([]);

export const SpidersProvider = ({
  spiders,
  children,
}: {
  spiders: Spider[];
  children: ReactNode;
}) => <SpidersContext.Provider value={spiders}>{children}</SpidersContext.Provider>;

export const useSpiderList = () => useContext(SpidersContext);
export const useSpider = (id: string | undefined) => useSpiderList().find((s) => s.id === id);
