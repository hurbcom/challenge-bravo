import { Currency } from './currency';





describe('Currency', () => {

    const currency = new Currency("BRL", 1, 10);
    currency.title = 'Real'
    currency.value = 10.00
    currency.qty = 10

   it('should be defined', () => {
      expect(currency).toBeDefined();
   });

    it('should be "Real" ', () => {
        expect(currency.title).toBe('Real');
    });

    it('should be "BRL" ', () => {
        expect(currency.symbol).toBe('BRL');
    });

    it('should be 10.00 ', () => {
        expect(currency.value).toBe(10.00)
    });

    it('should be 10 ', () => {
        expect(currency.qty).toBe(10)
    });



});



