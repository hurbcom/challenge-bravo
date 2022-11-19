const { PORT, ENV } = require('./properties')
const app = require('./app')
const db = require('./database')

db.start()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running at port ${PORT} on environment ${ENV}`)
		})
	})
	.catch(() => {
		console.log('object')
		process.exit()
	})
