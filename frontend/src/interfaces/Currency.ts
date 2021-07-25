export interface Currency {
  code: string;
  backingCurrency: {
    code: string;
    amount: number;
  };
}
