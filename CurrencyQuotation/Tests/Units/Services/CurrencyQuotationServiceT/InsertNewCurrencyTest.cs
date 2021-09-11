using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.Models;
using CurrencyQuotation.Models.Dtos;
using CurrencyQuotation.Services;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Units.Services.CurrencyQuotationServiceT
{
    public class InsertNewCurrencyTest
    {
        private ICurrencyQuotationService CurrencyQuotationService { get; set; }
        public InsertNewCurrencyTest()
        {
        }

        [Theory]
        [InlineData("HURB", 500.500101, "USD", 1.00000, 500.500101)]
        [InlineData("HURB", 500.500101, null, 1.00000, 500.500101)]
        [InlineData("HURB", 500.500101, "BRL", 0.20000, 100.1000202)]
        public void InsertNewCurrency_WithSuccess(string name, decimal amount, string baseQuotation,
            decimal DolarAmountBase, decimal expectedDolarAmount)
        {
            //Arrange
            CurrencyDto currencyDto = new()
            {
                Name = name,
                Amount = amount,
                BaseQuotation = baseQuotation
            };

            Mock<ILogger<CurrencyQuotationService>> loggerMock = new();
            Mock<IRedisCacheService> cacheMock = new();
            Mock<ICurrencyQuotationDao> daoMock = new();

            daoMock.Setup(m => m.GetDolarAmountByName(It.IsAny<string>()))
                .Returns(Task.FromResult(DolarAmountBase));

            Currency currencyToSave = null;
            daoMock.Setup(h => h.InsertNewCurrency(It.IsAny<Currency>()))
                .Callback<Currency>(r => currencyToSave = r);

            //Act
            this.CurrencyQuotationService = new CurrencyQuotationService(loggerMock.Object, daoMock.Object, cacheMock.Object);
            bool result = this.CurrencyQuotationService.InsertNewCurrency(currencyDto).Result;

            //Assert
            Assert.Equal(expectedDolarAmount, currencyToSave.DolarAmount);
            Assert.True(result);
        }

        [Fact]
        public void InsertNewCurrencyWithErrorInSave_ReturnsFalse()
        {
            //Arrange
            CurrencyDto currencyDto = new()
            {
                Name = "HURB",
                Amount = 100.64564m,
                BaseQuotation = "USD"
            };

            Mock<ILogger<CurrencyQuotationService>> loggerMock = new();
            Mock<IRedisCacheService> cacheMock = new();
            Mock<ICurrencyQuotationDao> daoMock = new();

            daoMock.Setup(h => h.InsertNewCurrency(It.IsAny<Currency>()))
                .Throws<Exception>();

            //Act
            this.CurrencyQuotationService = new CurrencyQuotationService(loggerMock.Object, daoMock.Object, cacheMock.Object);
            bool result = this.CurrencyQuotationService.InsertNewCurrency(currencyDto).Result;

            //Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("", 50.0000)]
        [InlineData(null, 80.0000)]
        [InlineData("HURB", -50.0000)]
        [InlineData("HURB", 0)]
        [InlineData("", 0)]
        [InlineData("", -200.65482)]
        [InlineData(null, 0)]
        [InlineData(null, -50.0000)]
        public void InsertNewCurrencyWithInvalidParameters_ReturnsFalse(string name, decimal amount)
        {
            //Arrange
            CurrencyDto currencyDto = new()
            {
                Name = name,
                Amount = amount,
                BaseQuotation = null
            };

            Mock<ILogger<CurrencyQuotationService>> loggerMock = new();
            Mock<IRedisCacheService> cacheMock = new();
            Mock<ICurrencyQuotationDao> daoMock = new();

            //Act
            this.CurrencyQuotationService = new CurrencyQuotationService(loggerMock.Object, daoMock.Object, cacheMock.Object);
            bool result = this.CurrencyQuotationService.InsertNewCurrency(currencyDto).Result;

            //Assert
            Assert.False(result);
        }
    }
}
