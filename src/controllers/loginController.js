const User = require('../models/User');
const loginRequestService = require('../services/loginRequestService');

/**
 * Faz login do usuário
 * 
 * @param {object} req
 * @param {object} res
 */
exports.doLogin = (req, res) => {
    // Obtendo campos
    const data = req.body

    // Validando os campos
    const errors = loginRequestService.validateLoginFields(data);
    if (errors.length > 0) {
        return res.status(400).send({status: 400, message: 'Erro de validação!', errors: errors});
    }

    // Obtendo hash da senha
    const hashedPassword = loginRequestService.getHashedPassword(data.password);

    // Procurando usuário no banco usando o username e a senha hasheada
    User.findOne({username: data.username, password: hashedPassword}, function(err, user) {
        if (err) { // Erro ao buscar dado no banco
            return res.status(500).send({status: 500, message: 'Erro ao verificar credenciais!'});
        } else if (!user) { // Usuário não encontrado
            return res.status(401).send({status: 401, message: 'O nome de usuário ou a senha está incorreto!'});
        }

        // Gerando JWT
        const token = loginRequestService.generateJwt({id: user._id, username: user.username});

        return res.status(200).send({status: 200, token_type: 'Bearer', token: token});
    });
}