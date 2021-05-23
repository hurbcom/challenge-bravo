interface ICreateCurrencyDTO {
  currencyCode: string;
  currencyName: string;
  priceUsd: number;
  isFictional: boolean;
}

export { ICreateCurrencyDTO };
