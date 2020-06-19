import restify from 'restify';
import corsMiddleware from 'restify-cors-middleware';

import {connections, appParameters} from './config.js';

const server = restify.createServer({ name: 'Currencies-Api' });

//configuring Cross origin request
const cors = corsMiddleware({
	preflightMaxAge: 5, //Optional
	origins: appParameters.cors,
	allowHeaders: [
		'authorization',
		'x-requested-with',
		'Content-MD5',
		'Date',
		'Accept-Version',
		'Api-Version',
		'Response-Time'
	],
	credentials: true
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.bodyParser({ mapParams: true }));

//configuring routes
import routes from './routes.js';
routes.set(server);

//global errors handling
server.on('restifyError', function (req, res, error, next) {
	if (!error.handled) {
		// here we should log the error on some external service for monitoring/metrics purpose like
		// https://sentry.io/
		console.log('log on sentry');
	  }
	  next();
});

server.on('uncaughtException', (request, response, route, error) => {
	console.error ('global uncaught exception handler');
	console.error(e.stack || e);
	response.send(500);
});

process.on('unhandledRejection', (error) => {
	console.error ('global Unhandled Promise Rejection handler');
	console.error(error.stack || error);
	process.exit(1);
});

server.listen(8080, function () {
	console.log('%s listening at %s', server.name, server.url);
});

server.timeout = 3 * 1000;//3 sec
