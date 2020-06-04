using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Services;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using Xunit;

namespace CurrencyConverter.Tests
{
    public class PriceSrvcTests
    {
        private readonly PriceSrvc _sut;

        private readonly Mock<ICryptoComparer> _cryptoComparer = new Mock<ICryptoComparer>();
        private readonly Mock<IRepositoryBase<Currency>> _repo = new Mock<IRepositoryBase<Currency>>();
        private readonly Mock<ICacheBase> _cache = new Mock<ICacheBase>();
        private readonly Mock<ILogger<PriceSrvc>> _logger = new Mock<ILogger<PriceSrvc>>();

        public PriceSrvcTests()
        {
            _sut = new PriceSrvc(_cryptoComparer.Object, _repo.Object, _cache.Object, _logger.Object);
        }

        [Fact]
        public void UpdateRate_ShouldUpdateCurrencyRate_WhenCurrencyExists()
        {
            var brl = new Currency() { @base = "USD", name = "BRL", rate = 0 };
            _cryptoComparer.Setup(x => x.GetLastestRate(It.IsAny<string>())).Returns(10);
            _repo.Setup(x => x.Update<Currency>(It.IsAny<Currency>())).Returns(true);

            var result = _sut.UpdateRate(brl);

            Assert.True(result);
        }

        [Fact]
        public void UpdateRate_ShouldThrowException_WhenCurrencyNotFound()
        {
            var brl = new Currency() { @base = "USD", name = "BRL", rate = 0 };
            _cryptoComparer.Setup(x => x.GetLastestRate(It.IsAny<string>())).Throws<Exception>();
            _repo.Setup(x => x.Update<Currency>(It.IsAny<Currency>())).Returns(true);

            Assert.Throws<Exception>(() => _sut.UpdateRate(brl));
        }

        [Fact]
        public void UpdateRate_ShouldThrowException_WhenUpdateCurrencyFail()
        {
            var brl = new Currency() { @base = "USD", name = "BRL", rate = 0 };
            _cryptoComparer.Setup(x => x.GetLastestRate(It.IsAny<string>())).Returns(10);
            _repo.Setup(x => x.Update<Currency>(It.IsAny<Currency>())).Returns(false);

            Assert.Throws<Exception>(() => _sut.UpdateRate(brl));
        }
    }
}
