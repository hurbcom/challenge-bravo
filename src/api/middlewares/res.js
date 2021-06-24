export default (req, res, next) => {
    res.sendResponse = (status, message, data = {}) => {
        return res.status(status).json({ message, data });
    }

    next();
};