import axios from "axios";
import store from "@/store";

export const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL
});

const onError = ({ message, stack }) => {
    console.error({ message, stack });
    store.dispatch("showError", {
        text: "Fatal Error"
    });
    return { data: false };
};

api.interceptors.response.use(({ data }) => data, onError);
export default api;
