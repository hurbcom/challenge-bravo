using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using CurrencyConverter.Service.Services;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Internal;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace CurrencyConverter.Tests
{
    public class CurrencySrvcTests
    {
        private readonly CurrencySrvc _sut;

        private readonly Mock<IRepositoryBase<Currency>> _repoCurrency = new Mock<IRepositoryBase<Currency>>();
        private readonly Mock<IRepositoryBase<Configuration>> _repoConfig = new Mock<IRepositoryBase<Configuration>>();
        private readonly Mock<IPriceSrvc> _price = new Mock<IPriceSrvc>();
        private readonly Mock<IDistributedCache> _cache = new Mock<IDistributedCache>();
        private readonly Mock<ILogger<CurrencySrvc>> _logger = new Mock<ILogger<CurrencySrvc>>();
        private readonly Mock<ICurrencySrvc> _currencySrvc = new Mock<ICurrencySrvc>();

        public CurrencySrvcTests()
        {
            _sut = new CurrencySrvc(_repoCurrency.Object, _repoConfig.Object, _price.Object, _cache.Object, _logger.Object);
        }

        [Fact]
        public void GetAll_ShouldReturnAllCurrenciesInDatabase()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var brl = new Currency() { @base = usd.name, name = "BRL", rate = 0 };
            var eur = new Currency() { @base = usd.name, name = "EUR", rate = 0 };
            var currencies = new List<Currency>() { usd, brl, eur };
            _repoCurrency.Setup(x => x.GetAll<Currency>(null)).Returns(currencies);

            var result = _sut.GetAll();

            Assert.Equal(currencies, result);
        }

        [Fact]
        public void GetAllActive_ShouldReturnAllActiveCurrenciesInDatabase()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var brl = new Currency() { @base = usd.name, name = "BRL", rate = 0 };
            var eur = new Currency() { @base = usd.name, name = "EUR", rate = 0 };
            var currencies = new List<Currency>() { usd, brl, eur };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);

            var result = _sut.GetAllActive();

            Assert.Equal(currencies, result);
        }

        [Fact]
        public void SyncAllActiveCurrencyRates_ShouldUpdateAllActiveCurrenciesRates()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var brl = new Currency() { @base = usd.name, name = "BRL", rate = 0 };
            var eur = new Currency() { @base = usd.name, name = "EUR", rate = 0 };
            var currencies = new List<Currency>() { usd, brl, eur };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);

            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(true);

            var result = _sut.SyncAllActiveCurrencyRates();

            Assert.True(result);
        }

        [Fact]
        public void SyncAllActiveCurrencyRates_ShouldReturnFalse_WhenUpdateFails()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var brl = new Currency() { @base = usd.name, name = "BRL", rate = 0 };
            var eur = new Currency() { @base = usd.name, name = "EUR", rate = 0 };
            var currencies = new List<Currency>() { usd, brl, eur };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);

            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(false);

            var result = _sut.SyncAllActiveCurrencyRates();

            Assert.False(result);
        }

        [Fact]
        public void SyncAllActiveCurrencyRates_ShouldReturnTrue_WhenNoCurrencies()
        {
            var currencies = new List<Currency>() {  };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);

            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);

            var result = _sut.SyncAllActiveCurrencyRates();

            Assert.True(result);
        }

        [Fact]
        public void SyncAllActiveCurrencyRates_ShouldLog_WhenUpdateFails()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var brl = new Currency() { @base = usd.name, name = "BRL", rate = 0 };
            var eur = new Currency() { @base = usd.name, name = "EUR", rate = 0 };
            var currencies = new List<Currency>() { usd, brl, eur };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);

            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(false);

            var result = _sut.SyncAllActiveCurrencyRates();

            _logger.Verify(x => x.Log(LogLevel.Error, It.IsAny<EventId>(), It.IsAny<FormattedLogValues>(), It.IsAny<Exception>(), It.IsAny<Func<object, Exception, string>>()), Times.Once);
        }

        [Fact]
        public void DeleteCurrency_ShouldRemoveGivenCurrency()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var currencies = new List<Currency>() { usd };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);
            _repoCurrency.Setup(x => x.Update<Currency>(usd)).Returns(true);

            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(true);

            var result = _sut.DeleteCurrency(usd.name);

            Assert.True(result);
        }

        [Fact]
        public void DeleteCurrency_ShouldReturnFalse_WhenCurrencyNotFound()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var currencies = new List<Currency>() { usd };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);
            _repoCurrency.Setup(x => x.Update<Currency>(usd)).Returns(false);

            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(true);

            var result = _sut.DeleteCurrency("NOT");

            Assert.False(result);
        }

        [Fact]
        public void DeleteCurrency_ShouldLog_WhenCurrencyNotFound()
        {
            var usd = new Currency() { @base = "USD", name = "USD", rate = 0 };
            var currencies = new List<Currency>() { usd };
            _repoCurrency.Setup(x => x.GetAll<Currency>(i => i.isActive == true)).Returns(currencies);
            _repoCurrency.Setup(x => x.Update<Currency>(usd)).Returns(false);

            _currencySrvc.Setup(x => x.GetAllActive()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(true);

            var result = _sut.DeleteCurrency("NOT");

            _logger.Verify(x => x.Log(LogLevel.Error, It.IsAny<EventId>(), It.IsAny<FormattedLogValues>(), It.IsAny<Exception>(), It.IsAny<Func<object, Exception, string>>()), Times.Once);
        }

        [Fact]
        public void AddCurrency_ShouldAddCurrency_WhenValid()
        {
            var brl = new Currency() { @base = "USD", name = "BRL", rate = 0, isActive = true };
            var currencies = new List<Currency>() { };
            List<Configuration> config = new List<Configuration> { new Configuration { baseRate = "USD" } };

            _repoCurrency.Setup(x => x.GetAll<Currency>(null)).Returns(currencies);
            _repoConfig.Setup(x => x.GetAll<Configuration>(null)).Returns(config);

            _currencySrvc.Setup(x => x.GetAll()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(true);

            var result = _sut.AddCurrency(brl.name);

            Assert.Equal(brl.name, result.name);
            Assert.Equal(brl.@base, result.@base);
            Assert.Equal(brl.isActive, result.isActive);
        }

        [Fact]
        public void AddCurrency_ShouldReturnCurrency_WhenAlreadyExistsAndActive()
        {
            var brl = new Currency() { @base = "USD", name = "BRL", rate = 10, isActive = true };
            var currencies = new List<Currency>() { brl };

            _repoCurrency.Setup(x => x.GetAll<Currency>(null)).Returns(currencies);
            _currencySrvc.Setup(x => x.GetAll()).Returns(currencies);

            var result = _sut.AddCurrency(brl.name);

            Assert.Equal(brl.name, result.name);
            Assert.Equal(brl.@base, result.@base);
            Assert.Equal(brl.isActive, result.isActive);
            Assert.Equal(brl.rate, result.rate);
        }

        [Fact]
        public void AddCurrency_ShouldReactivateCurrency_WhenItIsJustDisabled()
        {
            var brl = new Currency() { @base = "USD", name = "BRL", rate = 10, isActive = false };
            var currencies = new List<Currency>() { brl };

            _repoCurrency.Setup(x => x.GetAll<Currency>(null)).Returns(currencies);
            _currencySrvc.Setup(x => x.GetAll()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(true);

            var result = _sut.AddCurrency(brl.name);

            Assert.Equal(brl.name, result.name);
            Assert.Equal(brl.@base, result.@base);
            Assert.Equal(brl.rate, result.rate);
            Assert.True(result.isActive);
        }

        [Fact]
        public void AddCurrency_ShouldThrowException_WhenUpdateFail()
        {
            var brl = new Currency() { @base = "USD", name = "BRL", rate = 10, isActive = false };
            var currencies = new List<Currency>() { brl };

            _repoCurrency.Setup(x => x.GetAll<Currency>(null)).Returns(currencies);
            _currencySrvc.Setup(x => x.GetAll()).Returns(currencies);
            _price.Setup(x => x.UpdateRate(It.IsAny<Currency>())).Returns(false);

            Assert.Throws<Exception>(() => _sut.AddCurrency(brl.name));
        }
    }
}
