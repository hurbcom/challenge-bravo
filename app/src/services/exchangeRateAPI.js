const axios = require('axios');
import { env } from '../config';

async function getRate(from, to) {
    const response = await axios.get(`${env.api.url}?fsym=${from}&tsyms=${to}`);
    
    return response.data;
}

export {
    getRate
}