require('express');
const formatCurrency = require('format-currency');

exports.formatCurrency = function (value) {
    return formatCurrency(value, {maxSignificant: 3, minimumFractionDigits: 2})
};

/**
 * @return {boolean}
 */
exports.validateNumber = function(strNumber) {
    const regExp = new RegExp("^\\d+(\\.\\d+)?$");
    return regExp.test(strNumber); // or just: /^\d+$/.test(strNumber);
};

