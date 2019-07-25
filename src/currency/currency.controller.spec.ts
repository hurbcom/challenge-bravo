import { Test, TestingModule } from '@nestjs/testing';
import {  HttpModule } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { CurrencyFinderService } from '../currency-finder/currency-finder.service';
import { ExtApisService } from '../external-apis/ext-apis.service';


describe('Currency Controller', () => {
  let controller: CurrencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule,],
      controllers: [CurrencyController],
      providers: [CurrencyService, CurrencyFinderService, ExtApisService]
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });





});



