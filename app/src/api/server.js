import express from 'express';
import Status from 'http-status';
import routes from './routes';
import morgan from 'morgan';

function server({ app }) {

    app.use(express.json());

    app.use(morgan('dev'));

    app.get('/', (req, res) => res.status(Status.OK).json('Up and running!'));
    app.use('/api', routes());

    const PORT = process.env.PORT;
    
    app.listen(PORT, () => {
        console.log(`Bravo Currency Exchange API is listening on port ${PORT}`);
    });

    return app;
}

export default {
    start: () => server({ app: express() })
}