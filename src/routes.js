import pingController from './controllers/heartbeatController.js';

export default {
	set(server) {
		server.head('/isAlive', pingController.isAlive);
		server.get('/isAlive', pingController.isAlive);
	}
};
