const { ConvertCurrency } = require('../../controllers/currency_exchange');

test('BRL: It should show the original monetary value of 100,00', async () => {
    const result = await ConvertCurrency(
        {"currency":"BRL","ballast_usd":4.93119,"crypto":false},
        {"currency":"USD","ballast_usd":1,"crypto":false},
        100
    );
    expect(result.from.split(/\s/)[1]).toBe('100,00');
});

test('BRL to USD: It should show the destination monetary value of 20,28', async () => {
    const result = await ConvertCurrency(
        {"currency":"BRL","ballast_usd":4.93119,"crypto":false},
        {"currency":"USD","ballast_usd":1,"crypto":false},
        100
    );
    expect(result.to.split(/\s/)[1]).toBe('20,28');
});

test('GTA: It should show the original monetary value of 1.250.00,00', async () => {
    const result = await ConvertCurrency(
        {"currency":"GTA","ballast_usd":73833.43178,"crypto":false},
        {"currency":"USD","ballast_usd":1,"crypto":false},
        1250000
    );
    expect(result.from.split(/\s/)[1]).toBe('1.250.000,00');
});

test('GTA to USD: It should show the original monetary value of 16,93', async () => {
    const result = await ConvertCurrency(
        {"currency":"GTA","ballast_usd":73833.43178,"crypto":false},
        {"currency":"USD","ballast_usd":1,"crypto":false},
        1250000
    );
    expect(result.to.split(/\s/)[1]).toBe('16,93');
});

test('GTA: It should show the original monetary value of 1.250.00,00', async () => {
    const result = await ConvertCurrency(
        {"currency":"GTA","ballast_usd":73833.43178,"crypto":false},
        {"currency":"BRL","ballast_usd":4.93119,"crypto":false},
        1250000
    );
    expect(result.from.split(/\s/)[1]).toBe('1.250.000,00');
});

test('GTA to BRL: It should show the original monetary value of 83,49', async () => {
    const result = await ConvertCurrency(
        {"currency":"GTA","ballast_usd":73833.43178,"crypto":false},
        {"currency":"BRL","ballast_usd":4.93119,"crypto":false},
        1250000
    );
    expect(result.to.split(/\s/)[1]).toBe('83,49');
});