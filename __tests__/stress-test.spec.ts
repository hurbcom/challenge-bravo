import * as autocannon from 'autocannon'

autocannon.default({
  url: 'http://localhost:8080/currency/conversion?from=EUR&amount=1&to=BRL',
  connections: 50,
  amount: 1000,
  duration: 1,
}, console.log)