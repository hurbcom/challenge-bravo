const axios = require("axios");

const getRequest = async (url) => {
    const { data } = await axios.get(url);
    return data;
};

module.exports = getRequest;
