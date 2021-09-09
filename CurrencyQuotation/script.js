import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1000,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:20000/api/Currencies?from=CAD&to=BRL&amount=150.80');
  sleep(1);
}