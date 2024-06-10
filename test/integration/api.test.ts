import axios from 'axios';

describe('Main Express', () => {

  it('should convert USD to BRL', async () => {
    const params = { from: 'USD', to: 'BRL', amount: 10 };
    const response = await axios.get('http://localhost:3000/currencies/convert', { params });
    const output = response.data;
    expect(output).toEqual({ value: 52, symbol: 'R$', decimalPoints: 2 });
  });

  it('should convert BRL to USD', async () => {
    const params = { from: 'BRL', to: 'USD', amount: 10.4 };
    const response = await axios.get('http://localhost:3000/currencies/convert', { params });
    const output = response.data;
    expect(output).toEqual({ value: 2, symbol: '$', decimalPoints: 2 });
  });

  it('should create, get and delete a currency rate', async () => {
    const payload = {
      name: 'Any Currency',
      code: 'ANY',
      symbol: '$',
      decimalPoints: 2,
      baseAmount: 2,
      equivalentCurrencyAmount: 1,
      equivalentCurrencyCode: 'USD'
    };
    const createResponse = await axios.post('http://localhost:3000/currencies', payload);
    const createOutput = createResponse.data;
    expect(createOutput.currencyRateId).toBeDefined();
    const getResponse = await axios.get(`http://localhost:3000/currencies/${payload.code}`);
    const getOutput = getResponse.data;
    expect(getOutput.name).toEqual(payload.name);
    expect(getOutput.code).toEqual(payload.code);
    expect(getOutput.symbol).toEqual(payload.symbol);
    expect(getOutput.decimalPoints).toEqual(payload.decimalPoints);
    expect(getOutput.rate).toEqual(2);
    const deleteResponse = await axios.delete(`http://localhost:3000/currencies/${getOutput.code}`);
    const deleteOutput = deleteResponse.data;
    expect(deleteOutput).toEqual({ message: 'Currency deleted' });
  });

  it('should throw an error when trying to convert with invalid currency', async () => {
    const params = { from: 'INVALID', to: 'BRL', amount: 10 };
    try {
      await axios.get('http://localhost:3000/currencies/convert', { params });
    } catch (error: any) {
      expect(error.response.data).toEqual({ message: 'Currency rate not found: INVALID' });
    }
  });

  it('should throw an error when trying to convert with invalid amount', async () => {
    const params = { from: 'USD', to: 'BRL', amount: -10 };
    try {
      await axios.get('http://localhost:3000/currencies/convert', { params });
    } catch (error: any) {
      expect(error.response.data).toEqual({ message: 'Invalid amount' });
    }
  });

});