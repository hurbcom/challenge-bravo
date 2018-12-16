import convert from '../controllers/currency-conversion.controller';

const routes = (app) => {
    app.route('/api/conversion')
        .get(convert);
};

export default routes;
