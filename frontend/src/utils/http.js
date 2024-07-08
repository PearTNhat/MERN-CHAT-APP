import axios from 'axios';
console.log(typeof process.env.REACT_APP_URL_SERVER);
export const http = axios.create({
    baseURL: process.env.REACT_APP_URL_SERVER,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});