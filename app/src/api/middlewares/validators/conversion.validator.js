import { BadRequest } from "../error/model/HttpError";

export default (req, res, next) => {
    const { from, to, amount } = req.query;
    
    if (!from) return next(new BadRequest('from currency missing'));
    if (!to) return next(new BadRequest('to currency missing'));
    if (!amount) return next(new BadRequest('amount to convert missing'));

    const decimal = Number.parseFloat(amount);

    if(Number.isNaN(decimal)) return next(new BadRequest('amount is not a number'));

    next();
}