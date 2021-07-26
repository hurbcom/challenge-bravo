import { ReactNode } from 'react';

import { CurrenciesProvider } from './currencies';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <CurrenciesProvider>{children}</CurrenciesProvider>;
}
