const conversionCoins = (comparative, original, amount) => {    
    console.log(original);
    console.log(comparative);
    let amountConversions = amount * comparative; 
    const amountResult = amountConversions / original; 
    return amountResult;
}

module.exports = conversionCoins;