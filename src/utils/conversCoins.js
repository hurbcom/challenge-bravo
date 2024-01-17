// Função de conversão de valores
const conversionCoins = (comparativeObj, originalObj, amount) => {    
    if (amount > 0) {
            
        let amountConversions = amount * comparativeObj.amount; 
        let amountResult = amountConversions / originalObj.amount; 
        amountResult = amountResult.toFixed(3)        
        
        return {
            status: 200,
            data: {
                message: `${originalObj.code} => ${comparativeObj.code}`,
                value: amountResult,
            }
        };           
    }else{
        return {
            status: 200,
            data: {
                message: `${originalObj.code} => ${comparativeObj.code}`,
                value: 0,
            }
        };      
    }           
}
    


module.exports = conversionCoins;
