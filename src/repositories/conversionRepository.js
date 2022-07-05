const axios = require('axios');

module.exports = {
  getCurrency
}

async function getCurrency(currency) {
  try {
    var url = process.env.EXCHANGE_RATE_URL + `/latest/${currency}`;

    var data = '';

    await axios.get(url)
      .then(response => {
        data = response.data;
      })
      .catch(error => {
        return error;
      });

    return data;
  } catch (error) {
    res.status(500).send(error);
  }
}