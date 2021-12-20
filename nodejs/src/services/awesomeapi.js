const axios = require('axios').default;

const URL_API = "https://economia.awesomeapi.com.br/json";

const all = async () => {
    const res = await axios.get(`${URL_API}/all`)
    if(res.status == 200) return res.data;
    else return null;
};

module.exports = {
    all
}