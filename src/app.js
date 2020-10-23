const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://desafio:desafio@cluster0-ltsls.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true 
});

app.use(require('./routes/routes'));

app.listen(process.env.PORT || 3333);

module.exports = app;