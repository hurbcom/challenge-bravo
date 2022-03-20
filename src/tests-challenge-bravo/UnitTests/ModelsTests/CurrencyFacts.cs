using System;
using api_challenge_bravo.Model;
using api_challenge_bravo.Model.Util;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ModelsTests
{
    public class CurrencyFacts : IDisposable
    {
        public CurrencyFacts()
        {
            AppDbContext.SetTestingEnvironment();
            new Currency("TSTM1", "Test Model 1", 0.1948M, true, DateTime.Now);
            new Currency("TSTM2", "Test Model 2", 1.0996M, false, DateTime.Now);
        }

        [Fact]
        public void GetAllReturnItens()
        {

            var resultList = Currency.GetAll();

            Assert.NotEmpty(resultList);
        }

        [Fact]
        public void GetReturnCorrectValues()
        {
            var result = Currency.Get("TSTM1");

            Assert.True(result != null);
            Assert.True(result.Symbol == "TSTM1");
            Assert.True(result.Name == "Test Model 1");
        }

        [Fact]
        public void AddNotRealCoinSetFlagAutoUpdate()
        {
            var result = Currency.Get("TSTM1");

            Assert.False(result.AutoUpdateExchangeRate);
        }

        [Fact]
        public void DeleteItemFromDB()
        {
            new Currency("TSTM3", "Test Model 3", 0.0996M, false, DateTime.Now);
            var currency = Currency.Get("TSTM3");
            Assert.True(currency?.Symbol == "TSTM3");

            Currency.Delete("TSTM3");
            var result = Currency.Get("TSTM3");
            var resultList = Currency.GetAll();

            Assert.True(result == null);
            Assert.NotEmpty(resultList);
        }

        [Fact]
        public void UpdateExchangeRateCorrectValue()
        {
            var currency = Currency.Get("TSTM1");
            var sampleDate = new DateTime(2022, 1, 1, 12, 0, 0).ToUniversalTime();

            currency.UpdateExchangeRate(0.42M,sampleDate);

            Assert.True(currency?.ExchangeRateInUSD == 0.42M);
            Assert.True(currency?.LastTimeUpdatedExchangeRateUTC == sampleDate);
        }

        public void Dispose()
        {
            Currency.Delete("TSTM1");
            Currency.Delete("TSTM2");
        }
    }
}