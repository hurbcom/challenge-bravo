const isNullOrEmpty = data => {

    if (typeof data === 'undefined') {
        return true
    }

    if (data === null) {
        return true
    }

    if (data === '' || data === "") {
        return true
    }

    return false
}


const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 7 }).format(amount);
}

module.exports = {
    isNullOrEmpty,
    formatCurrency
}