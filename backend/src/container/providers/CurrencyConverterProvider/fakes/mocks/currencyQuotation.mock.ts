// Cotações atualizadas em: 23/07/2021

export interface IQuotation {
  usd: number;
  brl: number;
  eur: number;
  btc: number;
  eth: number;
}

export const usd: Omit<IQuotation, 'usd'> = {
  brl: 5.17,
  eur: 0.85,
  btc: 0.000031,
  eth: 0.00049,
};

export const brl: Omit<IQuotation, 'brl'> = {
  usd: 0.19,
  eur: 0.16,
  btc: 0.000006,
  eth: 0.000094,
};

export const eur: Omit<IQuotation, 'eur'> = {
  usd: 1.18,
  brl: 6.09,
  btc: 0.000036,
  eth: 0.00057,
};

export const btc: Omit<IQuotation, 'btc'> = {
  usd: 32386.5,
  brl: 167651.96,
  eur: 27537.76,
  eth: 15.71,
};

export const eth: Omit<IQuotation, 'eth'> = {
  usd: 2059.92,
  brl: 10660.7,
  eur: 1751.77,
  btc: 0.063,
};
