import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConvertService, CurrenciesService } from './convert.service';


describe('ConvertService', () => {
  let service: ConvertService;
  let currenciesService: CurrenciesService;

  beforeEach(async () => {
    const currenciesServiceMock = {
        getCurrency: jest.fn().mockReturnValue({ value: 1 }),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvertService,
        {provide: CurrenciesService, useFactory: ()=> currenciesServiceMock}],
    }).compile();

    service = module.get<ConvertService>(ConvertService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if called with invalid params', async () => {
    //from invalid currency to valid currency
    await expect(service.currencyConvert({from:'', to: 'EUR', amount: '10.00'}))
    .rejects.toThrow(new BadRequestException())

    //from valid currency to invalid currency
    await expect(service.currencyConvert({from:'EUR', to: '', amount: '5.00'}))
    .rejects.toThrow(new BadRequestException())

    //invalid amount
    await expect(service.currencyConvert({from:'USD', to: 'EUR', amount: ''}))
    .rejects.toThrow(new BadRequestException())
  });

  it('should be not throw if called with valid params', async () => {
    await expect(service.currencyConvert({from:'USD', to: 'EUR', amount: '10'}))
    .resolves.not.toThrow();
  });

  /*GetCurrency deve ser chamado para garantir que apenas moedas cadastradas sejam consultadas*/
  it('should be called getCurrency twice', async () => {
    await service.currencyConvert({from:'USD', to: 'EUR', amount: '10'});
    expect(currenciesService.getCurrency).toBeCalledTimes(2);
  });

  it('should be called getCurrency with correct params', async () => {
    await service.currencyConvert({from:'USD', to: 'EUR', amount: '10'});
    expect(currenciesService.getCurrency).toBeCalledWith('USD');
    expect(currenciesService.getCurrency).toHaveBeenLastCalledWith('EUR');
  });

  it('should be throw when getCurrency throw', async () => {
    (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error());
    await expect(service.currencyConvert({from:'USD', to: 'EUR', amount: '10'})).rejects.toThrow(new InternalServerErrorException());
  });




});
