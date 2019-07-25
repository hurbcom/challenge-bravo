import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { HttpModule } from '@nestjs/common';
import { CurrencyFinderService } from '../currency-finder/currency-finder.service';
import { ExtApisService } from '../external-apis/ext-apis.service';



describe('Crypto Controller', () => {
  let controller: CryptoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CryptoController],
      providers: [CryptoService, CurrencyFinderService, ExtApisService]
    }).compile();

    controller = module.get<CryptoController>(CryptoController);
  });


    it('should be defined', () => {
       expect(controller).toBeDefined();
    });


    it('should be instance of Object', () => {
        expect(controller.cryptoCoin('bitcoin')).toBeInstanceOf(Object);
    });


    it('should not be Null', () => {
        expect(controller.listingCrypto()).not.toBeNull();
    });


    it('should be instance of Object', () => {
        expect(controller.listingCrypto()).toBeInstanceOf(Object);
    });

    it('should be instance of Object', () => {
        expect(controller.listingCrypto()).toBeInstanceOf(Object);
    });



    it('should be instance of Object', () => {
        expect(controller.ConvertCryptoCoin('bitcoin', 'BRL', 10)).toBeInstanceOf(Object);
    });



});
