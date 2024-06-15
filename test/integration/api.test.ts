import axios from 'axios';

describe('Main API', () => {
  it('should create, get, convert and delete a currency rate', async () => {
    const payload = {
      name: 'Grand Theft Auto Dollar',
      symbol: 'GTA$',
      code: 'gta',
      decimalDigits: 2,
      baseAmount: 1250000.0,
      equivalentCurrencyCode: 'brl',
      equivalentCurrencyAmount: 83.5,
    };
    await axios.post('http://localhost:3000/api/v1/currencies', payload);
    const getResponse = await axios.get(
      `http://localhost:3000/api/v1/currencies/${payload.code}`
    );
    const getOutput = getResponse.data;
    expect(getOutput.name).toEqual(payload.name);
    expect(getOutput.code).toEqual(payload.code.toUpperCase());
    expect(getOutput.symbol).toEqual(payload.symbol);
    expect(getOutput.decimalDigits).toEqual(payload.decimalDigits);
    expect(getOutput.rate).toBeDefined();
    const convertParams = { from: 'brl', to: 'gta', amount: 83.5 };
    const convertResponse = await axios.get(
      'http://localhost:3000/api/v1/currencies/convert',
      { params: convertParams }
    );
    const convertOutput = convertResponse.data;
    expect(convertOutput.from).toBe('BRL');
    expect(convertOutput.to).toBe('GTA');
    expect(convertOutput.givenAmount).toBe(83.5);
    expect(convertOutput.convertedAmount).toBe(1250000);
    expect(convertOutput.convertedAmountFormatted).toContain('GTA$ 1250000.00');
    const deleteResponse = await axios.delete(
      `http://localhost:3000/api/v1/currencies/${getOutput.code}`
    );
    const deleteOutput = deleteResponse.data;
    expect(deleteOutput).toEqual({ message: 'Currency deleted' });
    expect(deleteResponse.status).toBe(200);
  });

  it('should throw an error when trying to create a currency with invalid name', async () => {
    const payload = {
      name: '',
      code: 'ANY',
      symbol: '$',
      decimalDigits: 2,
      baseAmount: 2,
      equivalentCurrencyAmount: 1,
      equivalentCurrencyCode: 'USD',
    };
    try {
      await axios.post('http://localhost:3000/api/v1/currencies', payload);
    } catch (error: any) {
      expect(error.response.data.message).toBe('Invalid name');
      expect(error.response.status).toBe(400);
    }
  });

  it('should throw an error when trying to convert with invalid currency', async () => {
    const params = { from: 'INVALID', to: 'BRL', amount: 10 };
    try {
      await axios.get('http://localhost:3000/api/v1/currencies/convert', {
        params,
      });
    } catch (error: any) {
      expect(error.response.data.message).toBe('Currency not found: INVALID');
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
      expect(error.response.data.message).toEqual('Invalid amount');
      expect(error.response.status).toBe(400);
    }
  });

  it('should throw an error when trying to delete an invalid currency', async () => {
    try {
      await axios.delete('http://localhost:3000/api/v1/currencies/INVALID');
    } catch (error: any) {
      expect(error.response.data.message).toBe('Currency not found: INVALID');
      expect(error.response.status).toBe(404);
    }
  });
});
