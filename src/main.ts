import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import { HttpExceptionFilter } from './libs/http-exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as npmPackage from '../package.json';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        preflightContinue: false,
        // allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });
    app.use(compression());
    app.use(helmet());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('Bravo Challenge')
        .setDescription('Test api to calculate quotations between currencies')
        .setVersion(npmPackage.version)
        .build();

    const document = SwaggerModule.createDocument(app, config);
    const documentUrl = 'docs';
    SwaggerModule.setup(documentUrl, app, document);

    await app.listen(process.env.API_PORT).then(() => {
        //TODO resolve env port before project start
        const logger = new Logger('BootstrapApi');
        logger.log(
            `Api started at: ${process.env.API_URL}:${process.env.API_PORT}`,
        );
        logger.log(
            `Swagger started at: ${process.env.API_URL}:${process.env.API_PORT}/${documentUrl}`,
        );
    });
}
bootstrap();
