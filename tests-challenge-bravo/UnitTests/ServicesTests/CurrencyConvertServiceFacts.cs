using System;
using api_challenge_bravo.Model;
using api_challenge_bravo.Model.Util;
using api_challenge_bravo.Services;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ServicesTests
{
    public class CurrencyConvertServiceFacts : IDisposable
    {
        public CurrencyConvertServiceFacts()
        {
            AppDbContext.SetTestingEnvironment();
        }

        [Fact]
        public void ConvertingCorrectValue()
        {
            var fromCurrency = new Currency("TSTS1", "Testing Service 1", 0.1948M, false, DateTime.Now);
            var toCurrency = new Currency("TSTS2", "Testing Service 2", 1.0996M, false, DateTime.Now);

            decimal rate;
            DateTime date;
            (rate,date) = CurrencyConvertService.Convert("TSTS1","TSTS2",10.42M).Result;

            Assert.Equal(1.8459585303746817024372499086M,rate);
        }

        public void Dispose()
        {
            Currency.Delete("TSTS1");
            Currency.Delete("TSTS2");
        }
    }
}