import axios from 'axios'
import { QUOTATION_API } from './connections'

const baseURL = QUOTATION_API

export const quotationApi = axios.create({
    baseURL
});