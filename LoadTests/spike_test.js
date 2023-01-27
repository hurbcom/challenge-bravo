import http from 'k6/http'

export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        {duration: '10s', target: 100},
        {duration: '1m', target: 200},
        {duration: '10s', target: 1500},
        {duration: '3m', target: 1500},
        {duration: '10s', target: 100},
        {duration: '3m', target: 100},
        {duration: '10s', target: 0},
    ]
};

const API_BASE_URL = "http://localhost:5100/api";

export default () => {
    http.batch([
        ['GET', API_BASE_URL+'/convert?from=brl&to=btc&amount=5132.12'],
        ['GET', API_BASE_URL+'/convert?from=usd&to=brl&amount=5132.12'],
        ['GET', API_BASE_URL+'/convert?from=eth&to=eth&amount=5132.12'],
    ]);
};