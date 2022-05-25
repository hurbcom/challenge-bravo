import axios from "axios";

interface IRequest {
  to: string;
  from: string;
  amount: number;
}

interface ICurrencyExchange {
  conversion: number;
}

class CurrencyExchangeUseCase {
  async execute({ to, from, amount }: IRequest): Promise<ICurrencyExchange> {
    const { data } = await axios.get(`https://economia.awesomeapi.com.br/last/${to}-${from}`);

    const conversionExchange: ICurrencyExchange = parseFloat(data.USDBRL.high) * parseFloat(amount);

    console.log(conversionExchange);

    return conversionExchange;
  }
}

export { CurrencyExchangeUseCase };
