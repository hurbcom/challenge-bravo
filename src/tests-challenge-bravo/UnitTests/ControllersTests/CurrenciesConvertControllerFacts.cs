using System;
using api_challenge_bravo.Controllers;
using api_challenge_bravo.Model;
using api_challenge_bravo.Model.Util;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ControllersTests
{
    public class CurrenciesConvertControllerFacts
    {
        public CurrenciesConvertControllerFacts()
        {
            AppDbContext.SetTestingEnvironment();
        }

        [Fact]
        public void NotFoundCurrency()
        {
            var result = new CurrenciesConvertController().Get("NOTACURRENCY","NOTACURRENCY2",10);

            var resultAwait = result.Result;

            Assert.True("NotFoundObjectResult" == resultAwait.GetType().Name);
        }

    }
}