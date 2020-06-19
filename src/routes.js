import heartbeatController from './controllers/heartbeatController.js';
import exchangeConverterController from './controllers/exchangeController.js';
import currencyController from './controllers/currencyController.js';

export default {
	set(server) {
		heartbeatController.set(server);
		exchangeConverterController.set(server);
		currencyController.set(server);
	}
};
