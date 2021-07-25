import { api } from '../configs';

interface ConvertCurrencyProps {
  from: string;
  to: string;
  amount: number;
}

export async function convertCurrency({
  from,
  to,
  amount,
}: ConvertCurrencyProps): Promise<number> {
  const { data } = await api.get<{ result: number }>('/currency-converter', {
    params: {
      from,
      to,
      amount,
    },
  });

  return data.result;
}
