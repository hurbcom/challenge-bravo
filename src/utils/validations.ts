export const validCurrencyCodes: (...currencies: string[]) => boolean = (...currencies) => {
    return currencies.filter((currency: string) => /^([A-Z]{3})$/.test(currency)).length === currencies.length;
};
