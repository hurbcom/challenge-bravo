using AutoMapper;
using CurrencyConverter.Api.Data;
using CurrencyConverter.Api.Services;
using FluentAssertions;
using Moq;

namespace CurrencyConverter.Api.Tests.Services
{
    public class CurrencyServiceTests
    {
        private readonly CurrencyService _sut;
        private readonly Mock<ICurrencyRepository> _currencyRepositoryMock;
        private readonly Mock<IFiatConvertService> _fiatConvertServiceMock;
        private readonly Mock<IBitCoinConvertService> _bitcoinConvertServiceMock;
        private readonly Mock<IFictionCurrencyService> _fictionCurrencyServiceMock;
        private readonly Mock<IMapper> _mapper;

        public CurrencyServiceTests()
        {
            _currencyRepositoryMock = new Mock<ICurrencyRepository>();
            _fiatConvertServiceMock = new Mock<IFiatConvertService>();
            _mapper = new Mock<IMapper>();
            _bitcoinConvertServiceMock = new Mock<IBitCoinConvertService>();
            _fictionCurrencyServiceMock = new Mock<IFictionCurrencyService>();
            _sut = new CurrencyService(
                _currencyRepositoryMock.Object,
                _bitcoinConvertServiceMock.Object,
                _fiatConvertServiceMock.Object,
                _fictionCurrencyServiceMock.Object,
                _mapper.Object
                );
        }

        [Test]
        public void When_Valid_Currency_ConvertCurrency_Should_Response_Right_Value()
        {
            // Arrange
            _fiatConvertServiceMock.Setup(f => f.ConvertFiatToFiat("USD", "BRL", 1))
                .Returns(5);

            // Act
            var response = _sut.ConvertCurrency("USD", "BRL", 1).Result;

            // Assert
            response.Should().Be(5);
        }
    }
}