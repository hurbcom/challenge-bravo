require('dotenv').config();
require('module-alias/register');
const { dbConnect } = require('./src/db/database');


dbConnect(); 
 