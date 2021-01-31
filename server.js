const application = require('./src/bootstrap/app');

application.app.listen(3000, (err) => {
    if (err) process.exit(1);
    console.log("Listening to port 3000");
});