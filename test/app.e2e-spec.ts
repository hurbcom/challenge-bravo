import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './../src/app.module';

describe('ConverterController (e2e)', () => {
    let app;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();
    });

    it('/converter (GET) - Empty data', () => {
        return request(app.getHttpServer())
            .get('/converter')
            .expect(400);
    });

    it('/converter?from=invalidFrom&to=invalidTo&amount=nan (GET) - Invalid data', () => {
        return request(app.getHttpServer())
            .get('/converter?from=invalidFrom&to=invalidTo&amount=nan')
            .expect(400);
    });

    it('/converter?from=USD&to=USD&amount=100 (GET) - Equal currencies', () => {
        return request(app.getHttpServer())
            .get('/converter?from=USD&to=USD&amount=100')
            .expect(400);
    });

    it('/converter?from=USD&to=BRL&amount=100 (GET) - Valid data', () => {
        return request(app.getHttpServer())
            .get('/converter?from=USD&to=BRL&amount=100')
            .expect(200);
    });
});
