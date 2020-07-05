
import currencies from "@mocks/data/symbols";

let taken: any = {};

/**
 * @about Gets a random unique currency that hasn't already been taken before
 * PS: It's necessary to clear the taken currencies after each test case.
 */
export const getRandomUniqueCurrency = () => {
  for (let i = 0; i < currencies.length; i++) {
    const { asset_id } = currencies[i];

    if (!taken[asset_id]) {
      taken[asset_id] = currencies[i];
      return currencies[i];
    }
  }

  throw new Error("No unique currencies are left from mocks");
}

export const clearTakenCurrencies = () => {
  taken = {};
}