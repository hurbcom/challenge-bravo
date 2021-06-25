export default (req, res, next) => {
    res.sendResponse = ({ status, message, data, error }) => {
        return (data) ?
            res.status(status).json({ message, data }) :
            res.status(status).json({ message, error });
    }

    next();
};