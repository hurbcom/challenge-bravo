using System;
using api_challenge_bravo.Controllers;
using api_challenge_bravo.Model;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ControllersTests
{
    public class CurrenciesConvertControllerFacts : IDisposable
    {
        public CurrenciesConvertControllerFacts()
        {
            new Currency("TSTC1", "Testing Controller 1", 0.1948M, false, DateTime.Now);
        }

        [Fact]
        public void GetAllReturnItens()
        {
            var result = new CurrenciesController().Get("TSTC1");

            Assert.True(result.Value.Name == "Testing Controller 1");
        }

        public void Dispose()
        {
            Currency.Delete("TSTC1");
        }
    }
}