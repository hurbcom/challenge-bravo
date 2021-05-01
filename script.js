import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  vus: 3000,
  duration: '30s',
};
export default function () {
  http.get('http://localhost:49153/api/currencyconverter?from=BTC&to=EUR&amount=123.45');
  sleep(1);
}