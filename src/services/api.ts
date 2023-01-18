import axios from 'axios'
import { QUOTATION_API } from './connections'

const baseURL = QUOTATION_API

const quotationApi = axios.create({
    baseURL
})

export default quotationApi