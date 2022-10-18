import { sleep } from 'k6';
import { batch } from 'k6/http';

export const options = {
    stages: [{ duration: '1m', target: 1000 }],
};

export default function () {
    batch([
        ['GET', `http://localhost:3000/conversion?from=USD&to=BRL&value=1`],
        ['GET', `http://localhost:3000/conversion?from=BRL&to=BTC&value=100`],
        ['GET', `http://localhost:3000/conversion?from=BTC&to=BRL&value=109`],
        ['GET', `http://localhost:3000/conversion?from=USD&to=EUR&value=10999`],
        ['GET', `http://localhost:3000/conversion?from=USD&to=BTC&value=10999`],
        ['GET', `http://localhost:3000/conversion?from=BTC&to=USD&value=10999`],
        ['GET', `http://localhost:3000/conversion?from=USD&to=BRL&value=10999`],
        ['GET', `http://localhost:3000/conversion?from=USD&to=BRL&value=10999`],
        ['GET', `http://localhost:3000/conversion?from=USD&to=BRL&value=10999`],
        ['GET', `http://localhost:3000/conversion?from=USD&to=BRL&value=10999`],
    ]);

    sleep(1);
}
