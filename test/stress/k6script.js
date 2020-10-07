import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// A simple counter for http requests

export const requests = new Counter('http_reqs');

// you can specify stages of your test (ramp up/down patterns) through the options object
// target is the number of VUs you are aiming for

export const options = {
  stages: [
    { target: 20, duration: '0.01m' },
    { target: 15, duration: '0.01m' },
    { target: 0, duration: '0.01m' },
  ],
  thresholds: {
    requests: ['count < 100'],
  },
};

export default function() {
  // our HTTP request, note that we are saving the response to res, which can be accessed later

  const res = http.get('http://localhost/api/v1');

  sleep(1);

  const checkRes = check(res, {
    'status is 200': r => r.status === 200,
    'response body': r => r.body.indexOf('Feel free to browse') !== -1,
  });
}