import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';
import { CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
    let service: CurrenciesService;
    let repository: CurrenciesRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CurrenciesService,
                {
                    provide: CurrenciesRepository, useFactory: () => (
                        {
                            getCurrency: jest.fn(),
                            createCurrency: jest.fn(),
                            deleteCurrency: jest.fn(),
                        })
                }],
        }).compile();

        service = module.get<CurrenciesService>(CurrenciesService);
        repository = module.get<CurrenciesRepository>(CurrenciesRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getCurrency()', () => {
        it('should be throw if repository throw', async () => {
            (repository.getCurrency as jest.Mock).mockRejectedValue(new InternalServerErrorException());
            await expect(service.getCurrency('INVALID')).rejects.toThrow(
                new InternalServerErrorException(),
            );
        });

        it('should be not throw if repository returns', async () => {
            await expect(service.getCurrency('USD')).resolves.not.toThrow();
        });

        it('should be called repository with correct params', async () => {
            await service.getCurrency('USD');
            expect(repository.getCurrency).toBeCalledWith('USD');
        });

        it('should be return when repository return', async () => {
            (repository.getCurrency as jest.Mock).mockReturnValue({});
            expect(await service.getCurrency('USD')).toEqual({});
        });
    });

    describe('createCurrency()', () => {

        it('should be not throw if repository returns', async () => {
            await expect(service.createCurrency('BRL')).resolves.not.toThrow();
        });

        it('should be throw if called with non valid currency', async () => {
            //empty currency string
            await expect(service.createCurrency('')).rejects.toThrow(
                new Error('Client requested create an unsupported currency'),
            );
            //invalid iso 4217 string
            await expect(service.createCurrency('AAA')).rejects.toThrow(
                new Error('Client requested create an unsupported currency'),
            );
            //invalid iso 4217 string
            await expect(service.createCurrency('DOLAR')).rejects.toThrow(
                new Error('Client requested create an unsupported currency'),
            );
        });

        it('should be called repository with correct params', async () => {
            await service.createCurrency('USD');
            expect(repository.createCurrency).toBeCalledWith('USD');
        });

        it('should be throw if external API dont support currency', async () => {
            //TODO
        });

        it('should be return when repository return', async () => {
            (repository.createCurrency as jest.Mock).mockReturnValue({} as Currencies);
            expect(await service.createCurrency('USD')).toEqual({} as Currencies);
        });

    });

    describe('deleteCurrency()', () => {

        it('should be not throw if repository returns', async () => {
          await expect(service.deleteCurrency('USD')).resolves.not.toThrow();
        });

        it('should be throw if called with non valid currency', async () => {
            //empty currency string
            await expect(service.deleteCurrency('')).rejects.toThrow(
                new Error('Client requested delete an unsupported currency'),
            );
            //invalid iso 4217 string
            await expect(service.deleteCurrency('AAA')).rejects.toThrow(
                new Error('Client requested delete an unsupported currency'),
            );
            //invalid iso 4217 string
            await expect(service.deleteCurrency('DOLAR')).rejects.toThrow(
                new Error('Client requested delete an unsupported currency'),
            );
        });

        it('should be called repository with correct params', async () => {
          await service.deleteCurrency('USD');
          expect(repository.deleteCurrency).toBeCalledWith('USD');
        });
      });
});
