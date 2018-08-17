var currencies = {
  /* lastro */
  "USD": 1
}

function add(currency, value) {
  currencies[currency] = value
}

function get(currency) {
  var curr = currencies[currency]
  return curr
}

function convert(from, to, amount) {
  aValue = get(from)
  tValue = get(to)
  return amount / aValue * tValue
}

module.exports = {
  add: (currency, value) => add(currency, value),
  get: (currency) => get(currency),
  convert: (from, to, amount) => convert(from, to, amount),
  getAll: () => Object.assign(currencies)
}
