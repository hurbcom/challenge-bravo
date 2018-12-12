import express from 'express';
import bodyParse from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

app.get('/', (req, res) => {
    res.send('Serve is running...');
})

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
