const { get } = require('k6/http');

export const options = {
    vus: 1,
    duration: '10s',
};

export default () => {
    get(`http://localhost:3000/conversion?from=USD&to=BRL&value=1`);
};
