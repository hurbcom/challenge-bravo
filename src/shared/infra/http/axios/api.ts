import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXCHANGE_API_BASE_URL,
  headers: {
    "X-CoinAPI-Key": process.env.EXCHANGE_API_KEY,
  },
});

export { api };
