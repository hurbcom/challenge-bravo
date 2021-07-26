import { api } from '../configs';

interface DeleteCurrencyProps {
  code: string;
}

export async function deleteCurrency({
  code,
}: DeleteCurrencyProps): Promise<void> {
  await api.delete(`/currencies/${code}`);
}
