using System;
using api_challenge_bravo.Model;
using api_challenge_bravo.Model.Util;
using api_challenge_bravo.Services;
using api_challenge_bravo.Services.Util.ExternalCurrencyAPI;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ServicesTests
{
    public class ExchangeRateUpdateServiceFacts
    {
        public ExchangeRateUpdateServiceFacts()
        {
            // Mock DataBase inMemory and ExternalAPI
            AppDbContext.SetTestingEnvironment();
            ExternalCurrencyAPI.Registry(new MockAPI());
        }

        [Fact]
        public void UpdateExchangeRateAfterTTL()
        {
            var currency = new Currency("BRL", "Testing Update Service", 0.1948M, true, DateTime.UtcNow.AddSeconds(-31));

           ExchangeRateUpdateService.CheckTTLForNewUpdate("BRL");

           var UpdatedCurrency = Currency.Get("BRL");

            Assert.True(currency.LastTimeUpdatedExchangeRateUTC < UpdatedCurrency.LastTimeUpdatedExchangeRateUTC);
        }
    }
}