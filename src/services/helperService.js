const axios = require('axios');

module.exports = {
    async currencyApi() {
        try {
            return await axios.get('https://economia.awesomeapi.com.br/json/all');
        } catch (error) {
            return error;
        }
    }
} 