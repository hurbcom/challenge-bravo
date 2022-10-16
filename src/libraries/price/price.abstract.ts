import axios, { AxiosInstance } from 'axios';

abstract class PriceAbstract {
    protected endpoint = '';
    private _http: AxiosInstance = null;

    private _priceData = [];

    protected constructor() {
        console.log(axios);
        // this.http = axios.create({
        //     baseURL: this.endpoint,
        // });
    }

    public async getPrices() {
        await this.storePrices();
    }

    public async storePrices() {
        return;
    }

    protected set http(http: any) {
        this._http = http;
    }

    protected get http() {
        return this._http;
    }

    public get priceData() {
        return this._priceData;
    }

    public set priceData(priceData: any) {
        this._priceData = priceData;
    }
}

export default PriceAbstract;
