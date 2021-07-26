import { Currency } from '~/interfaces/Currency';

import { api } from '../configs';

interface CreateCurrencyProps {
  code: string;
  backingCurrency: {
    code: string;
    amount: number;
  };
}

export async function createCurrency({
  code,
  backingCurrency,
}: CreateCurrencyProps): Promise<Currency> {
  const { data } = await api.post<{ currency: Currency }>('/currencies', {
    code,
    backingCurrency,
  });

  return data.currency;
}
