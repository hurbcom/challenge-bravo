using CurrencyConverterAPI.CrossCutting.Log;
using CurrencyConverterAPI.Domain.Models;
using MongoDB.Driver;

namespace CurrencyConverterAPI.Configuration.Implementation
{
    public class DatabaseIndexesConfiguration : IHostedService
    {
        private readonly IMongoClient _client;
        private readonly IDatabaseConfiguration _config;
        private readonly ILogger<DatabaseIndexesConfiguration> _logger;

        public DatabaseIndexesConfiguration(IMongoClient client, IDatabaseConfiguration config, ILogger<DatabaseIndexesConfiguration> logger)
        {
            _client = client;
            _config = config;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            var db = _client.GetDatabase(_config.DatabaseName);
            var coins = db.GetCollection<Coin>(_config.CoinsCollectionName);

            Logger.LoggerClass(_logger, this.GetType().Name.ToUpper(), false, "StartAsync", "Creating 'Id' and 'Acronym' index on events");

            var idIndex = Builders<Coin>.IndexKeys.Ascending(x => x.Id);
            var acronymIndex = Builders<Coin>.IndexKeys.Ascending(x => x.Acronym);
            var indexKeysDefinitions = new List<CreateIndexModel<Coin>> { new CreateIndexModel<Coin>(idIndex), new CreateIndexModel<Coin>(acronymIndex) };

            await coins.Indexes.CreateManyAsync(indexKeysDefinitions, cancellationToken: cancellationToken);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
