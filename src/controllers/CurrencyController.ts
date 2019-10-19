import awesomeApi from '../services/awesome-api'
import format from '../services/format'
import memory from '../services/memory'
import validate from '../services/validate'
import { Request, Response } from 'express'
import calculation from '../services/calculation'
import Currencies from '../models/Currencies'
class CurrencyController {
  public async CalculateCurrency (req: Request, res: Response): Promise <Response> {
    try {
      const from: keyof Currencies = req.query.from
      const to: keyof Currencies = req.query.to
      const amount: number = req.query.amount
      const memoryCurrencies: string = memory.GetCurrencies()
      const valid: string = validate.Calculate(from.toString(), to.toString(), amount, memoryCurrencies)
      if (valid === '') {
        const response = await awesomeApi.GetCurrencies()
        const exchangeRate = format.ExchangeRate(from, to, response)
        const convertedValue = calculation.Conversion(amount, exchangeRate)
        return res.status(200).send(convertedValue)
      } else {
        return res.status(400).send(valid)
      }
    } catch (err) {
      return res.status(500).send(err)
    }
  }

  public async GetCurrencies (req: Request, res: Response): Promise <Response> {
    try {
      const response = await awesomeApi.GetCurrencies()
      const list: string = format.KeysToString(response)
      return res.status(200).send(list)
    } catch (err) {
      return res.status(500).send(err)
    }
  }

  public async AddCurrency (req: Request, res: Response): Promise <Response> {
    try {
      const newCurrency = req.body.currency
      const response = await awesomeApi.GetCurrencies()
      const list: string = format.KeysToString(response)
      const memoryCurrencies: string = memory.GetCurrencies()
      const valid: string = validate.NewCurrency(newCurrency, memoryCurrencies, list)
      if (valid === '') {
        const currencies = memory.AddCurrency(newCurrency)
        return res.status(200).send({ moedas: currencies })
      } else {
        return res.status(400).send(valid)
      }
    } catch (err) {
      return res.status(500).send(err)
    }
  }

  public RemoveCurrency (req: Request, res: Response): Response {
    try {
      const newCurrency = req.body.currency
      const memoryCurrencies: string = memory.GetCurrencies()
      const valid: string = validate.RemoveCurrency(newCurrency, memoryCurrencies)
      if (valid === '') {
        const currencies = memory.RemoveCurrency(newCurrency)
        return res.status(200).send({ moedas: currencies })
      } else {
        return res.status(400).send(valid)
      }
    } catch (err) {
      return res.status(500).send(err)
    }
  }
}

export default new CurrencyController()
