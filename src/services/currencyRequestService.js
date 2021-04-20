/**
 * Faz a validação dos campos do endpoint para converter moeda
 * 
 * @param {object} data 
 * @param {array} availableCurrencies 
 * @returns array
 */
exports.validateConvertCurrencyFields = (data, availableCurrencies) => {
    let errors = [];

    // Validando o campo from
    if (!data.from) {
        errors.push("O campo 'from' é obrigatório!");
    } else if (availableCurrencies.indexOf(data.from) === -1) {
        errors.push(`A moeda '${data.from}' não é permitida!`);
    }

    // Validando o campo to
    if (!data.to) {
        errors.push("O campo 'to' é obrigatório!");
    } else if (availableCurrencies.indexOf(data.to) === -1) {
        errors.push(`A moeda '${data.to}' não é permitida!`);
    }

    // Validando o campo amount
    if (!data.amount) {
        errors.push("O campo 'amount' é obrigatório!");
    } else if (isNaN(data.amount)) {
        errors.push("O campo 'amount' deve ser um valor numérico (use . para separar os centavos)");
    }

    return errors;
};

/**
 * Faz a validação dos campos do endpoint para adicionar moeda
 * 
 * @param {object} data 
 * @param {array} registeredCurrencies 
 * @returns array
 */
exports.validateAddCurrencyFields = (data, registeredCurrencies) => {
    // Moedas suportadas pela API externa
    const availableCurrencies = [
        'AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN','BAM','BBD','BCH','BDT','BGN','BHD',
        'BIF','BMD','BND','BOB','BRL','BSD','BTC','BTN','BWP','BYN','BYR','BZD','CAD','CDF','CHF','CLP',
        'CNY','COP','CRC','CUC','CUP','CVE','CZK','DASH','DJF','DKK','DOP','DZD','EGP','EOS','ERN','ETB',
        'ETC','ETH','EUR','FJD','FKP','GBP','GEL','GGP','GHS','GIP','GMD','GNF','GTQ','GYD','HKD','HNL',
        'HRK','HTG','HUF','IDR','ILS','IMP','INR','IQD','IRR','ISK','JEP','JMD','JOD','JPY','KES','KGS',
        'KHR','KMF','KPW','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD','LSL','LTC','LYD','MAD','MDL',
        'MGA','MKD','MMK','MNT','MOP','MRO','MRU','MUR','MVR','MWK','MXN','MYR','MZN','NAD','NGN','NIO',
        'NOK','NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF',
        'SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','STD','SVC','SYP','SZL','THB','TJS',
        'TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX','USD','USDC','UYU','UZS','VEF','VES','VND',
        'VUV','WST','XAF','XAG','XAU','XCD','XDR','XLM','XOF','XPD','XPF','XPT','YER','ZAR','ZEC','ZMW',
        'STN','WBTC','DAI','PAX','DOGE','XRP','GUSD','ZWL','BUSD','CLF','ZMK','LVL','LTL','MATIC','ZRX',
        'BSV','OMG','BAND','CVC','ANKR','SUSHI','ALGO','MANA','NMR','MKR','REN','REP','ADA','STORJ','UMA',
        'CGLD','GRT','UNI','AAVE','GBX','YFI','XTZ','SKL','DNT','COMP','CNH','KNC','ATOM','SNX','LRC','MTL',
        'BNT','OXT','CRV','NU','LINK','FIL','BAL','SSP','BAT','ETH2'
    ];
    let errors = [];

    // Validando o campo currency
    if (!data.currency) {
        errors.push("O campo 'currency' é obrigatório!");
    } else if (availableCurrencies.indexOf(data.currency) === -1) {
        errors.push(`A moeda '${data.currency}' não é permitida!`);
    } else if (registeredCurrencies.indexOf(data.currency) !== -1) {
        errors.push(`A moeda '${data.currency}' já está registrada!`);
    }

    // Validando o campo usd_value
    if (!data.usd_value) {
        errors.push("O campo 'usd_value' é obrigatório!");
    } else if (isNaN(data.usd_value)) {
        errors.push("O campo 'usd_value' deve ser um valor numérico (use . para separar os centavos)");
    }

    return errors;
};

/**
 * Faz a validação dos campos do endpoint para adicionar moeda
 * 
 * @param {string} currency 
 * @param {array} registeredCurrencies 
 * @returns array
 */
exports.validateRemoveCurrencyFields = (currency, registeredCurrencies) => {
    let errors = [];

    if (registeredCurrencies.indexOf(currency) === -1) {
        errors.push(`A moeda '${currency}' não está registrada!`);
    }

    return errors;
};