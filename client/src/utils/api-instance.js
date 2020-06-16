import axios from "axios";
import store from "@/store";

export const api = axios.create({
    baseURL: "http://localhost:3333"
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
