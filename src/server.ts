import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes'
import { AppDataSource } from './configs/typeorm.config';
import 'dotenv/config'
export class ExpressServer {
	public express: express.Application = express();

	constructor() {
		this.execute()
  }

	private execute() {
		this.configs()
		this.middlewares()
		this.routes()
		this.database()
	}

	private configs () {
		this.express.set('port', process.env.PORT)
	}

	private middlewares() {
		this.express.use(bodyParser.json())
		this.express.use(bodyParser.urlencoded({ extended: true }))
	}

	private routes() {
		this.express.use(routes)
	}

	private async database() {
		await AppDataSource.initialize()
	}

}



