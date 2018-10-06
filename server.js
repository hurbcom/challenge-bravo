const app = require('./src/app');


const server = app.listen(process.env.PORT || 3000, () => {
  const { port } = server.address();
  console.log(`CHALLENGE-BRAVO STARTED ON PORT: ${port}!`);
});
