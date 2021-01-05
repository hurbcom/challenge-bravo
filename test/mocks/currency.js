
const requestCurrencies = {
  rates: {
    CAD: 1.2784789512,
    HKD: 7.7526260077,
    ISK: 127.1069131178,
    PHP: 48.0628613305,
    DKK: 6.0575686019,
    HUF: 297.1093559156,
    CZK: 21.3761094373,
    GBP: 0.7353391418,
    RON: 3.9639280189,
    SEK: 8.1889096979,
    IDR: 14050.0040713297,
    INR: 73.1881768586,
    BRL: 5.1766142822,
    RUB: 74.8189072551,
    HRK: 6.1444507776,
    JPY: 103.0616399316,
    THB: 29.9397443205,
    CHF: 0.8840485302,
    EUR: 0.8142659393,
    MYR: 4.0369676736,
    BGN: 1.592541324,
    TRY: 7.35453139,
    CNY: 6.5250386776,
    NOK: 8.5880628613,
    NZD: 1.3900333849,
    ZAR: 14.6611025161,
    USD: 1,
    MXN: 19.8463480173,
    SGD: 1.3237521374,
    AUD: 1.3048611677,
    ILS: 3.2105691719,
    KRW: 1087.720869636,
    PLN: 3.7102027522
  },
  base: 'USD',
  date: '2020-12-30'
}

const supportedCurrencies = [
  'CAD',
  'HKD',
  'ISK',
  'PHP',
  'DKK',
  'HUF',
  'CZK',
  'GBP',
  'RON',
  'SEK',
  'IDR',
  'INR',
  'BRL',
  'RUB',
  'HRK',
  'JPY',
  'THB',
  'CHF',
  'EUR',
  'MYR',
  'BGN',
  'TRY',
  'CNY',
  'NOK',
  'NZD',
  'ZAR',
  'USD',
  'MXN',
  'SGD',
  'AUD',
  'ILS',
  'KRW',
  'PLN'
]

const requestResponse = { baseNumber: 50, conversion: 258.83071411000003 }

module.exports = {
  requestCurrencies,
  supportedCurrencies,
  requestResponse
}