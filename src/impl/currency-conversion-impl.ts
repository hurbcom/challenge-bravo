import CurrencyConversionRequest from "../entities/currency-controller/currency-conversion-request";
import ValidationImpl from "./validation-impl";
import Utils from "./utils";
import CurrencyConversionResponse from "../entities/currency-controller/currency-conversion-response";
import ConfigsEntity from "../entities/jsons/configs-entity";
import CurrencyEntity from "../entities/jsons/currency-entity";
import axios, { AxiosResponse } from "axios";
import AwesomeQuotation from "../entities/awesomeapi/awesome-quotation";
import { xml2json } from "xml-js";
import ApiError from "./errors/api-error";
import CurrencyQuotationResponse from "../entities/currency-conversion/currency-quotation-response";
import CurrencyError from "./errors/currency-error";

export default class CurrencyConversionImpl {

    private validation: ValidationImpl;

    constructor() {
        this.validation = new ValidationImpl();        
    }
    
    public async getCurrencyConversion(body: CurrencyConversionRequest): Promise<CurrencyConversionResponse> {
        this.validateCurrencyConversion(body);
        const configs: ConfigsEntity = Utils.loadJsonFileByName("configs.json");
        const apiAvailableConversions: Array<string> = await this.getAvailableCurrencyConversion();

        const amount = body.amount;

        const quotation = await this.getCurrencyQuotation(body, configs, apiAvailableConversions);

        const calculatedAmount = this.calculateAmountWithQuotation(amount, quotation);

        return this.getCurrencyConversionResponse(body, calculatedAmount);
    }

    protected async getCurrencyQuotation(body: CurrencyConversionRequest, configs: ConfigsEntity, apiAvailableConversions: Array<string>): Promise<CurrencyQuotationResponse> {
        const from = body.from
        const to = body.to;
        const fromEntity: CurrencyEntity = this.findCurrencyEntityInConfigs(from, configs);
        const toEntity: CurrencyEntity = this.findCurrencyEntityInConfigs(to, configs);

        const fromUSDQuotation = await this.getUSDQuotationIfNotFictional(from, fromEntity, apiAvailableConversions);
        const toUSDQuotation = await this.getUSDQuotationIfNotFictional(to, toEntity, apiAvailableConversions);
        const oneFromQuotation = 1 / fromUSDQuotation;
        const quotation = toUSDQuotation * oneFromQuotation
        return {
            quotaion: quotation,            
            fromUSDQuotation: fromUSDQuotation,
            toUSDQuotation: toUSDQuotation
        };       
    }

    protected findCurrencyEntityInConfigs(currency: string, configs: ConfigsEntity) {
        return <CurrencyEntity> configs.currencies.find(currencyConfig => { 
            return currencyConfig.abbreviation.toUpperCase().trim() === currency.toUpperCase().trim() 
        });
    }

    protected checkIfConversionIsAvailableOnThirdParty(conversion: string, apiAvailableConversions: Array<string>) {
        return apiAvailableConversions.some(availableConversion => { return availableConversion ===  conversion});
    }

    protected calculateAmountWithQuotation(amount: number, quotation: CurrencyQuotationResponse): string {
        return (amount / quotation.quotaion).toFixed(4);
    }

    protected async getUSDQuotationIfNotFictional(abbreviation: string, currencyEntity: CurrencyEntity, apiAvailableConversions: Array<string>) {
        if(currencyEntity.isFictional) {
            return Number(currencyEntity.currencyBackingUnitValue);
        }
        if(abbreviation === "USD") {
            return Number(1);
        }
        
        const conversion = abbreviation + "-" + "USD";

        if(!this.checkIfConversionIsAvailableOnThirdParty(conversion, apiAvailableConversions)) {
            throw new CurrencyError('Algo deu errado com a API. Contacte nosso suporte.');
        }
        
        const quotation = await this.getQuotationFromThirdParty(conversion);
        return Number(quotation.bid);
    }

    protected async getQuotationFromThirdParty(conversion: string): Promise<AwesomeQuotation> {
        const cache: any = Utils.loadJsonFileByName("cache-quotations.json");
        let quotaion = cache[conversion.replace('-', '')];

        if(!this.checkIfConversionHasValidCache(conversion, cache)) {
            const response = await this.callThirdPartyApi(conversion);
            quotaion = response;
            cache[conversion.replace('-', '')] = quotaion;
            Utils.saveJsonFile(cache, "cache-quotations.json");
        }

        return quotaion;
    }

    protected checkIfConversionHasValidCache(conversion: string, cache: any): boolean {
        let quotaion = cache[conversion.replace('-', '')];
        
        if(quotaion) {
            const date = new Date(quotaion.create_date);
            date.setHours(date.getHours() + 3);
            const now = new Date();

            return now.getTime() <= date.getTime();
        }

        return false;
    }

    protected async callThirdPartyApi(conversion: string) {
        const response = await axios.get('https://economia.awesomeapi.com.br/last/' + conversion).catch(err => {
            throw new ApiError('Algo deu errado com a API. Contacte nosso suporte.');
        });
        return response.data[conversion.replace('-', '')];
    }

    protected async getAvailableCurrencyConversion() {
        const response = await axios.get('https://economia.awesomeapi.com.br/xml/available').catch(err => {            
            throw new ApiError("Algo deu errado com a API para verificação de disponibilidade de conversão. Contacte o suporte.");
        });

        const xmlToJson = JSON.parse(xml2json(response.data, {compact: true, spaces: 4}));
        return Object.keys(xmlToJson['xml']);        
    }

    
    protected getCurrencyConversionResponse(body: CurrencyConversionRequest, calculatedAmount: string): CurrencyConversionResponse {
        return {
            from: body.from,
            to: body.to,
            originalAmount: body.amount.toFixed(2),
            convertedAmount: calculatedAmount
        }
    }
  

    protected validateCurrencyConversion(body: CurrencyConversionRequest) {
        this.validation.checkIfConversionHasSameCurrency(body.from, body.to);
        this.validation.validateCurrencyConversion("from", body.from);
        this.validation.validateCurrencyConversion("to", body.to);        
    }
}