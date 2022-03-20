using System;
using api_challenge_bravo.Controllers;
using api_challenge_bravo.Model;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ControllersTests
{
    public class CurrenciesConvertControllerFacts : UnitTestBase
    {
        [Fact]
        public void NotFoundCurrency()
        {
            var result = new CurrenciesConvertController().Get("NOTACURRENCY","NOTACURRENCY2",10);

            var resultAwait = result.Result;

            Assert.True("NotFoundObjectResult" == resultAwait.GetType().Name);
        }

        [Fact]
        public void DivideByZeroNotAnException()
        {
            new Currency("TSTDVD0", "Test Divide by zero", 0.0M, false, DateTime.UtcNow);

            var result = new CurrenciesConvertController().Get("TSTDVD0","TSTDVD0",10);

            var resultAwait = result.Result;

            Assert.True(true);
        }

    }
}