jest.mock('../repositories/currency.repository');
import 'reflect-metadata';
import { CurrencyService } from './currency.service';
import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../models/currency.model';
// import { Currency } from '../models/currency.model';


describe('CurrencyService', () => {
    test('Should get call CurrencyRepository to get Currency', async () => {
        // Arrange
        const currencyRepositoryMock = new CurrencyRepository();
        const sut = new CurrencyService(currencyRepositoryMock);

        // Act
        await sut.getCurrencyById('USD');

        // Assert
        expect(currencyRepositoryMock.getCurrencyById).toHaveBeenCalled();
    });

    test('Should save currency on repository', async () => {
        // Arrange
        const currencyRepositoryMock = new CurrencyRepository();
        const sut = new CurrencyService(currencyRepositoryMock);
        const fakeData = new Currency('FAK', 1, new Date());

        // Act
        await sut.insertOrUpdateCurrency(fakeData);
        
        // Assert
        expect(currencyRepositoryMock.insertOrUpdateCurrency).toHaveBeenCalled();
        
    })
})
