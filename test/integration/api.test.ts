import axios from 'axios';

describe('Main API', () => {
  it('should convert USD to BRL', async () => {
    const params = { from: 'USD', to: 'BRL', amount: 10 };
    const response = await axios.get(
      'http://localhost:3000/api/v1/currencies/convert',
      { params }
    );
    const output = response.data;
    expect(output.from).toBe('USD');
    expect(output.to).toBe('BRL');
    expect(output.givenAmount).toBe(10);
    expect(output.convertedAmount).toBeGreaterThan(0);
    expect(output.convertedAmountFormatted).toContain('R$');
    expect(output.decimalDigits).toBe(2);
    expect(output.symbol).toBe('R$');
  });

  it('should convert BRL to USD', async () => {
    const brlResponse = await axios.get(
      'http://localhost:3000/api/v1/currencies/BRL'
    );
    const brlOutput = brlResponse.data;
    const amount = brlOutput.rate * 2;
    const params = { from: 'brl', to: 'usd', amount: amount };
    const response = await axios.get(
      'http://localhost:3000/api/v1/currencies/convert',
      { params }
    );
    const output = response.data;
    expect(output.from).toBe('BRL');
    expect(output.to).toBe('USD');
    expect(output.givenAmount).toBe(amount);
    expect(output.convertedAmount).toBe(2.0);
    expect(output.convertedAmountFormatted).toContain('$');
    expect(output.decimalDigits).toBe(2);
    expect(output.symbol).toBe('$');
  });

  it('should create, get and delete a currency rate', async () => {
    const payload = {
      name: 'Any Currency',
      code: 'ANY',
      symbol: '$',
      decimalDigits: 2,
      baseAmount: 2,
      equivalentCurrencyAmount: 1,
      equivalentCurrencyCode: 'USD',
    };
    await axios.post('http://localhost:3000/api/v1/currencies', payload);
    const getResponse = await axios.get(
      `http://localhost:3000/api/v1/currencies/${payload.code}`
    );
    const getOutput = getResponse.data;
    expect(getOutput.name).toEqual(payload.name);
    expect(getOutput.code).toEqual(payload.code);
    expect(getOutput.symbol).toEqual(payload.symbol);
    expect(getOutput.decimalDigits).toEqual(payload.decimalDigits);
    expect(getOutput.rate).toEqual(2);
    const deleteResponse = await axios.delete(
      `http://localhost:3000/api/v1/currencies/${getOutput.code}`
    );
    const deleteOutput = deleteResponse.data;
    expect(deleteOutput).toEqual({ message: 'Currency deleted' });
  });

  it('should throw an error when trying to convert with invalid currency', async () => {
    const params = { from: 'INVALID', to: 'BRL', amount: 10 };
    try {
      await axios.get('http://localhost:3000/api/v1/currencies/convert', {
        params,
      });
    } catch (error: any) {
      expect(error.response.data.message).toBe(
        'Currency rate not found: INVALID'
      );
      expect(error.response.status).toBe(404);
    }
  });

  it('should throw an error when trying to convert with invalid amount', async () => {
    const params = { from: 'USD', to: 'BRL', amount: -10 };
    try {
      await axios.get('http://localhost:3000/api/v1/currencies/convert', {
        params,
      });
    } catch (error: any) {
      expect(error.response.data).toEqual({ message: 'Invalid amount' });
    }
  });
});
