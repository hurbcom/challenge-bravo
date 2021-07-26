import { Currency } from '~/interfaces/Currency';

import { api } from '../configs';

interface CreateCurrencyProps {
  code: string;
  backingCurrency: {
    code: string;
    amount: number;
  };
}

export async function updateCurrency({
  code,
  backingCurrency,
}: CreateCurrencyProps): Promise<Currency> {
  const { data } = await api.put<{ currency: Currency }>(
    `/currencies/${code}`,
    {
      backingCurrency,
    },
  );

  return data.currency;
}
