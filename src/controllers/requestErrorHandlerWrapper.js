
import restifyErrors from 'restify-errors';

/**
 * This wrapper wraps the handler function in a try catch block to 
 * leverage error handling. 
 * 
 * @param function The actual request handler 
 * @param {*} request The request
 * @param {*} response The response
 * @param {*} next the next handler in the chain
 */

function handleErrorAsync(handler, request, response, next) {
	return async function (request, response, next) {
		try {
			await handler(request, response, next)
		} catch (error) {
			if (!error instanceof restifyErrors.RestError)
				error = new restifyErrors.InternalServerError(error);
			
			return next(error);
		}
	}
}
export default handleErrorAsync;