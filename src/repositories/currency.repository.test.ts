import 'reflect-metadata';
import { CurrencyRepository } from "./currency.repository";

describe('CurrencyRepository', () => {
    test('Should get USD currency object', async () => {
        // Arrange
        const sut = new CurrencyRepository();
    
        // Act
        const result = await sut.getCurrencyById('USD');
    
        // Assert
        expect(result).not.toBeNull();
        expect(result?.id).toBe('USD');
        expect(result?.usdRate).toBe(1);
    });

    test('Should return null if currency was not found', async () => {
        // Arrange
        const sut = new CurrencyRepository();
    
        // Act
        const result = await sut.getCurrencyById('ABC');
    
        // Assert
        expect(result).toBeNull();
    });
});