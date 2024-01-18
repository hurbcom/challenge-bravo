// Arquivo controller com funções logicas de rotas da API Conversão
const conversionCoins = require('../utils/conversCoins')
const coinsRepositories = require('../repositories/coinsRepositories');
const redisRepositories = require("../repositories/redisRepositories");


const ConvertCoinAmount = async (req, res) => {
// Função resposável pela tratativa e logica dos valores a serem convertidos pela rota GET

    try {
        let {from, to, amount} = req.query;
        const env = req.params.env.toUpperCase();             
        from = from.toUpperCase();
        to = to.toUpperCase();
        const keyRedis = `${from}-${to}`;
        const redisResponse = await redisRepositories.getRedisDataOriginal(keyRedis);

        if (!redisResponse) {         
            const regex = /^[0-9,.]+$/;  

            //Bloco de tratativas de dados encaminhados para o endpoint
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
                
            const dataOriginalObj = await coinsRepositories.getOriginCoin(from,env);   
            const dataComparativeObj = await coinsRepositories.getComparativeCoin(to,env);

            const amountParse = parseFloat(amount);
    
            //Bloco de validação de dados: Existe no banco ?     
            if (!dataOriginalObj || dataOriginalObj === null) {
                return {
                    status: 400,
                    data: {
                        message: `This ${from} currency has not yet been added!`,
                    }
                };
            }else if(dataOriginalObj === 400){
                return {
                    status: 400,
                    data: {
                        message: 'Oops! Missing data in the search, check and try again',
                    }
                };                
            }
            else{
                // Em caso de NÃO existir os dados no cache porem EXISTIR no banco
                // Será retornado o valor encontrado no banco e salvo no cache para pesquisas futuras
                originalAmount = dataOriginalObj.value;
            }
    
            if (!dataComparativeObj || dataComparativeObj === null) {            
                return {
                    status: 400,
                    data: {
                        message: `This ${to} currency has not yet been added!`,
                    }
                };
            }else{            
                comparativeAmount = dataComparativeObj.value;                     
            }            
    
            // Chamada para função - Conversão de moedas
            const comparativeObj = {code: to, amount: comparativeAmount};
            const originalObj = {code: from, amount: originalAmount};
    
            let {status,data} = conversionCoins(comparativeObj,originalObj,amountParse);
            await redisRepositories.insertRedisData(keyRedis,data.value);
            return {
                status: status,
                data: data
            };        
        }else{
            return {
                status: 200,
                data: {
                    message: `${from} => ${to}`,
                    value: redisResponse,
                }
            };     
        }
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            data: {
                error: error,
            }
        };
    }    
}

const InsertCoin = async (req, res) => {
    // Função responsável pela inserção de dados no banco

    try {
        let {code, name, value} = req.body;   
        const env = req.params.env.toUpperCase();    

        const regexValueTest = /^[0-9,.]+$/;  
        const regexCodeTest = /^[A-Za-z,0-9]+$/;
        code = code.toUpperCase();
    
        //Bloco de tratativas de dados encaminhados para o endpoint 
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
        
        // Checando existencia da moeda no banco
        const checkOnDB = await coinsRepositories.checkInsertPermission(code,env);
        
        if (checkOnDB) {            
            return {
                status: 400,
                data: {
                    message: 'This coin already exists',
                }
            };                        
        }else if (checkOnDB === 400){
            return {
                status: 400,
                data: {
                    message: 'Environment is missing',
                }
            };            
        }
    
        //Chamada para função de inserção
        const amount = parseFloat(value);        
    
        const Coin = await coinsRepositories.insertCoin(code, name, amount,env);
    
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
    // Função responsável pelo update de dados no banco    
    try {
        let {code, name, value} = req.body;   
        const env = req.params.env.toUpperCase();                       
        const regex = /^[0-9,.]+$/;  
        code = code.toUpperCase();
    
        //Bloco de tratativas de dados encaminhados para o endpoint 
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
        
        // Checando existencia da moeda no banco        
        const checkCoinOnDB = await coinsRepositories.checkInsertPermission(code,env);
        if (!checkCoinOnDB) {
            return {
                status: 400,
                data: {
                    message: 'This Currency not exists',
                }
            };                         
        }else if (checkCoinOnDB === 400){
            return {
                status: 400,
                data: {
                    message: 'Environment is missing',
                }
            };            
        }
    
        // Chamada para função de update
        const amount = parseFloat(value);        
    
        const Coin = await coinsRepositories.updateCoin(code, name, amount,env);

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
    // Função responsável pelo delete dos items no banco
    try {
        let {env,code} = req.params;        
        env = env.toUpperCase();      
        code = code.toUpperCase();
        const result = await coinsRepositories.deleteCoin(code,env)

        // Verificando status da exclusão
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
