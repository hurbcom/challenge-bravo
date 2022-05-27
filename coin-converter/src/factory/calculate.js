
/**
 * Calcular a conversão da moeda utilizando a moeda base como referencia
 * @param {Number} quoteFrom Cotação de origem
 * @param {Number} value Quantia a ser convertida
 * @param {Number} quoteTo Cotação de destino
 * @author Fellipe Maia
 * @returns Valor convertido para cotação de destino
 */
exports.conversion = (quoteFrom, value, quoteTo) => {
    const valueInUSD = quoteFrom * value
    const valueTo = valueInUSD / quoteTo
    return valueTo
}