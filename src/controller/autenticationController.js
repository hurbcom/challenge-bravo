//Função responsavel por gerar TOKEN administrativo da api
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateAutenticationToken = (req, res) => {
    let {userID,passwordID} = req.body; 
    try {
        const userData = {
            user: userID,
            password: passwordID
        };
    
        const secretKey = process.env.SECRET_KEY; 
    
        const token = jwt.sign(userData, secretKey, { expiresIn: '1h' }); // Pode ajustar o tempo de expiração conforme necessário
    
        return {
            status: 200,
            data: {
                message: 'TEMPORARY TOKEN ACTIVATED: Timeout 1H',
                api_key: token
            }
        };   
        
    }catch (error) {
        console.log(error);
        return {
            status: 500,
            data: {message: 'Internal Server Error',error: error}
        };                  
    }       
}

module.exports = generateAutenticationToken;
