module.exports = class Server {
    constructor ({dependencies, routes}){
        this.dependencies = {
            ...dependencies
        }
        this.routes = routes
    }// crio classe Server que recebe as dependencias e as rotas

    async start (){
        const {dependencies, routes} = this;
        this.setServerDependencies (dependencies);
        this.configureExpress(dependencies);
        this.startApi(dependencies, routes)
    }
    set(name, dependencie) {
        this.dependencies[name] = dependencie;
    }
    setServerDependencies({express}){
        const app = express();
        this.set("app", app)
    }
    configureExpress({app, cors, logger}){
        app.use(cors());
        app.use(logger('dev'));
    }
    startApi (dependencies, routes){
        const {app} = dependencies;
        const {env: {PORT}} = dependencies
        Object.entries(routes).forEach(([method,route]) =>{
            route.forEach(({path, callback})=>{
                app[method](path,callback.bind(dependencies))
            }
            )
        })
        app.listen(PORT, ()=>{
            console.log(`Servidor rodando em http://localhost:${PORT}` )
        })
    }

}