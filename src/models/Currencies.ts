class Currency {
    ask : string
    code: string
    constructor (param: any) {
      this.ask = param.ask
      this.code = param.code
    }
}

class Currencies {
    USD : Currency
    USDT: Currency
    CAD : Currency
    EUR : Currency
    GBP : Currency
    ARS : Currency
    BTC : Currency
    LTC : Currency
    JPY : Currency
    CHF : Currency
    AUD : Currency
    CNY : Currency
    ILS : Currency
    ETH : Currency
    XRP : Currency
    BRL : Currency

    constructor (params: any) {
      this.USD = params.USD
      this.USDT = params.USDT
      this.CAD = params.CAD
      this.EUR = params.EUR
      this.GBP = params.GBP
      this.ARS = params.ARS
      this.BTC = params.BTC
      this.LTC = params.LTC
      this.JPY = params.JPY
      this.CHF = params.CHF
      this.AUD = params.AUD
      this.CNY = params.CNY
      this.ILS = params.ILS
      this.ETH = params.ETH
      this.XRP = params.XRP
      this.BRL = params.BRL
    }
}

export default Currencies
