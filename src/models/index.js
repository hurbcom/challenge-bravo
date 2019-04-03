import mongoose from 'mongoose';

import CurrentCurrency from './currentCurrency';
import AllowedCurrencies from './allowedCurrencies';

const connectDb = () => {
    return mongoose.connect(process.env.DATABASE_URL, {
        useCreateIndex: true,
        useNewUrlParser: true
    });
};

const models = {
    CurrentCurrency,
    AllowedCurrencies
};

export {
    connectDb
};

export default models;