import awesomeApi from '../services/awesome-api'
import format from '../services/format'
import memory from '../services/memory'
import validate from '../services/validate'
import { Request, Response } from 'express'

class CurrencyController {
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
}

export default new CurrencyController()
