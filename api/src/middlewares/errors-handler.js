module.exports = async (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (err.statusCode === 500) {
        console.error({ message: err.message, stack: err.stack });
    }
    res.status(err.statusCode).send({ message: err.message, stack: err.stack });
};
