import express from 'express';
import dotenv from 'dotenv';
import Status from 'http-status';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => res.status(Status.OK).json('Up and running!'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Bravo Currency Exchange API is listening on port ${PORT}`);
});