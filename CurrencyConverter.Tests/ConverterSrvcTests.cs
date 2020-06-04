using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using CurrencyConverter.Service.Services;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace CurrencyConverter.Tests
{
    public class ConverterSrvcTests
    {
        private readonly IConverterSrvc _sut;

        private readonly Mock<ICacheBase> _cache = new Mock<ICacheBase>();
        private readonly Mock<ILogger<ConverterSrvc>> _logger = new Mock<ILogger<ConverterSrvc>>();

        public ConverterSrvcTests()
        {
            _sut = new ConverterSrvc(_cache.Object, _logger.Object);
        }

        [Fact]
        public async Task convertCurrencyAsync_ShouldConvertBetweenCurrencies_WhenBothAndAmountValid()
        {
            Currency brl = new Currency() { name = "BRL", rate = 0.5M };
            Currency eur = new Currency() { name = "EUR", rate = 2M };
            _cache.Setup(x => x.GetAsync(brl.name)).ReturnsAsync(brl.rate.ToString());
            _cache.Setup(x => x.GetAsync(eur.name)).ReturnsAsync(eur.rate.ToString());

            decimal amount = 1;
            var result = await _sut.convertCurrencyAsync(brl.name, eur.name, amount);

            var fromAmount = amount * brl.rate;
            var toAmount = fromAmount / eur.rate;

            Assert.Equal(toAmount, result);
        }

        [Fact]
        public async Task convertCurrencyAsync_ShouldThrowException_WhenCurrencyNameNotValid()
        {
            Currency aaa = new Currency() { name = "AAA", rate = 0.5M };
            Currency eur = new Currency() { name = "EUR", rate = 2M };
            _cache.Setup(x => x.GetAsync(aaa.name)).ThrowsAsync(new Exception());
            _cache.Setup(x => x.GetAsync(eur.name)).ReturnsAsync(eur.rate.ToString());

            decimal amount = 1;
            await Assert.ThrowsAsync<Exception>(async () => await _sut.convertCurrencyAsync(aaa.name, eur.name, amount));
        }
    }
}
