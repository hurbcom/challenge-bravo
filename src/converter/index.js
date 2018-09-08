const { curry } = require('ramda')
const rates = require('../rates')

/**
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @description Converte uma moeda de origem para uma de destino
 * @param {String} from
 * @param {String} to
 * @param {Number} value
 * @returns {Number}
 */
const convert = (from, to, value) => {
  return (value * (1 / rates.get(from))) / (1 / rates.get(to))
}

/**
 * @author Felipe Rita <felipelopesrita@gmail.com>
 * @description Recebe uma função curry e retorna um objeto que a cada chave acrescenta um valor na função
 *  Por exemplo: (['a', 'b'], fn).a().b()
 * @param {String[]} props
 * @param {Function} curried
 */
let append = (props, curried) => {
  if (!props.length) {
    return curried
  }
  let ret = {}
  ret[props[0]] = (param) => append(props.slice(1, props.length), curried(param))
  return ret
}

module.exports = append(['from', 'to', 'value'], curry(convert))
