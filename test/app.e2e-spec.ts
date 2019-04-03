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
            .then(({ payload, statusCode }) => {
                const payloadAsJson = JSON.parse(payload);
                expect(statusCode).to.equal(400);
                expect(payloadAsJson.errors).to.have.nested.property(
                    'from.isIn',
                );
                expect(payloadAsJson.errors).to.have.nested.property('to.isIn');
                expect(payloadAsJson.errors).to.have.nested.property(
                    'to.isNotEqualTo',
                );
                expect(payloadAsJson.errors).to.have.nested.property(
                    'amount.isPositive',
                );
                expect(payloadAsJson.errors).to.have.nested.property(
                    'amount.isNumber',
                );
            });
    });

    it('/converter?from=invalidFrom&to=invalidTo&amount=nan (GET) - Invalid data', () => {
        return app
            .inject({
                method: 'GET',
                url: '/converter?from=invalidFrom&to=invalidTo&amount=nan',
            })
            .then(({ payload, statusCode }) => {
                const payloadAsJson = JSON.parse(payload);
                expect(statusCode).to.equal(400);
                expect(payloadAsJson.errors).to.have.nested.property(
                    'from.isIn',
                );
                expect(payloadAsJson.errors).to.have.nested.property('to.isIn');
                expect(payloadAsJson.errors).to.have.nested.property(
                    'amount.isPositive',
                );
                expect(payloadAsJson.errors).to.have.nested.property(
                    'amount.isNumber',
                );
            });
    });

    it('/converter?from=USD&to=USD&amount=100 (GET) - Equal currencies', () => {
        return app
            .inject({
                method: 'GET',
                url: '/converter?from=USD&to=USD&amount=100',
            })
            .then(({ payload, statusCode }) => {
                const payloadAsJson = JSON.parse(payload);
                expect(statusCode).to.equal(400);
                expect(payloadAsJson.errors).to.have.nested.property(
                    'to.isNotEqualTo',
                );
            });
    });

    it('/converter?from=USD&to=BRL&amount=100 (GET) - Valid data', () => {
        return app
            .inject({
                method: 'GET',
                url: '/converter?from=USD&to=BRL&amount=100',
            })
            .then(({ payload, statusCode }) => {
                const payloadAsJson = JSON.parse(payload);
                expect(statusCode).to.equal(200);
                expect(payloadAsJson).to.have.nested.property('from');
                expect(payloadAsJson).to.have.nested.property('to');
                expect(payloadAsJson).to.have.nested.property(
                    'convertedAmount',
                );
            });
    });
});
