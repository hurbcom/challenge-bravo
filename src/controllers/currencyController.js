const Currency = require('../models/Currency');
const currencyRequestService = require('../services/currencyRequestService');

/**
 * Converte a moeda de acordo com os parâmetros passados
 * 
 * @param {object} req
 * @param {object} res
 */
exports.convertCurrency = (req, res) => {
    // Obtendo campos da query
    const data = req.query

    // Obtendo as moedas disponíveis
    Currency.find({}, function(err, currencies) {
        // Verificando se teve erro ao realizar a consulta
        if (err) {
            return res.status(500).send({status: 500, message: 'Erro ao obter as moedas disponíveis!'});
        }

        // Validando campos
        const availableCurrencies = currencies.map((x) => x.currency);
        const errors = currencyRequestService.validateConvertCurrencyFields(data, availableCurrencies);

        // Verifica se tem algum problema com os campos passados
        if (errors.length > 0) {
            // Retorna os erros encontrados
            return res.status(400).send({status: 400, message: 'Erro de validação!', errors: errors});
        }

        // Obtendo os valores em USD registrados no banco para cada moeda
        const fromUsdValue = currencies.find((x) => x.currency === data.from).usd_value;
        const toUsdValue = currencies.find((x) => x.currency === data.to).usd_value;

        // Calculando o total da conversão
        let total = ((toUsdValue/fromUsdValue)*data.amount);

        // Arredondando o valor para melhorar visualização
        total = parseFloat(String(total).replace(/(\.0*\d{1,2}).*$/, '$1'));

        return res.status(200).send({status: 200, total: total});
    });
};

/**
 * Adiciona uma nova moeda
 * 
 * @param {object} req
 * @param {object} res
 */
exports.addCurrency = (req, res) => {
    // Obtendo campos
    const data = req.body

    // Obtendo as moedas disponíveis
    Currency.find({}, function(err, currencies) {
        // Verificando se teve erro ao realizar a consulta
        if (err) {
            return res.status(500).send({status: 500, message: 'Erro ao obter as moedas disponíveis!'});
        }

        // Validando campos
        const registeredCurrencies = currencies.map((x) => x.currency);
        const errors = currencyRequestService.validateAddCurrencyFields(data, registeredCurrencies);

        // Verifica se tem algum problema com os campos passados
        if (errors.length > 0) {
            // Retorna os erros encontrados
            return res.status(400).send({status: 400, message: 'Erro de validação!', errors: errors});
        }

        // Salvando moeda no banco
        const currency = new Currency({currency: data.currency, usd_value: data.usd_value});
        currency.save((err) => {
            if (err) {
                return res.status(500).send({status: 500, message: 'Erro ao adicionar a moeda no banco!'});
            }
            return res.status(201).send({status: 201, message: 'Moeda adicionada com sucesso!'});
        });
    });
};

/**
 * Remove uma moeda
 * 
 * @param {object} req
 * @param {object} res
 */
exports.removeCurrency = (req, res) => {
    const currency = req.params.currency;

    // Obtendo as moedas disponíveis
    Currency.find({}, function(err, currencies) {
        // Verificando se teve erro ao realizar a consulta
        if (err) {
            return res.status(500).send({status: 500, message: 'Erro ao obter as moedas disponíveis!'});
        }

        // Validando campos
        const registeredCurrencies = currencies.map((x) => x.currency);
        const errors = currencyRequestService.validateRemoveCurrencyFields(currency, registeredCurrencies);

        // Verifica se tem algum problema com os campos passados
        if (errors.length > 0) {
            // Retorna os erros encontrados
            return res.status(400).send({status: 400, message: 'Erro de validação!', errors: errors});
        }

        // Removando a moeda
        Currency.remove({currency: currency}, (err) => {
            if (err) {
                return res.status(500).send({status: 500, message: 'Não foi possível remover a moeda!'});
            }
            return res.status(200).send({status: 200, message: 'Moeda removida com sucesso!'});
        });

    });
};