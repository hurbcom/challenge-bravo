using api_challenge_bravo.Model;
using api_challenge_bravo.Services;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ServicesTests
{
    public class CurrencyConvertServiceFacts
    {
        public CurrencyConvertServiceFacts()
        {
            new Currency("TSTCS1", "Testing Convert Service 1", 0.1948M, false);
            new Currency("TSTCS2", "Testing Convert Service 2", 1.0996M, false);
        }

        [Fact]
        public void ConvertingCorrectValue()
        {
            var result = CurrencyConvertService.Convert("TSTCS1","TSTCS2",10.42M);

            Assert.Equal(1.8459585303746817024372499086M,result.Result);
        }
    }
}