using AutoMapper;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.DTO;
using CurrencyConverterAPI.Domain.Models;
using CurrencyConverterAPI.Repositories;

namespace CurrencyConverterAPI.Application.AppServices.Implementation
{
    public class CoinAppService : ICoinAppService
    {
        private readonly ICoinRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<CoinAppService> _logger;
        public CoinAppService(ICoinRepository repository, IMapper mapper, ILogger<CoinAppService> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        Task<IEnumerable<Coin>> ICoinAppService.GetCoins()
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetCoins", string.Empty);
            return _repository.GetCoins();
        }

        Task<Coin> ICoinAppService.GetCoin(long id)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetCoin", string.Empty);
            return _repository.GetCoin(id);
        }

        Task<Coin> ICoinAppService.CreateCoin(CoinInput coin)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "CreateCoin", string.Empty);
            var coinEntity = _mapper.Map<Coin>(coin);
            coinEntity.Id = _repository.GetNextId().Result;
            coinEntity.NormalizeStrings();
            return _repository.CreateCoin(coinEntity);
        }

        Task<bool> ICoinAppService.UpdateCoin(long id, CoinInput coinInput)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "UpdateCoin", string.Empty);
            var coinDb = _repository.GetCoin(id).Result;
            coinDb.FillData(coinInput.Name, coinInput.Acronym, coinInput.Price);
            return _repository.UpdateCoin(coinDb);
        }

        Task<bool> ICoinAppService.DeleteCoin(long id)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "DeleteCoin", string.Empty);
            return _repository.DeleteCoin(id);
        }

        Task<bool> ICoinAppService.IsExistCoinById(long id)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "IsExistCoinById", string.Empty);
            return _repository.IsExistCoinById(id);
        }

        Task<bool> ICoinAppService.IsExistCoinByAcronym(string acronym)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "IsExistCoinByAcronym", string.Empty);
            return _repository.IsExistCoinByAcronym(acronym);
        }

        Task<IEnumerable<string>> ICoinAppService.GetAcronymCoins()
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetAcronymCoins", string.Empty);
            return _repository.GetAcronymCoins();
        }
    }
}
