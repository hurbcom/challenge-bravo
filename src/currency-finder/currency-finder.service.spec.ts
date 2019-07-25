import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { CurrencyFinderService } from './currency-finder.service';
import { ExtApisService } from '../external-apis/ext-apis.service'


describe('CurrencyFinderService', () => {
  let service: CurrencyFinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CurrencyFinderService, ExtApisService],
    }).compile();

    service = module.get<CurrencyFinderService>(CurrencyFinderService);
  });


  it("Deve estar definido", () => {
      expect(service).toBeDefined();
  });


  it("ListAll('USD') Não pode retornar Null", () => {
      expect(service.ListAll('USD')).not.toBeNull()
  });


  it("Deve retornar um Objeto", () => {
      expect(service.ListAll('USD')).toBeInstanceOf(Object)
  });


  it("Deve retornar uma Promisse", () => {
      expect(service.All()).toBeInstanceOf(Promise);
  });


    it("find Deve retornar um Objeto", () => {
        expect(service.find('USD', 'BRL')).toBeInstanceOf(Object);
    });


});




