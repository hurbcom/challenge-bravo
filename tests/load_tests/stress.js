import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '15s', target: 1000 },
        { duration: '30s', target: 1000 },
        { duration: '15s', target: 0 },

    ],
};

export default function () {
    const res = http.get('http://api:8000/convert/?source=BRL&target=USD&amount=1');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
  }