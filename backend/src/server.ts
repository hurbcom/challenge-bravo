import express from 'express';
import routes from './routes';
import cors from 'cors';
import { errors } from 'celebrate';
import { environment } from '../environment';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

app.listen(environment.connectionStrings.port);
