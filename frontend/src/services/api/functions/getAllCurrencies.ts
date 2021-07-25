import { Currency } from '~/interfaces/Currency';

import { api } from '../configs';

export async function getAllCurrencies(): Promise<{ currencies: Currency[] }> {
  const { data } = await api.get<{ currencies: Currency[] }>('/currencies');

  const { currencies } = data;

  return { currencies };
}
