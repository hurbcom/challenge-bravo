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
});