import express from 'express';
import { currencyRouter } from './routes/currency.routes';

const app = express();
app.use(express.json());
app.use(currencyRouter);

export default app;
