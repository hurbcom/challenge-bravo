import Big from 'big.js';
import { Currency } from './domain/currency/entities/currency.entity';


const HURB = new Currency('123','HURB','0.19');
const BRL = new Currency('123','BRL','0.19');
const EUR = new Currency('123','EUR','0.97');
const USD = new Currency('123','USD', '1');
const USD2 = new Currency('123','USD', '1');

// console.log(HURB.convert(BRL, '16.50'));
console.log(BRL.convert(EUR, '5.20'));
console.log(USD.convert(USD2,'64'));

// const pica = new Big('2').prec(2).valueOf();

// console.log(pica);
