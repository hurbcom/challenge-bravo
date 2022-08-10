using CurrencyConverterAPI.Configuration;
using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.Models;
using MongoDB.Driver;

namespace CurrencyConverterAPI.Repositories.Implementation
{
    public class CoinRepository : ICoinRepository
    {
        private readonly IMongoCollection<Coin> _coins;
        private readonly ILogger<CoinRepository> _logger;

        public CoinRepository(IMongoClient client, IDatabaseConfiguration config, ILogger<CoinRepository> logger)
        {
            var db = client.GetDatabase(config.DatabaseName);
            _coins = db.GetCollection<Coin>(config.CoinsCollectionName);
            _logger = logger;
        }

        async Task<IEnumerable<Coin>> ICoinRepository.GetCoins()
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetCoins", string.Empty);
            return await _coins.Find(coin => true).ToListAsync();
        }

        async Task<Coin> ICoinRepository.GetCoin(long id)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetCoin", string.Empty);
            FilterDefinition<Coin> filter = Builders<Coin>.Filter.Eq(coin => coin.Id, id);
            return await _coins.Find(filter).FirstOrDefaultAsync();
        }

        async Task<Coin> ICoinRepository.CreateCoin(Coin coin)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "CreateCoin", string.Empty);
            await _coins.InsertOneAsync(coin);
            return coin;
        }

        async Task<bool> ICoinRepository.UpdateCoin(Coin coin)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "UpdateCoin", string.Empty);
            FilterDefinition<Coin> filter = Builders<Coin>.Filter.Eq(coin => coin.Id, coin.Id);
            ReplaceOneResult updateResult = await _coins.ReplaceOneAsync(filter: filter, replacement: coin);
            return updateResult.IsAcknowledged && updateResult.ModifiedCount > 0;
        }

        async Task<bool> ICoinRepository.DeleteCoin(long id)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "DeleteCoin", string.Empty);
            FilterDefinition<Coin> filter = Builders<Coin>.Filter.Eq(coin => coin.Id, id);
            DeleteResult deleteResult = await _coins.DeleteOneAsync(filter);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }
        async Task<bool> ICoinRepository.IsExistCoinById(long id)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "IsExistCoinById", string.Empty);
            FilterDefinition<Coin> filter = Builders<Coin>.Filter.Eq(coin => coin.Id, id);
            return await _coins.Find(filter).AnyAsync();
        }

        async Task<bool> ICoinRepository.IsExistCoinByAcronym(string acronym)
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "IsExistCoinByAcronym", string.Empty);
            FilterDefinition<Coin> filter = Builders<Coin>.Filter.Eq(coin => coin.Acronym, acronym);
            return await _coins.Find(filter).AnyAsync();
        }

        async Task<long> ICoinRepository.GetNextId()
        {
            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "GetNextId", string.Empty);
            var lastCoin = await _coins.Find(coin => true).SortByDescending(coin => coin.Id).FirstOrDefaultAsync();
            return lastCoin is null ? 1 : lastCoin.Id + 1;
        }
    }
}
