import bodyParser from 'body-parser';
import express from 'express';
import router from './routes';

const port = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json());
app.use(router);
app.use((_req, resp, _next) => resp.status(404).json({ message: 'Endpoint not found.' }));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
