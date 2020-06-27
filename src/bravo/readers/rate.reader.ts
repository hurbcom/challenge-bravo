
export class RateReader {
  public static read(rate: any, currencyName: string): number {
    if(!rate && !rate.data) {
      throw new Error('Rate tax not found');
    }

    const data: any = rate.data;
    if(!data.rates) {
      throw new Error('Rate wrong format');
    }

    return data.rates[currencyName];
  }
}
