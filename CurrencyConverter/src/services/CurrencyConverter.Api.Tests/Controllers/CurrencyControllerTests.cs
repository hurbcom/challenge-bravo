using CurrencyConverter.Api.Controllers;
using CurrencyConverter.Api.Services;
using CurrencyConverter.Core.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using StackExchange.Redis;

namespace CurrencyConverter.Api.Tests.Controllers
{
    public class CurrencyControllerTests
    {
        private readonly Mock<ICurrencyService> _currencyServiceMock;
        private readonly Mock<HttpClient> _httpClientMock;
        private readonly Mock<IConnectionMultiplexer> _muxerMock;
        private readonly Mock<IDatabase> _database;

        public CurrencyControllerTests()
        {
            _currencyServiceMock = new Mock<ICurrencyService>();
            _httpClientMock = new Mock<HttpClient>();
            _muxerMock = new Mock<IConnectionMultiplexer>();
            _database = new Mock<IDatabase>();
            var key = $"converter:USD,BRL";
            var redisKey = new RedisKey(key);
            var redisValue = Task.FromResult(new RedisValue(string.Empty));
            _database.Setup(a => a.StringGetAsync(redisKey, CommandFlags.None)).Returns(redisValue);
            _muxerMock.Setup(a => a.GetDatabase(It.IsAny<int>(), It.IsAny<object>())).Returns(_database.Object);
        }

        [Test]
        public void When_Invalid_Currency_ConvertCurrency_Should_Throw_Exception()
        {
            // Arrange
            _currencyServiceMock.Setup(x => x.ConvertCurrency("", "", 1))
                .Throws(new Exception("Currency not found"));

            var controller = new CurrencyController(_currencyServiceMock.Object, _httpClientMock.Object, _muxerMock.Object);

            // Act
            var response = controller.ConvertCurrency("", "", 1);

            // Assert
            var result = response.Result as BadRequestObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().BeOfType(typeof(ValidationProblemDetails));
            var converterResponse = (ValidationProblemDetails)result.Value;
            converterResponse.Errors.Should().NotBeNull();
        }

        [Test]
        public void When_Valid_Currency_ConvertCurrency_Should_Response_Ok_And_Result()
        {
            // Arrange
            _currencyServiceMock.Setup(x => x.ConvertCurrency("USD", "BRL", 1)).ReturnsAsync(5);

            var controller = new CurrencyController(_currencyServiceMock.Object, _httpClientMock.Object, _muxerMock.Object);

            // Act
            var response = controller.ConvertCurrency("USD", "BRL", 1);

            // Assert
            var result = response.Result as OkObjectResult;
            response.Should().NotBeNull();
            result.Value.Should().BeOfType(typeof(CurrencyConverterResponse));
            var converterResponse = (CurrencyConverterResponse)result.Value;
            converterResponse.Result.Should().Be((double)5.0);
            converterResponse.ResponseResult.Should().BeNull();
        }

        [Test]
        public void CurrencyController_StressTest()
        {
            // Arrange
            _currencyServiceMock.Setup(x => x.ConvertCurrency("USD", "BRL", 1)).ReturnsAsync(5);
            var controller = new CurrencyController(_currencyServiceMock.Object, _httpClientMock.Object, _muxerMock.Object);
            bool wasExceptionThrown = false;
            var threads = new Thread[1000];
            for (int i = 0; i < 1000; i++)
            {
                threads[i] =
                    new Thread(new ThreadStart((Action)(() =>
                    {
                        try
                        {
                            controller.ConvertCurrency("USD", "BRL", 1);
                        }
                        catch (Exception)
                        {
                            wasExceptionThrown = true;
                        }
                    })));
            }

            for (int i = 0; i < 1000; i++)
            {
                threads[i].Start();
            }
            for (int i = 0; i < 1000; i++)
            {
                threads[i].Join();
            }

            Assert.That(wasExceptionThrown, Is.False);
        }
    }
}