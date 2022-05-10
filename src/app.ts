import bodyParser from 'body-parser';
import express from 'express';
import { databaseSeeder } from './database';
import { Database } from './database/database';
import router from './routes';

(async () => {
  const port = process.env.PORT || 3001;
  const app = express();

  app.use(bodyParser.json());
  app.use(router);
  app.use((_req, resp, _next) => resp.status(404).json({ message: 'Endpoint not found.' }));

  await Database.connect();
  await databaseSeeder.run();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
