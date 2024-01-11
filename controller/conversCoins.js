async function formulaConversationCoins(original, comparative, amount) {
    let amountConversions = amount * original;
    amountConversions = amountConversions * comparative;

    return amountConversions;
}

const conversionCoins = async (original, comparative, amount) => {
    const valueComparative = await formulaConversationCoins(original, comparative, amount)

    return valueComparative;
}

module.exports = conversionCoins;