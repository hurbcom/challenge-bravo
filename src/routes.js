import heartbeatController from './controllers/heartbeatController.js';
import exchangeConverterController from './controllers/exchangeController.js';

export default {
	set(server) {
		heartbeatController.set(server);
		exchangeConverterController.set(server);
	}
};
