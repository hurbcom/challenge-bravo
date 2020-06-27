import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { KitLogger } from './logger/services';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const logger: KitLogger = new KitLogger();
  app.useLogger(logger);

  const options = new DocumentBuilder()
    .setTitle('Bravo Challenge')
    .setDescription('The Bravo Challenge API description')
    .setVersion('1.0')
    .addTag('bravo')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(
    3000, '0.0.0.0',
    () => logger.log('App is listening on port 3000', 'NestApplication')
  );
}
bootstrap();
