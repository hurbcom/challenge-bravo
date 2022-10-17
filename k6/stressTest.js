import { sleep } from 'k6';
import { batch } from 'k6/http';

export const options = {
    stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '2m', target: 500 },
        { duration: '5m', target: 500 },
        { duration: '2m', target: 700 },
        { duration: '5m', target: 700 },
        { duration: '10m', target: 0 },
    ],
};

export default function () {
    batch([
        ['GET', `http://localhost:3000/conversion?from=USD&to=BRL&value=1`],
        ['GET', `http://localhost:3000/conversion?from=BRL&to=USD&value=100`],
        ['GET', `http://localhost:3000/conversion?from=USD&to=BRL&value=10999`],
    ]);

    sleep(1);
}
