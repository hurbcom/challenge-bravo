import bodyParser from 'body-parser';
import express from 'express';
import { Database } from './database/database';
import router from './routes';

const main = async () => {
  const port = process.env.PORT || 3001;
  const app = express();

  app.use(bodyParser.json());
  app.use(router);
  app.use((_req, resp, _next) => resp.status(404).json({ message: 'Endpoint not found.' }));

  await Database.connect();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

main();
