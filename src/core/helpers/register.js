module.exports = (...middlewares) => app => middlewares.forEach(middleware => app.use(middleware));
