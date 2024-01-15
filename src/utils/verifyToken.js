const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        console.error('Error: Missing SECRET_KEY in .env file');
        process.exit(1);
    }

    if (!token) {
        return res.status(403).json({ message: 'Unauthorized - Missing token' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = verifyToken;