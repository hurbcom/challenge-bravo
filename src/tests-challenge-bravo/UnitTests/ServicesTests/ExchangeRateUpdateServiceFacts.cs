using System;
using api_challenge_bravo.Model;
using api_challenge_bravo.Services;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ServicesTests
{
    public class ExchangeRateUpdateServiceFacts : UnitTestBase
    {
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