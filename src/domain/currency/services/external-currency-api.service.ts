export interface ExternalCurrencyAPI {
  convert(from: string, to: string, amount: string): Promise<string>;
}