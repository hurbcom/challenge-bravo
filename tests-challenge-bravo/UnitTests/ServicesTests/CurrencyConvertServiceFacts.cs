using System;
using api_challenge_bravo.Model;
using api_challenge_bravo.Services;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ServicesTests
{
    public class CurrencyConvertServiceFacts
    {

        [Fact]
        public void ConvertingCorrectValue()
        {
            var fromCurrency = new Currency("TSTCS1", "Testing Convert Service 1", 0.1948M, false, DateTime.Now);
            var toCurrency = new Currency("TSTCS2", "Testing Convert Service 2", 1.0996M, false, DateTime.Now);

            decimal rate;
            DateTime? date;
            (rate,date) = CurrencyConvertService.Convert(fromCurrency,toCurrency,10.42M).Result;

            Assert.Equal(1.8459585303746817024372499086M,rate);
        }
    }
}