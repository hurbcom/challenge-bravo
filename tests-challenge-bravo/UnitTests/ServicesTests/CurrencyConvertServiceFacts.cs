using api_challenge_bravo.Model;
using api_challenge_bravo.Services;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ServicesTests
{
    public class CurrencyConvertServiceFacts
    {
        public CurrencyConvertServiceFacts()
        {
            new Currency("TEST1", "Testing Currency 1", 0.1948M, false);
            new Currency("TEST2", "Testing Currency 2", 1.0996M, false);
        }

        [Fact]
        public void ConvertingCorrectValue()
        {
            var result = CurrencyConvertService.Convert("TEST1","TEST2",10.42M);

            Assert.Equal(1.8459585303746817024372499086M,result.Result);
        }
    }
}