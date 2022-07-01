const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 8000;

require('dotenv').config();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());

require('./app/routes/conversionRoutes')(app);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
