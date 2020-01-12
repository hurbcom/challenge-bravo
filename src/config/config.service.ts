import { Injectable } from "@nestjs/common";
import * as fs from 'fs'
import * as dotenv from 'dotenv';
import { EnvConfig } from "./env.config";


@Injectable()
export class ConfigService {
    private envConfig: EnvConfig;

    constructor() {
        const output = dotenv.parse(fs.readFileSync(`.env.${process.env.NODE_ENV}`));
        this.envConfig = {
            API_KEY: output.API_KEY,
            NODE_ENV: output.NODE_ENV,
            DB_CONNECTION_NAME: output.DB_CONNECTION_NAME,
            DB_TYPE: output.DB_TYPE,
            DB_HOST: output.DB_HOST,
            DB_PORT: Number(output.DB_PORT),
            DB_DATABASE: output.DB_DATABASE,
            DB_USERNAME: output.DB_USERNAME,
            DB_PASSWORD: output.DB_PASSWORD,
        }
    }

    getEnvConfig(): EnvConfig {
        return this.envConfig;
    }
}