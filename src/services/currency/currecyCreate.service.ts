import { AppDataSource } from "../../data-source";
import { Currency } from "../../entities/currency.entity";
import { IcurrecyCreate } from "../../types/currecy";

const currecyCreateService =async ({symbol, name, amount, price}: IcurrecyCreate) =>  {
  const currencyRepository = AppDataSource.getRepository(Currency);

  const priceInUsd = price/amount;
  
  const currency = currencyRepository.create({
    symbol,
    name,
    price: priceInUsd
  });
  await currencyRepository.save(currency);

  return currency;
}

export default currecyCreateService;