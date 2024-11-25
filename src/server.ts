import app from './app';
import { appConfig } from './config/application';

const start = async () => {
  try {
    // FIXME: set port 3000 using appConfig.SERVER_PORT
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server running on port ${appConfig.SERVER_PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
