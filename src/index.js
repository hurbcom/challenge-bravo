import express from 'express';
import dotenv from 'dotenv';
import Status from 'http-status';

dotenv.config();

const app = express();

app.get('/', (req, res) => res.status(Status.OK).json('Up and running!'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Bravo Currency Exchange API is listening on port ${PORT}`);
});