import { CurrencyRepository } from "./currency.repository";

describe('CurrencyRepository', () => {
    test('should get USD currency object', () => {
        // Arrange
        const sut = new CurrencyRepository();
    
        // Act
        const result = sut.getCurrencyById('USD');
    
        // Assert
        expect(result).not.toBeNull();
        expect(result?.id).toBe('USD');
        expect(result?.usdValue).toBe(1);
    });

    test('should return null if currency was not found', () => {
        // Arrange
        const sut = new CurrencyRepository();
    
        // Act
        const result = sut.getCurrencyById('ABC');
    
        // Assert
        expect(result).toBeNull();
    });
});