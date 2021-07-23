export interface ICurrencyConverterProvider {
  convert({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: number;
  }): Promise<number>;
}
