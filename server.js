const application = require('./src/bootstrap/app');

application.app.listen(3333, (err) => {
    if (err) process.exit(1);
    console.log("Listening to port 3333");
});