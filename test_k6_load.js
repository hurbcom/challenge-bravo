
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
    scenarios: {
        constant_request_rate: {
            executor: 'constant-arrival-rate',
            rate: 1000,
            timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
            duration: '30s',
            preAllocatedVUs: 100, // how large the initial pool of VUs would be
            maxVUs: 300, // if the preAllocatedVUs are not enough, we can initialize more
        },
    },
};

export default function () {
    const res = http.get(`${ENDPOINT}?from=${getRandomCurrency()}&to=${getRandomCurrency()}&amount=${getRandomFloat(0.00001, 99999.99999, 2)}`);
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
