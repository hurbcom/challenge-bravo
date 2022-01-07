import app from './config/express.js'
import { PORT } from './config/index.js'

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
