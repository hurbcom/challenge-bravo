const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const User = require('../schemas/User');

const { generateToken } = require('../helpers/tokenHelpers');

class UserController {

    async authenticate(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ "message" : "User not found." });
        }

        if(!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ "message" : "Invalid password." });
        }

        user.password = undefined;
        const token =  generateToken({ id: user.id });
        return res.json({ "data" : user, token });
    }

    async register(req, res) {
        const { email } = req.body;

        try {
            if (await User.findOne({ email })) {
                return res.status(400).json({ "message" : "User already exists." });
            }

            const user = await User.create(req.body);
            user.password = undefined;
            const token = generateToken({ id: user.id });
            return res.status(201).json( { "data" : user, token } );
        } catch (e) {
            return res.status(400).json({ "message" : "Something wen wrong: " + e.message });
        }
    }
}

module.exports = new UserController();