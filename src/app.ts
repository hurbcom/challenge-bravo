import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import Controller from './controller/ControllerInterface';

class App {

    public app: express.Application;

    constructor (controllers: Controller[]) {
        this.app = express()
        this.initializeMiddlewares()
        this.initializeControllers(controllers)
    }

    public listen() {
        this.app.listen(3000, () => {
          console.log(`App listening on the port 3000`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(express.json())
        this.app.use(cors())
      }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
          this.app.use('/', controller.router);
        });
    }

}

export default App;