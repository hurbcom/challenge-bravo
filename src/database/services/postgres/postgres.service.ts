import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { typeormConfig } from '../../../config/typeorm.config';

@Injectable()
export class PostgresService implements TypeOrmOptionsFactory {
    constructor(private _config: ConfigService) {}

    private ormConfig = (): TypeOrmModule => typeormConfig();

    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return this.ormConfig();
    }
}
