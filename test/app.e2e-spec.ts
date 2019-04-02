import { expect } from 'chai';
import { ValidationPipe } from '@nestjs/common';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from './../src/app.module';

describe('ConverterController (e2e)', () => {
    let app: NestFastifyApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication<NestFastifyApplication>(
            new FastifyAdapter(),
        );
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/converter (GET) - Empty data', () => {
        return app
            .inject({
                method: 'GET',
                url: '/converter',
            })
            .then(({ statusCode }) => expect(statusCode).to.equal(400));
    });

    it('/converter?from=invalidFrom&to=invalidTo&amount=nan (GET) - Invalid data', () => {
        return app
            .inject({
                method: 'GET',
                url: '/converter?from=invalidFrom&to=invalidTo&amount=nan',
            })
            .then(({ statusCode }) => expect(statusCode).to.equal(400));
    });

    it('/converter?from=USD&to=USD&amount=100 (GET) - Equal currencies', () => {
        return app
            .inject({
                method: 'GET',
                url: '/converter?from=USD&to=USD&amount=100',
            })
            .then(({ statusCode }) => expect(statusCode).to.equal(400));
    });

    it('/converter?from=USD&to=BRL&amount=100 (GET) - Valid data', () => {
        return app
            .inject({
                method: 'GET',
                url: '/converter?from=USD&to=BRL&amount=100',
            })
            .then(({ statusCode }) => expect(statusCode).to.equal(200));
    });
});
