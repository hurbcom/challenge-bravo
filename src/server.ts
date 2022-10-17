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

	private execute(): void {
		this.configs()
		this.middlewares()
		this.routes()
		this.database()
	}

	private configs (): void {
		this.express.set('port', process.env.PORT)
	}

	private middlewares(): void {
		this.express.use(bodyParser.json())
		this.express.use(bodyParser.urlencoded({ extended: true }))
	}

	private routes(): void {
		this.express.use(routes)
	}

	private async database(): Promise<void> {
		await AppDataSource.initialize()
	}
}



