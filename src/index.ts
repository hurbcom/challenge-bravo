import connection from './infra/data/connection';
import setupApp from './setup-app';

import dotenv from 'dotenv';

dotenv.config();

const conn = connection();

setupApp(conn);