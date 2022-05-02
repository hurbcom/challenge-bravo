exports.validateQuery = (req, res, next) => {
    try {
        const validationErrors = [];
        ['from', 'to', 'amount'].forEach((param) => {
            const value = req.query[param];
            if (value === undefined || value === null) {
                validationErrors.push(`\`${param}\` is required`);
            } else if (param === 'amount') {
                const number = Number.parseFloat(value);
                if (Number.isNaN(number)) {
                    validationErrors.push(`\`${param}\` should be a number`);
                } else {
                    req.query[param] = number;
                }
            }
        });
        if (validationErrors.length === 0) {
            return next();
        }
        return res.status(400).send({ message: `Query parameters validation failed: ${validationErrors.join(', ')}.` });
    } catch (error) {
        return res.status(500).send({ message: 'Failed to calculate exchange.' });
    }
};
