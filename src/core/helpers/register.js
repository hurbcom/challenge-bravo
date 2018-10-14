module.exports = (...middlewares) => (app) => {
  const appFn = middleware => app.use(...middleware);
  return middlewares.forEach(appFn);
};
