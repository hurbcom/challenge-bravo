const axios = require('axios');
import { env } from '../../config';

async function getRatesFromApi({from, to, reference}) {
    const response = await axios.get(`${env.api.url}?fsym=${reference}&tsyms=${from},${to}`);
    
    return response.data;
}

export {
    getRatesFromApi
}