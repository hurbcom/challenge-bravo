export default class CurrencyMongoMappers {
  static toDomain (currenciesMongo) {
    let obj = {}
    obj = { base: currenciesMongo[0].base, rates: {}, updated: currenciesMongo[0].updated }
    for (const i in currenciesMongo) {
      const { code, price } = currenciesMongo[i]
      obj.rates[code] = price
    }

    return obj
  }
}
