const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateAutenticationToken = (req, res) => {
    let {userID,passwordID} = req.body; 
    try {
        // Informações do usuário que você deseja incluir no token
        const userData = {
            user: userID,
            password: passwordID
        };
    
        // Sua chave secreta para assinar o token
        const secretKey = process.env.SECRET_KEY; 
    
        const token = jwt.sign(userData, secretKey, { expiresIn: '1h' }); // Pode ajustar o tempo de expiração conforme necessário
    
        return {
            status: 200,
            data: {
                message: 'TOKEN TEMPORÁRIO ATIVADO: Tempo Limite 1H',
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
