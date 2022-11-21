const { PORT, ENV } = require('./properties')
const app = require('./app')
const dbConnection = require('./database/connection')
const scripts = require('./scripts')

dbConnection
	.start()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running at port ${PORT} on environment ${ENV}`)
		})

		scripts.initializeQuotationsInDB()
	})
	.catch((err) => {
		console.log(err.message)
		process.exit()
	})
