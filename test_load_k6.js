
import http from 'k6/http';
import { check, sleep } from 'k6';

const ENDPOINT = 'https://challengebravo-assisthiago.herokuapp.com/convert/';

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
        { duration: '5s', target: 1000 },
        { duration: '45s', target: 1000 },
        { duration: '10s', target: 0 },
    ],
};

export default function () {
    const res = http.get(`${ENDPOINT}?from=${getRandomCurrency()}&to=${getRandomCurrency()}&amount=${getRandomFloat(0.00001, 99999.99999, 2)}`);
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
