import CurrencyDefaultRequest from "./currency-default-request";

export default interface SaveCurrencyRequest extends CurrencyDefaultRequest {    
    isFictional?: boolean;
    currencyBackingUnitValue?: number;
}