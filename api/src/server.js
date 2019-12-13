const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes')
const port = process.env.PORT || 3333



app.use(express.json())
app.use(cors())
app.use(routes)

app.listen(port, () => console.log(`server is running on port: ${port}`))