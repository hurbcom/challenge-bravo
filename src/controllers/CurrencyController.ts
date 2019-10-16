import awesomeApi from '../services/awesome-api'
import format from '../services/format'
import { Response } from 'express'

class CurrencyController {
  public async GetCurrencies (res: Response): Promise <Response> {
    try {
      const response = await awesomeApi.GetCurrencies()
      const list: Array<string> = format.keysToList(response)
      // includes BRL
      list.push('BRL')
      return res.status(200).send(list)
    } catch (err) {
      return res.status(500).send(err)
    }
  }
}

export default new CurrencyController()
