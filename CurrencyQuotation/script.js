import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 3000,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:5000/api/Currencies/convert?from=CAD&to=BRL&amount=150.80');
  sleep(1);
}