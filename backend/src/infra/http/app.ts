import 'reflect-metadata';
import '@container/index';

import express from 'express';

import { routes } from './routes';

const app = express();

app.use(routes);

export { app };
