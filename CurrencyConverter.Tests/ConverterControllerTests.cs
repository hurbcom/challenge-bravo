using CurrencyConverter.API.Controllers;
using CurrencyConverter.Service.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace CurrencyConverter.Tests
{
    public class ConverterControllerTests
    {
        ConverterController _sut;

        private readonly Mock<IConverterSrvc> _converterSrvc = new Mock<IConverterSrvc>();

        public ConverterControllerTests()
        {
            _sut = new ConverterController(_converterSrvc.Object);
        }

        [Fact]
        public async Task Converter_ShouldReturnOk_WhenFromToAndAmountAreValidAsync()
        {
            _converterSrvc.Setup(x =>
                 x.convertCurrencyAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<decimal>()))
                .ReturnsAsync(It.IsAny<decimal>());

            var result = await _sut.Converter("a", "b", "1,0");
            var okResult = result as OkObjectResult;

            Assert.NotNull(okResult);
            Assert.IsType<decimal>(okResult.Value);
            Assert.Equal(StatusCodes.Status200OK, okResult.StatusCode);
        }

        [Fact]
        public async Task Converter_ShouldReturnBadRequest_WhenFromIsNullOrEmpty()
        {
            var result = await _sut.Converter(null, "b", "1,0");
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }

        [Fact]
        public async Task Converter_ShouldReturnBadRequest_WhenToIsNullOrEmpty()
        {
            var result = await _sut.Converter("a", null, "1,0");
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }

        [Fact]
        public async Task Converter_ShouldReturnBadRequest_WhenAmountIsNullOrEmpty()
        {
            var result = await _sut.Converter("a", "b", null);
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }

        [Fact]
        public async Task Converter_ShouldReturnBadRequest_WhenAmountIsNegative()
        {
            var result = await _sut.Converter("a", "b", "-1");
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }

        [Fact]
        public async Task Converter_ShouldReturnBadRequest_WhenAmountIsNotNumber()
        {
            var result = await _sut.Converter("a", "b", "c");
            var BadResult = result as BadRequestObjectResult;

            Assert.NotNull(BadResult);
            Assert.Equal(StatusCodes.Status400BadRequest, BadResult.StatusCode);
        }
    }
}
