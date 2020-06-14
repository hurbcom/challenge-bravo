import heartbeatController from './controllers/heartbeatController.js';

export default {
	set(server) {
		heartbeatController.set(server);
	}
};
