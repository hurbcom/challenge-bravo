import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import {
    ClassSerializerInterceptor,
    ValidationPipe,
    VersioningType,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import helmet from "helmet";

import { TimeoutInterceptor } from "@/modules/common";
import { AppModule } from "@/app.module";

import env from "@/config/env";
import { AllExceptionsFilter } from "@/modules/common/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const refactor = new Reflector();
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true })
    );
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(refactor));
    app.useGlobalInterceptors(new TimeoutInterceptor(refactor));
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });

    const config = new DocumentBuilder()
        .setTitle("RPG API")
        .setDescription("Count number access")
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    app.use(helmet());
    await app.listen(env.app.port);
}

bootstrap();
