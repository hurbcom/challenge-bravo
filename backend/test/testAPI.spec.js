const axios = require('axios');
const chai = require('chai');

require('../configs/bootstrap');
const { enums } = require('../configs/enums');
const { Logs } = require('../models/schemas/logs');
const { match } = require('assert');
const test = require('./testCases/tests.json');

shuffle(test);
const baseUrl = `http://localhost:${enums.apiPort}`;

describe('Test API', async () => {
  for (let i = 0; i < 3; i++) {
    await describe(`Test ==> ${i + 1}`, async () => {
      it(`from ${test[i].from} to ${test[i].to}`, async () => {
        const coin1 = test[i].from;
        const coin2 = test[i].to;
        const amount = test[i].amount;
        const t1 = (
          await bot(
            `${baseUrl}/test/?from=${coin1}&to=${coin2}&amount=${amount}`
          )
        ).total;
        chai.expect(test[i].total).to.eql(round(t1, 4));
      }).timeout(60);
    });
  }
});

/**
 * Execute request at the desired URL.
 * @param {String} url Url that you want to perform a get.
 * @returns Request data
 */
async function bot(url) {
  return (
    await axios({
      method: 'get',
      url: url,
      timeout: 1000 * 5, // Wait for 5 seconds
      data: { prod: false, test: true },
    })
  ).data;
}

/**
 * Rounds the desired number one x decimal places
 * @param {Number} num Number.
 * @param {Number} places Decimal places.
 * @returns Expected return 1.01 to 2 decimal places
 */
const round = (num, places) => {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + places) + 'e-' + places);
  } else {
    let arr = ('' + num).split('e');
    let sig = '';
    if (+arr[1] + places > 0) {
      sig = '+';
    }

    return +(
      Math.round(+arr[0] + 'e' + sig + (+arr[1] + places)) +
      'e-' +
      places
    );
  }
};

/**
 * Shuffles a given array
 * @param {Array} list Array
 */
function shuffle(list) {
  for (let indice = list.length; indice; indice--) {
    const indiceAleatorio = Math.floor(Math.random() * indice);
    const elemento = list[indice - 1];
    list[indice - 1] = list[indiceAleatorio];
    list[indiceAleatorio] = elemento;
  }
}
