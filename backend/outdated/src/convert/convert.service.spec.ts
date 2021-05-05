import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from '../currencies/currencies.service';
import { ConvertService } from './convert.service';
import { ExchangeInputType } from './types/convert-input.type';

describe('ConvertService', () => {
  let service: ConvertService;
  let currenciesService: CurrenciesService;
  let mockInputData;


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
    mockInputData = {from:'USD', to: 'EUR', amount: 10.00} as ExchangeInputType

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if called with invalid params', async () => {
    //from invalid currency to valid currency
    mockInputData.from = ''
    await expect(service.currencyConvert(mockInputData))
    .rejects.toThrow(new BadRequestException())

    //from valid currency to invalid currency
    mockInputData.to = ''
    await expect(service.currencyConvert(mockInputData))
    .rejects.toThrow(new BadRequestException())

    //invalid amount
    mockInputData.amount = null
    await expect(service.currencyConvert(mockInputData))
    .rejects.toThrow(new BadRequestException())
  });

  it('should be not throw if called with valid params', async () => {
    await expect(service.currencyConvert(mockInputData))
    .resolves.not.toThrow();
  });

  /*GetCurrency deve ser chamado para garantir que apenas moedas cadastradas sejam consultadas*/
  it('should be called getCurrency twice', async () => {
    await service.currencyConvert(mockInputData);
    expect(currenciesService.getCurrency).toBeCalledTimes(2);
  });

  it('should be called getCurrency with correct params', async () => {
    await service.currencyConvert(mockInputData);
    expect(currenciesService.getCurrency).toBeCalledWith(mockInputData.from);
    expect(currenciesService.getCurrency).toHaveBeenLastCalledWith(mockInputData.to);
  });

  it('should be throw when getCurrency throw', async () => {
    (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error());
    await expect(service.currencyConvert(mockInputData)).rejects.toThrow(new InternalServerErrorException());
  });

  //TESTS TO IMPLEMENT:

   /*call second external API if main API gives timeout*/
   it('should be backup API endpoint if main API timeout', async () => {
    //TODO:
    expect(service).toBeDefined();
  });

  /*invalid base currency */
   it('should be throw if called with invalid base currency', async () => {
    //TODO:
    expect(service).toBeDefined();
  });






});
