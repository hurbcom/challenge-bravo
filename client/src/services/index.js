//consumindo API de conversão
import { api } from "./../utils/api-instance";

export const getCoins = async () => {
    const result = await api.get("/coins");
    return result;
};

export const convertCoin = async (from, to, amount) => {
    const result = await api.get(
        `/coin/conversion?from=${from}&to=${to}&amount=${amount}`
    );
    return result;
};
export const createCoin = async coin => {
    const result = await api.post(`/coin`, coin);
    return result;
};

export const deleteCoin = async name => {
    const result = await api.delete(`/coin/${name}`);
    return result;
};

export const updateCoin = async (name, value) => {
    const result = await api.put(`/coin/${name}/${value}`);
    return result;
};
