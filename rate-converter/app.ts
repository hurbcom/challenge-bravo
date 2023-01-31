import { config } from 'dotenv';
import express, { Application, Request, Response } from 'express';

import conversionRoutes from './routes/conversion.routes';

config();

const app: Application = express();


app.use(express.json());

app.use(express.json());
app.use('/api', conversionRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
