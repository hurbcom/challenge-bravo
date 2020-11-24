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

    const PORT = process.env.PORT;
    
    app.listen(PORT, () => {
        console.log(`Bravo Currency Exchange API is listening on port ${PORT}`);
    });

    return app;
}

export default {
    start: ({ expressApp }) => server({ app: expressApp } = { app: express() })
}