import { TypeOrmModule } from '@nestjs/typeorm';

export const typeormConfig = (): TypeOrmModule => {
    if (process.env.NODE_ENV === 'development') require('dotenv/config');
    return {
        type: 'postgres',
        url: process.env.DB_URL,
        host: process.env.DB_HOSTNAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        entities: [__dirname + '/../modules/**/entities/*.entity.{js,ts}'],
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
        ssl: false,
        // extra: {
        //     ssl: {
        //         rejectUnauthorized: false,
        //     },
        // },
        autoLoadEntities: true,
    };
};
