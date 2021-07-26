import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  SetStateAction,
  Dispatch,
  useMemo,
} from 'react';

import { Currency } from '~/interfaces/Currency';

import { getAllCurrencies } from '~/services/api/functions/getAllCurrencies';

interface CurrenciesProviderProps {
  children: ReactNode;
}

interface CurrenciesContextData {
  currencies: Currency[];
  setCurrencies: Dispatch<SetStateAction<Currency[]>>;
  isLoading: boolean;
  currencyCodes: string[];
}

const CurrenciesContext = createContext<CurrenciesContextData>(
  {} as CurrenciesContextData,
);

function CurrenciesProvider({ children }: CurrenciesProviderProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currencyCodes = useMemo(
    () => currencies.map(currency => currency.code),
    [currencies],
  );

  useEffect(() => {
    getAllCurrencies()
      .then(({ currencies: data }) => setCurrencies(data))
      .catch(() => {
        // console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <CurrenciesContext.Provider
      value={{ currencies, setCurrencies, isLoading, currencyCodes }}
    >
      {children}
    </CurrenciesContext.Provider>
  );
}

function useCurrencies(): CurrenciesContextData {
  const context = useContext(CurrenciesContext);

  if (!context) {
    throw new Error('useCurrencies must be used within an CurrenciesProvider');
  }

  return context;
}

export { CurrenciesProvider, useCurrencies };
