import express from 'express';
import Status from 'http-status';
import routes from './routes';
import morgan from 'morgan';
import errorHandler from './middlewares/error/handler';

function server({ app }) {
    app.use(express.json());

    app.use(morgan('dev'));

    app.get('/', (req, res) => res.status(Status.OK).json('Up and running!'));
    app.use('/api', routes());
    app.use(errorHandler);

    return app;
}

export default {
    start: ({ expressApp } = { expressApp: express() }) => server({ app: expressApp })
}