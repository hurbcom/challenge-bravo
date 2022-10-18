import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes'
import { AppDataSource } from '../configs/typeorm.config';
import { redisClient } from '../configs/redis.config';
import 'dotenv/config'
import { errorMiddleware } from './middlewares/error.middleware';

export class ExpressServer {
	public express: express.Application = express();

	constructor() {
		this.execute()
  }

	private execute(): void {
		this.configs()
		this.payloadMiddlewares()
		this.routes()
		this.errorMiddlewares()
		this.database()
	}

	private configs (): void {
		this.express.set('port', process.env.PORT)
	}

	private payloadMiddlewares(): void {
		this.express.use(bodyParser.json())
		this.express.use(bodyParser.urlencoded({ extended: true }))
	}

	private errorMiddlewares(): void {
		this.express.use(errorMiddleware)
	}

	private routes(): void {
		this.express.use(routes)
	}

	private async database(): Promise<void> {
		await AppDataSource.initialize()
	}
}



