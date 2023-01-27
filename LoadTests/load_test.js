import http from 'k6/http'

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        {duration: '2m', target: 100},
        {duration: '5m', target: 200},
        {duration: '2m', target: 0},
    ],
    thresholds: {
        http_req_duration: ['p(99)<75']
    },
};

const API_BASE_URL = "http://localhost:5100/api";

export default () => {

    http.batch([
        ['GET', API_BASE_URL+'/convert?from=brl&to=btc&amount=5132.12'],
        ['GET', API_BASE_URL+'/convert?from=usd&to=brl&amount=5132.12'],
        ['GET', API_BASE_URL+'/convert?from=eth&to=eth&amount=5132.12'],
    ]);
};