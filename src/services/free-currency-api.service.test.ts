jest.genMockFromModule('got');
import got from 'got';
import 'reflect-metadata';
import { FreeCurrencyApiService } from '../services/free-currency-api.service';

describe('FreeCurrencyApiService', () => {
    test('Should get latest BRL rate', async () => {
        // Arrange
        const fakeResponse: any = {
            statusCode: 200,
            body: JSON.stringify({
                'USD_BRL': 1
            })
        };

        const gotGetMock = jest.fn();
        gotGetMock.mockReturnValue(fakeResponse);
        got.get = gotGetMock;

        const sut = new FreeCurrencyApiService();

        // Act
        const result = await sut.GetUpdatedExchangeRateByCurrencyId('BRL');

        // Assert
        expect(result).toBe(1);
    });

    test('Should return undefined when currency was not found', async () => {
        // Arrange
        const fakeResponse: any = {
            statusCode: 200,
            body: JSON.stringify({})
        };

        const gotGetMock = jest.fn();
        gotGetMock.mockReturnValue(fakeResponse);
        got.get = gotGetMock;

        const sut = new FreeCurrencyApiService();

        // Act
        const result = await sut.GetUpdatedExchangeRateByCurrencyId('FAK');

        // Assert
        expect(result).toBeUndefined();
    });

    test('Should throw error when service fails', async () => {
        // Arrange
        const fakeResponse: any = {
            statusCode: 200,
            body: JSON.stringify({})
        };

        const gotGetMock = jest.fn();
        gotGetMock.mockReturnValue(fakeResponse);
        got.get = gotGetMock;

        const sut = new FreeCurrencyApiService();

        // Act/Assert
        expect(sut.GetUpdatedExchangeRateByCurrencyId('FAK')).rejects.toThrow(new Error('An error has occurred while getting the currency rate'));

    });
});
