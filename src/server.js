const { PORT } = require('./properties')
const app = require('./app')

app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`)
})
