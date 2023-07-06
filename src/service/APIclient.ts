import axios, { CanceledError } from 'axios';
import { BASE_URL } from '../config';

export default axios.create({
  baseURL: BASE_URL,
});

export { CanceledError };


