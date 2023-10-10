// eslint-disable-next-line no-unused-vars
import { Currency } from '../entities/currency.entity.js'

/**
 * @interface
 */
export class CurrencyRepository {
  /**
     * @param {string} [code]
     * @returns {Promise<(false | Currency[] | Currency)>}
     */
  getCurrencies (code) {}

  /**
     *
     * @param {object} currency
     * @param {string} currency.base
     * @param {string} currency.code
     * @param {number} currency.price
     * @returns {Promise<void>}
     */
  registerCurrency (currency) {}

  /**
     *
     * @param {object} currency
     * @param {string} [currency.base]
     * @param {string} currency.code
     * @param {number} currency.price
     * @returns {Promise<void>}
     */
  updateCurrency (currency) {}

  /**
   *
   * @param {Uppercase<string>} code
   * @returns {Promise<void>}
   */
  deleteCurrency (code) {}
}