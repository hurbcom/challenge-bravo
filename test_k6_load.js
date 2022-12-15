
import http from 'k6/http';
import { check, sleep } from 'k6';

const ENDPOINT = 'http://localhost:8000/convert/';

const CURRENCIES = [
    'USD',
    'BRL',
    'EUR',
    'BTC',
    'ETH',
    'HURB',
    'GTA$'
]

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function getRandomCurrency() {
    return CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)]
}

export const options = {
    stages: [
        { duration: '15s', target: 100 },
        { duration: '40s', target: 1000 },
        { duration: '10s', target: 0 },

    ],
};

export default function () {
    const responses = http.batch([
      ['GET', `${ENDPOINT}?from=${getRandomCurrency()}&to=${getRandomCurrency()}&amount=${getRandomFloat(0.00001, 99999.99999, 2)}`, null, {}],
    ]);

    check(responses[0], {
      'main page status was 200': (res) => res.status === 200,
    });

    sleep(1)
}
