require("dotenv-safe").config();
require('../src/db'); // Conexão com o banco.
const crypto = require('crypto');
const Currency = require('../src/models/Currency');
const User = require('../src/models/User');
const sync = require('../sync/updateCurrenciesValue');

// Obtendo usuário do .env e senha hasheada
const username = process.env.DEFAULT_USER_LOGIN || 'admin';
const password = process.env.DEFAULT_USER_PASSWORD || 'secret';
const salt = process.env.HASH_SALT || 'secret';
const hashedPassword = crypto.createHmac('sha256', salt).update(password).digest('hex');

// Remover todos os usuários
User.remove({}, (err) => {
    if (err) {
        console.log('Erro ao remover usuários.', err);
        process.exit();
    }
    // Criar usuário padrão
    User.create({username: username, password: hashedPassword}, (err) => {
        if (err) {
            console.log('Erro ao criar usuário padrão.', err);
            process.exit();
        }
        // Remover todas as moedas
        Currency.remove({}, (err) => {
            if (err) {
                console.log('Erro ao remover moedas.', err);
                process.exit();
            }
            const currencies = [
                {currency: 'USD', usd_value: 1},
                {currency: 'BRL', usd_value: 5.54},
                {currency: 'EUR', usd_value: 0.83},
                {currency: 'BTC', usd_value: 0.000016},
                {currency: 'ETH', usd_value: 0.00041},
            ];
        
            // Criar moedas padrão
            Currency.insertMany(currencies).then(() => {
                // Sincronizando taxas de câmbio
                sync.syncCurrencies(() => {
                    console.log('Banco criado com sucesso!');
                    console.log('Login:', username);
                    console.log('Senha:', password);
                    process.exit();
                });
            }).catch((err) => {
                if (err) {
                    console.log('Erro ao inserir moedas.', err);
                    process.exit();
                }
            });
        });
    });
});