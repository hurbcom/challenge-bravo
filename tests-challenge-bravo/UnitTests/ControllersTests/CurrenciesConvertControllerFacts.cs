using System;
using api_challenge_bravo.Controllers;
using api_challenge_bravo.Model;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ControllersTests
{
    public class CurrenciesConvertControllerFacts
    {
        public CurrenciesConvertControllerFacts()
        {
            new Currency("TSTCC1", "Testing Convert Controller 1", 0.1948M, false, DateTime.Now);
        }

        [Fact]
        public void GetAllReturnItens()
        {
            var result = new CurrenciesController().Get("TSTCC1");

            Assert.True(result.Value.Name == "Testing Convert Controller 1");
        }

    }
}