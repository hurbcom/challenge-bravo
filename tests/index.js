const jest = require('jest');
const axios = require('axios');

// test if the GET /convert endpoint works
test('GET /convert returns converted value', () => {
  return axios.get('/convert?from=USD&to=EUR&amount=1')
});