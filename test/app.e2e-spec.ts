import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should return 200 on /currency (GET)', () => {
        return request(app.getHttpServer()).get('/currency').expect(200);
    });

    it('should return 200 on /conversion (GET)', () => {
        return request(app.getHttpServer()).get('/conversion?from=BRL&to=USD&amount=1').expect(200);
    });
});
