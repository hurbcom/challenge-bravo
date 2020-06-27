import 'reflect-metadata'
import { Server } from './server';
import DIContainer from './di-container';

const serverObject = DIContainer.resolve<Server>(Server);
const server = serverObject.server;

server.listen(3000, () => {
    console.log('Server running');
});