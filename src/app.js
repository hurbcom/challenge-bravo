import express from "express";
import db from './config/db_connect.config.js';
import routes from './routes/index.js'

db.on("error", console.log.bind(console, "connection error"));
db.once("open", () => {
    console.log("connection successfully established");
});

//middlewares
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Acess-Control-Allow-Header',
        'Origin, X-Resqurested-With, Content-Type, Accept,Authorization'
    );
    if(req.method == 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods','POST,DELETE,GET');
        return res.status(200).send({});
    }
    next();
});

routes(app);

app.listen(process.env.PORT || '4040');

export default app;