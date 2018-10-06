const app = require('./src/app');
const { env } = require('./src/core/helpers');


const server = app.listen(env.PORT || 3000, () => {
  const { port } = server.address();
  console.log(`CHALLENGE-BRAVO STARTED ON PORT: ${port}!`);
});
