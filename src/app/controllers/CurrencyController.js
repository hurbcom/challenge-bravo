import CurrencyModel from '../models/CurrencyModel';

import ServerError from '../../utils/ServerError';

/**
 * Class to CRUD currency.
 */
class CurrencyController {
    /**
     * return an array with all currency infos
     *
     * @param {Request} req the request object
     * @param {Response} res the response object
     *
     * @returns a promise that resolves after the response is sent. The response body includes all created currencys
     */
    async list(req, res) {
        try {
            const allCurrencys = await CurrencyModel.findAll();

            if (allCurrencys.length === 0) {
                return res.status(200).json({ message: 'Ainda não existem moedas criadas' });
            }

            return res.status(200).json(allCurrencys);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    /**
     * Create a new currency if they don't exists
     *
     * @param {Request} req the request object
     * @param {Response} res the response object
     *
     * @returns a promise that resolves after the response is sent. The response body includes the currency create
     */
    async create(req, res) {
        const { name, value, initials } = req.body;

        try {
            const existCurrency = await CurrencyModel.findOne({
                where: {
                    name
                }
            });

            if (existCurrency) {
                throw new ServerError('Já existe uma moeda cadastrado com este nome');
            }

            const createdCurrency = await CurrencyModel.create({
                name,
                value,
                initials
            });

            return res.status(200).json(createdCurrency);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    /**
     * Delete a currency by name
     *
     * @param {Request} req the request object
     * @param {Response} res the response object
     *
     * @returns a promise that resolves after the response is sent. The response is empty if a success.
     */
    async delete(req, res) {
        const { initials } = req.query;
        try {
            const existCurrency = await CurrencyModel.findOne({
                where: {
                    initials
                }
            });

            if (!existCurrency) {
                throw new ServerError('Nao existe uma moeda com essa sigla');
            }

            if (existCurrency.id === 1) {
                throw new ServerError('Você não pode deletar a moeda lastro do sistema!');
            }

            await CurrencyModel.destroy({
                where: {
                    initials
                }
            });

            return res.status(201);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

export default new CurrencyController();
