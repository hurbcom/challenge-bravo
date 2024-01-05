import { ValidationError } from "class-validator";
import CurrencyEntity, { CurrencyEntityProps } from "../currency.entity";


describe('currency entity', () => {
    it('should create currency', () => {
        // arrange
        const currencyEntityProps: CurrencyEntityProps = {
            name: "USD",
            code: "USD",
            codein: "USD",
            bid: 1,
            isFictitious: false
        };

        // act
        const currency = new CurrencyEntity(currencyEntityProps);

        // assert
        expect(currency.props).toEqual({
            name: "USD",
            code: "USD",
            codein: "USD",
            bid: 1,
            isFictitious: false     
        });
    });

    it('should throw exception when a prop is invalid', () => {
        // arrange
        const currencyEntityProps: CurrencyEntityProps = {
            name: "INVALID",
            code: "USD",
            codein: "",
            bid: 1,
            isFictitious: false
        };

        // act & assert
        expect(() => new CurrencyEntity(currencyEntityProps)).toThrow();
    });
});