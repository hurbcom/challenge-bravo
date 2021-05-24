import axios from "axios";

const api = axios.create({
  baseURL: "http://api.currencylayer.com",
  params: {
    access_key: process.env.EXCHANGE_API_KEY,
  },
});

export { api };
