const { calcAmountByRates } = require('../../src/currency-conversion/helpers/converter');


describe('helper.converter.calcAmountByRates', () => {
  const amount = 22.30;
  const firstCode = 'USD';
  const secondCode = 'BRL';
  const simpleRate = {
    [firstCode]: 2.1,
  };
  const complexRate = {
    [firstCode]: 2.1,
    [secondCode]: 0.000234,
  };

  it('Should return one rate code if I send a simple rate', () => {
    const resp = calcAmountByRates(simpleRate, amount);
    const parsedResp = Object.keys(resp);
    expect(parsedResp).toHaveLength(1);
  });
  it('Should return two rate code if I send a complex rate with two codes', () => {
    const resp = calcAmountByRates(complexRate, amount);
    const parsedResp = Object.keys(resp);
    expect(parsedResp).toHaveLength(2);
  });
  it('Should return the same code if I send a simpleRate', () => {
    const resp = calcAmountByRates(simpleRate, amount);
    expect(resp).toHaveProperty(firstCode);
  });
  it('Should return the same code if I send a complexRate', () => {
    const resp = calcAmountByRates(complexRate, amount);
    expect(resp).toHaveProperty(firstCode);
    expect(resp).toHaveProperty(secondCode);
  });
  it('Should return a valid value if I send a simpleRate', () => {
    const resp = calcAmountByRates(simpleRate, amount);
    const value = resp[firstCode];
    expect(value).toBe(simpleRate[firstCode] * amount);
  });
  it('Should return a valid value if I send a complexRate', () => {
    const resp = calcAmountByRates(complexRate, amount);
    const firstValue = resp[firstCode];
    const secondValue = resp[secondCode];
    expect(firstValue).toBe(complexRate[firstCode] * amount);
    expect(secondValue).toBe(complexRate[secondCode] * amount);
  });
});
