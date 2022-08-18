import app, { init } from './index.js'

const PORT = +process.env.PORT || 4000

init().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}.`)
	})
})
