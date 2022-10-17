import { check, sleep } from 'k6';
import { get, post } from 'k6/http';

export const options = {
    stages: [
        { duration: '5m', target: 100 },
        { duration: '10m', target: 100 },
        { duration: '5m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'],
    },
};

export default () => {
    get(`http://localhost:3000/conversion?from=USD&to=BRL&value=1`);
    sleep(1);
};
