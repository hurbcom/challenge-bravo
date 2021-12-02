import app from './config/app'
import env from './config/env'

app.listen(env.port, () => console.log(`Server running on port http://localhost:${env.port}`))
