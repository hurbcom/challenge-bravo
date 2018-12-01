/**
 * Arquivo: converter.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por realizar a conversão das moedas.
 * Data: 01/12/2018
 */ 

'use strict'

const converter = async(rates, to, from, amount) => {
    let valor =   await(amount * (rates[to] / rates[from])).toFixed(2);        
    const result = Object.assign({from: from, to: to, amount: amount, result: valor});
	return result;
}

module.exports = (rates, to, from, amount) => {
	return converter(rates, to, from, amount).then(result => result).catch(erro => Console.log(erro));
}