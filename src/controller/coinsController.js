
const Coins = require('../models/coins');
const conversionCoins = require('../utils/conversCoins')
const coinsRepositories = require('../repositories/coinsRepositories');

const ConvertCoinAmount = async (req, res) => {
    try {
        let {from, to, amount} = req.query;
        from = from.toUpperCase();
        to = to.toUpperCase();

        const regex = /^[0-9,.]+$/;  

        if (!(from && to && amount)) {
            return {
                status: 400,
                data: {
                    message: 'Oops! Missing data in the search, check and try again',
                }
            };
        }
        if (!regex.test(amount)){            
            return {
                status: 403,
                data: {
                    message: 'This amount is not allowed',
                }
            };            
        }
        if (amount.includes(',')){
            amount = amount.replace(',', '.');
        }

        // REDIS
        const originData = await coinsRepositories.getOriginCoin(from);
        const comparativeData = await coinsRepositories.getComparativeCoin(to);   

        const amountParse = parseFloat(amount);

        if (!originData) {
            return {
                status: 400,
                data: {
                    message: `This ${from} currency has not yet been added!`,
                }
            };
        } else if (!comparativeData){
            return {
                status: 400,
                data: {
                    message: `This ${to} currency has not yet been added!`,
                }
            };
        }

        let valueAmountComparative = conversionCoins(comparativeData.value,originData.value,amountParse);
        valueAmountComparative = valueAmountComparative.toFixed(3)
        
        return {
            status: 200,
            data: {
                message: `${from} => ${to}`,
                value: valueAmountComparative,
            }
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            data: {
                error: 'Internal Server Error',
            }
        };
    }    
}


const InsertCoin = async (req, res) => {
    try {
        let {code, name, value} = req.body;      
        const regexValueTest = /^[0-9,.]+$/;  
        const regexCodeTest = /^[A-Za-z]+$/;
        code = code.toUpperCase();
    
        if (!(code && name && value)) {
            return {
                status: 404,
                data: {
                    message: 'Information is missing',
                }
            };            
        }
        if (!regexValueTest.test(value)){
            return {
                status: 403,
                data: {
                    message: 'Format value not allowed',
                }
            };            
        }
        if (!regexCodeTest.test(code)){
            return {
                status: 403,
                data: {
                    message: 'Format code not allowed',
                }
            };            
        }        
        if (value.includes(',')){
            value = value.replace(',', '.');
        }
        
        const checkOnDB = await coinsRepositories.checkInsertPermission(code);
        if (checkOnDB) {            
            return {
                status: 400,
                data: {
                    message: 'This coin already exists',
                }
            };                        
        }
    
        const amount = parseFloat(value);        
    
        const Coin = await coinsRepositories.insertCoin(code, name, amount);
    
        return {
            status: 200,
            data: {message: 'Currency saved success',Coin}
        };          
        
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            data: {message: 'Internal Server Error',error: error}
        };                  
    }    
}

const UpdateCoin = async (req, res) => {
    try {
        let {code, name, value} = req.body;              
        const regex = /^[0-9,.]+$/;  
        code = code.toUpperCase();
    
        if (!(code && name && value)) {
            return {
                status: 404,
                data: {message: 'Information is missing',error: error}
            };            
        }
        if (!regex.test(value)){
            return {
                status: 404,
                data: {message: 'This amount is not allowed',error: error}
            };               
        }
        if (value.includes(',')){
            value = value.replace(',', '.');
        }
        
        const checkCoinOnDB = await coinsRepositories.checkInsertPermission(code);
        if (!checkCoinOnDB) {
            return {
                status: 400,
                data: {
                    message: 'This Currency not exists',
                }
            };                         
        }
    
        const amount = parseFloat(value);        
    
        const Coin = await coinsRepositories.updateCoin(code, name, amount);

        return {
            status: 200,
            data: {message: 'Currency update success',Coin}
        };

    } catch (error) {
        console.log(error);

        return {
            status: 500,
            data: {message: 'Internal Server Error',error: error}
        };        
    }    
}

const DeleteCoin = async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();      
        
        const result = await coinsRepositories.deleteCoin(code)

        if (result.deletedCount > 0) {
            return {
                status: 200,
                data: {
                    message: 'Currency Deleted'
                }
            };               
        } else {
            return {
                status: 404,
                data: {
                    message: 'Currency Not Deleted'
                }
            };               
        }       
        
    } catch (error) {
        console.log(error);        
        return {
            status: 500,
            data: {
                message: 'Internal Server Error',
                error: error
            }
        };                       
    }    
}

module.exports = {
    InsertCoin,
    DeleteCoin,
    ConvertCoinAmount,
    UpdateCoin
}
