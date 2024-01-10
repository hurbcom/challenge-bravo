import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL;

const getCurrencyValueInBallast = async (from: string, to: string) => {
    try {
        const ballast = "USD";
        const { data: usdToBRL } = await axios.get(`${API_URL}/all/${ballast}-BRL`);
    
        const usdToBRLResponse = usdToBRL[ballast];
    
        if (from === "BRL") {
            return 1 / Number(usdToBRLResponse.bid);
        }
    
        const { data: fromToBRL } = await axios.get(`${API_URL}/all/${from}-BRL`);
    
        const fromToBRLResponse = fromToBRL[from];
    
        if (!Number(fromToBRLResponse.bid)) {
            throw new Error();
        }
    
        return Number(fromToBRLResponse.bid) / Number(usdToBRLResponse.bid);
    } catch (error) {
        
    }
    return null
};


const getAllCurrenciesInApi = async (hash: string) => {
    const finalURL = `${API_URL}/last/${hash}`;
    const response = await axios.get(finalURL);
    return response.data;
};

const findOneInApi = async (hash: string) => {
    const finalURL = `${API_URL}/daily/${hash}/1`;
    const response = await axios.get(finalURL);
    return response.data;
};

export {
    getCurrencyValueInBallast,
    getAllCurrenciesInApi,
    findOneInApi
}