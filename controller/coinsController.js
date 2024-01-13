
const Coins = require('../models/coins');
const conversionCoins = require('../utils/conversCoins')
const coinsRepositories = require('../repositories/coinsRepositories');

const ConverCoinAmount = async (req, res) => {
    try {
        let {from, to, amount} = req.query;
        from = from.toUpperCase();
        to = to.toUpperCase();

        const regex = /^[0-9,.]+$/;  

        if (!(from && to && amount)) {
            return res.status(400).json('Oops! Missing data in the search, check and try again');
        }
        if (!regex.test(amount)){
            return res.status(403).json('This amount is not allowed')
        }
        if (amount.includes(',')){
            amount = amount.replace(',', '.');
        }

        // REDIS
        const originData = coinsRepositories.getOriginCoin(from);
        const comparativeData = coinsRepositories.getComparativeCoin(to);   

        const amountParse = parseFloat(amount);

        if (!originData) {
            return 400, {
                message: `This ${from} currency has not yet been added!`,
            };
        } else if (!comparativeData){
            return 400,{
                message: `This ${to} currency has not yet been added!`,
            };
        }

        const valueAmountComparative = conversionCoins(originData.value,comparativeData.value,amountParse);

        return 200,{
            message: `${from}=>${to}`,
            value: valueAmountComparative,
        };
    } catch (error) {
        console.log(error);
        return 500,{
            message: 'Internal Server Error',
            error: error
        };
    }    
}


const InsertCoin = async (req, res) => {
    try {
        let {code, name, value} = req.body;      
        const regex = /^[0-9,.]+$/;  
        code = code.toUpperCase();
    
        if (!(code && name && value)) {
            return res.status(404).json('Information is missing')
        }
        if (!regex.test(value)){
            return res.status(403).json('This amount is not allowed')
        }
        if (value.includes(',')){
            value = value.replace(',', '.');
        }
        
        const checkCoinOnDB = coinsRepositories.checkInsertPermission(code);
        if (checkCoinOnDB) {
            return 400,{
                message: 'This coin already exists',
            };
        }
    
        const amount = parseFloat(value);        
    
        const Coin = coinsRepositories.InsertCoin({code, name, amount});
    
        return 201,{message: 'Coin saved success',Coin};
    } catch (error) {
        console.log(error);

        return 500,{message: 'Internal Server Error',error: error};
    }    
}

const UpdateCoin = async (req, res) => {
    try {
        let {code, name, value} = req.body;              
        const regex = /^[0-9,.]+$/;  
        code = code.toUpperCase();
    
        if (!(code && name && value)) {
            return res.status(404).json('Information is missing')
        }
        if (!regex.test(value)){
            return res.status(403).json('This amount is not allowed')
        }
        if (value.includes(',')){
            value = value.replace(',', '.');
        }
        
        const checkCoinOnDB = coinsRepositories.checkInsertPermission(code);
        if (!checkCoinOnDB) {
            return 400,{
                message: 'This coin not exists',
            };
        }
    
        const amount = parseFloat(value);        
    
        const Coin = coinsRepositories.updateCoin({code, name, amount});
    
        return 201,{message: 'Coin update success',Coin};
    } catch (error) {
        console.log(error);

        return 500,{message: 'Internal Server Error',error: error};
    }    
}

const DeleteCoin = async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();      
        
        await Coins.deleteOne({code: code});        

        const deletedDocument = await Coins.findOne({ code: code });

        if (!deletedDocument) {
            return 200,{
                message: 'Coin deleted'
            };         
        } else {
            return 201,{
                message: 'Coin not deleted'
            };         
        }        
    } catch (error) {
        console.log(error);
        return 500,{
            message: 'Internal Server Error',
            error: error
        };
    }    
}

module.exports = {
    InsertCoin,
    DeleteCoin,
    ConverCoinAmount,
    UpdateCoin
}
