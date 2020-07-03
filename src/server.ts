import 'reflect-metadata';
import express from 'express';

import routes from './routes/index';

const app = express();

app.use(routes);

app.listen(3333, () => {
    console.log('Server started on port 3333!');
});
