export interface ExternalCurrencyAPI {
  convert(from: string, to: string): Promise<string>;
}