import CurrencyEntity from "./currency-entity";

export default interface ConfigsEntity {
    currencyBacking: string;
    currencies: Array<CurrencyEntity>;
}