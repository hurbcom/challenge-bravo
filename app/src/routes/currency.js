module.exports = (app) => {
    const { currency } = app.src.controllers;
    const { currency: middleware } = app.src.middlewares;

    app.route('/api').get(middleware.validate, currency.convert);

}