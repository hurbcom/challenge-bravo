import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


const clc = require('cli-color')
const port = (process.env.PORT || 3000)
const host = (process.env.HOST || '127.0.0.1')


async function bootstrap() {


    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const options = new DocumentBuilder()
      .setTitle('Challenge Bravo')
        .setDescription('Backend para o desafio Bravo')
         .setVersion('1.0')
           .addTag('Bravo')
             .build();
    const document = SwaggerModule.createDocument(app, options);
     SwaggerModule.setup('api', app, document);

    app.enableCors();

    app.useStaticAssets(join(__dirname, '..', 'public'));

    await app.listen(port, host);

    const server = clc.green(`http://${host}:${port}`);

    console.log(`Servidor iniciado em ${server}`);

}
bootstrap();
