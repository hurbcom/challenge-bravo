import 'reflect-metadata'
import { Server } from './server';
import DIContainer from './di-container';

// Entry point of the system

// Resolves the starting point of the dependency injection
const serverObject = DIContainer.resolve<Server>(Server);
const server = serverObject.server;

// Starts whe web api
server.listen(3000, () => {
    console.log('Server running');
});