// Função com a lógica da criação de tokens para API
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    const secretKey = process.env.SECRET_KEY;
    const token_test = process.env.TOKEN_TEST;
    const env = req.params.env.toUpperCase();     
    if (!secretKey) {
        console.error('Error: Missing SECRET_KEY in .env file');
        process.exit(1);
    }

    if (!token) {
        return res.status(403).json({ message: 'Unauthorized - Missing token' });
    }

    if (env === "TEST" && token === token_test) {
        console.log("Chamada Teste");
        req.user = {
            userID: "challenge",
            passwordID: "bravo"
        };
        next();     

    }else {

        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: 'Unauthorized - Invalid token' });
        }

    }
};

module.exports = verifyToken;