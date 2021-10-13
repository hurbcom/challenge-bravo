import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    scenarios: {
      constant_request_rate: {
        executor: 'constant-arrival-rate',
        rate: 2000,
        timeUnit: '1s',
        duration: '20s',
        preAllocatedVUs: 300,
        maxVUs: 400,
      },
    },
  };
  const array = ["USD","BRL","EUR","BTC","ETH"]
  export default function () {

    for (var id = 1; id <= 4; id++) {
        let res = http.get(`http://127.0.0.1:3000/?from=${array[id]}&to=${array[id-1]}&amount=${id+1}`);
        check(res, {
            'is status 200': (r) => r.status === 200,
        });
    }
  }