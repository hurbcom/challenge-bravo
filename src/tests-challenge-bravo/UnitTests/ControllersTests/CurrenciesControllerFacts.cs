using System;
using System.Linq;
using api_challenge_bravo.Controllers;
using api_challenge_bravo.Model;
using api_challenge_bravo.Model.Util;
using Xunit;

namespace tests_challenge_bravo.UnitTests.ControllersTests
{
    public class CurrenciesControllerFacts : IDisposable
    {
        public CurrenciesControllerFacts()
        {
            AppDbContext.SetTestingEnvironment();
            new Currency("TSTC1", "Test Controller 1", 0.1948M, true, DateTime.UtcNow);

        }

        [Fact]
        public void GetAllCorrect()
        {
            var result = new CurrenciesController().Get();

            Assert.True(result.Value.Any());
        }

        [Fact]
        public void NotFoundCurrency()
        {
            var result = new CurrenciesController().Get("NOTACURRENCY");

            var resultAwait = result.Result;

            Assert.True("NotFoundResult" == resultAwait.GetType().Name);
        }

        [Fact]
        public void PostFutudeUpdatedDate()
        {
            var currency = new Currency("TSTDATE1", "Test Date 1", 1.0996M, true, DateTime.UtcNow.ToUniversalTime().AddDays(1));
            var result = new CurrenciesController().Post(currency);

            var resultAwait = result.Result;

            Assert.True("BadRequestObjectResult" == resultAwait.GetType().Name);
        }

        [Fact]
        public void PostForceNullDate()
        {
            var currency = new Currency("TSTDATE2", "Test Date 2", 1.0996M, true, DateTime.MinValue);
            var result = new CurrenciesController().Post(currency);

            var resultAwait = result.Result;

            Assert.True("BadRequestObjectResult" == resultAwait.GetType().Name);
        }

        [Fact]
        public void DeleteNotFound()
        {
            var result = new CurrenciesController().Delete("NOTACURRENCY");

            var resultAwait = result.Result;

            Assert.True("NotFoundResult" == resultAwait.GetType().Name);
        }

        public void Dispose()
        {
            Currency.Delete("TSTC1");
        }
    }
}