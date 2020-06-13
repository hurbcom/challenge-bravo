const erroHandler = require('@middlewares/errors-handler')

module.exports = class Server {
    constructor({ dependencies, routes }) {
        this.dependencies = {
            ...dependencies,
        }
        this.routes = routes
    } // crio classe Server que recebe as dependencias e as rotas

    async start() {
        const { dependencies, routes } = this
        this.setServerDependencies(dependencies)
        this.configureExpress(dependencies)
        this.startApi(dependencies, routes)
    }
    async scheduleJob(loop, job, instantStart) {
        this.dependencies.scheduler(loop, job.bind(this.dependencies))
        if (instantStart) {
            await job.bind(this.dependencies)()
        }
    }
    set(name, dependencie) {
        this.dependencies[name] = dependencie
    }
    setServerDependencies({ express }) {
        const app = express()
        this.set('app', app)
    }
    configureExpress({ app, cors, logger, bodyParser }) {
        app.use(cors())
        app.use(logger('dev'))
        app.use(erroHandler)
        app.use(
            bodyParser.urlencoded({
                extended: true,
                limit: '500mb',
            })
        )
        app.use(
            bodyParser.json({
                limit: '500mb',
            })
        )
    }
    startApi(dependencies, routes) {
        const { app } = dependencies
        const {
            env: { PORT },
        } = dependencies

        Object.entries(routes).forEach(([method, route]) => {
            route.forEach(({ path, callback }) => {
                app[method](path, callback)
            })
        })
        const { swaggerUi } = dependencies
        app.use(
            '/api-docs',
            swaggerUi.serve,
            swaggerUi.setup(require('./../swagger.config'), {
                customCss: '.swagger-ui .topbar { display: none }',
            })
        )

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`)
        })
    }
}
