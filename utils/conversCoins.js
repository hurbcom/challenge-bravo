const conversionCoins = (original, comparative, amount) => {
    let amountConversions = amount * original;
    const amountResult = amountConversions * comparative;
    console.log(amountResult);
    return amountResult;
}

module.exports = conversionCoins;