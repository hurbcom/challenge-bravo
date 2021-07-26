import axios from 'axios';

console.log('process.env.API_URL', process.env.API_URL);

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3333',
});

export { api };
