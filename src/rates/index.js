const rates = {
  USD: null,
  BRL: null,
  EUR: null,
  BTC: null,
  ETH: null
}
// API symbols
const symbols = Object
  .entries(rates)
  .reduce((prev, curr, index) => prev + `${index ? ',' : ''}` + curr[0], '')

/**
 * @description Retorna a URL para requisição da API
 * @param {String} appId
 * @returns {String}
 */
const API = (appId) =>
  `https://openexchangerates.org/api/latest.json?app_id=${appId}&show_alternative=true&symbols=${symbols}`

/**
 * @description Atualiza as cotações das moedas através de uma chamada de API
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @param {FetchFunction} fetch
 * @returns {<Promise>}
 */
const update = (fetch, process) => {
  return fetch(API(process.env.APP_ID))
    .then(res => res.json())
    .then(res => Object.assign(rates, res.rates))
}

/**
 * @description Retorna a cotação de uma moeda ou de todas
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @param {String} [currency=null]
 * @returns {<Promise>}
 */
const get = (currency = null) => {
  let res = Object.assign({}, rates)
  if (!currency) {
    return res
  }
  return rates[currency]
}

module.exports = Object.assign({}, {
  update,
  get
})
