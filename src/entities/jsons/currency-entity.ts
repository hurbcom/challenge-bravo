export default interface CurrencyEntity {
    abbreviation: string;
    isFictional: boolean;
    currencyBackingUnitValue?: number;
}