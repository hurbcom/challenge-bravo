import ExchangeRateGateway from "@/application/gateway/exchange-rate-gateway";
import ConvertCurrency from "@/application/use-case/convert-currency";
import { ExchangeRateGatewayFake } from "@/infra/gateway/exchange-rate-gateway-fake";

describe('Currency Converter', () => {
  let exchangeRateGateway: ExchangeRateGateway;
  let convertCurrency: ConvertCurrency;
  beforeEach(() => {
    exchangeRateGateway = new ExchangeRateGatewayFake();
    convertCurrency = new ConvertCurrency(exchangeRateGateway);
  });

  it('should convert USD to BRL', async () => {
    const input = {
      from: 'USD',
      to: 'BRL',
      amount: 1,
    }
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(5.20);
  });

  it('should convert BRL to USD', async () => {
    const input = {
      from: 'BRL',
      to: 'USD',
      amount: 5.20,
    }
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(1.00);
  });

  it('should convert USD to EUR', async () => {
    const input = {
      from: 'USD',
      to: 'EUR',
      amount: 1,
    }
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(0.92);
  });

  it('should convert EUR to BRL', async () => {
    const input = {
      from: 'EUR',
      to: 'BRL',
      amount: 1,
    }
    const result = await convertCurrency.execute(input);
    expect(result.value).toBe(5.65);
  });

});