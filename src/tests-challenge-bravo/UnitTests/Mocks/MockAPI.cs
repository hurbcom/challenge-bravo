using System;
using System.Threading.Tasks;
using api_challenge_bravo.Services.Util.ExternalCurrencyAPI;

namespace tests_challenge_bravo.UnitTests.Mocks
{
    public class MockAPI : IExternalCurrencyAPI
    {
        public async Task<Tuple<decimal,DateTime>> GetExchangeRate(string symbol)
        {
            var mockExchangeRate = (decimal) new Random().Next(0, 1000) / 100;
            var mockUpdateDateTime = DateTime.UtcNow.ToUniversalTime();

            return Tuple.Create(mockExchangeRate,mockUpdateDateTime);
        }
        public bool CheckAvailabilityOfAutoUpdater(string symbol)
        {
            return true;
        }
    }
}