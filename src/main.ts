import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000).then(() => {
        //TODO resolve env port before project start
        const logger = new Logger('BootstrapApi');
        logger.log(
            `Api started at: ${process.env.API_URL}:${process.env.API_PORT}`,
        );
    });
}
bootstrap();
