import http from 'k6/http';
import { check, sleep } from 'k6';
import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';


// export let options = {
//     stages: [
//       { duration: '10s', target: 20 },
//       { duration: '30s', target: 100 },
//       { duration: '10s', target: 20 },
//     ],
//   };
// export default function () {
//   let res = http.get('127.0.0.1:3000/?from=ADA&to=USD&amount=1');
//   check(res, { 'status was 200': (r) => r.status == 200 });
//   sleep(1);
// }


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