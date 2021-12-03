export interface CurrencyModel {
    name?:string,
    shortName:string,
    USDvalue:number
}
export interface CurrencyDocument extends CurrencyModel{
    id:string
}
