const API = 'https://openexchangerates.org/api/latest.json?app_id=7c785382c5e840f6808c4f884560051b&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH'
const rates = {}

/**
 * @description Atualiza as cotações das moedas através de uma chamada de API
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @param {FetchFunction} fetch
 * @returns {<Promise>}
 */
const update = (fetch) => {
  return fetch(API)
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
