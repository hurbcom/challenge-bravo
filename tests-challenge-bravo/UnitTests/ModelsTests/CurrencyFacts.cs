using System;
using api_challenge_bravo.Model;
using Xunit;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace tests_challenge_bravo.UnitTests.ModelsTests
{
    public class CurrencyFacts
    {
        private readonly ITestOutputHelper _testOutputHelper;

        public CurrencyFacts(ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper;
            new Currency("BRL", "Real Brasileiro", 0.1948M, true);
            new Currency("EUR", "Euro", 1.0996M, true);
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
            var result = Currency.Get("BRL");

            Assert.True(result != null);
            Assert.True(result.Symbol == "BRL");
            Assert.True(result.Name == "Real Brasileiro");
        }

        [Fact]
        public void DeleteItemFromDB()
        {
            new Currency("RUB", "Rublo Russo", 0.0996M, true);
            var currency = Currency.Get("RUB");
            Assert.True(currency?.Symbol == "RUB");

            Currency.Delete("RUB");
            var result = Currency.Get("RUB");
            var resultList = Currency.GetAll();

            Assert.True(result == null);
            Assert.NotEmpty(resultList);
        }

        [Fact]
        public void UpdateExchangeRateCorrectValue()
        {
            var currency = Currency.Get("BRL");
            var sampleDate = new DateTime(2022, 1, 1, 12, 0, 0);

            currency.UpdateExchangeRate(0.42M,sampleDate);

            Assert.True(currency?.ExchangeRateInUSD == 0.42M);
            Assert.True(currency?.LastTimeUpdatedExchangeRate == sampleDate);
        }
    }
}