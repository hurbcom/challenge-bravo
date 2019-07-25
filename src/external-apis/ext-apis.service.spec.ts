import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { ExtApisService } from './ext-apis.service';
import { Observable } from 'rxjs';



describe('ExtApisService', () => {
  let service: ExtApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExtApisService],
    }).compile();

    service = module.get<ExtApisService>(ExtApisService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('Deve retornar um Observable', () => {
      expect(service.AlternativeAPI('bitcoin')).toBeInstanceOf(Observable);
  });


    it('Deve retornar um Object', () => {
        expect(service.AlternativeConvert('bitcoin')).toBeInstanceOf(Object);
    });


   it('Deve retornar um Object', () => {
       expect(service.AlternativeListing()).toBeInstanceOf(Object);
   });




});
