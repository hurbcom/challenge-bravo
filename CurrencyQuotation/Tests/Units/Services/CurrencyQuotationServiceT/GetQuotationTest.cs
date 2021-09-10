using CurrencyQuotation.Daos.Interfaces;
using CurrencyQuotation.Models;
using CurrencyQuotation.Services;
using CurrencyQuotation.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Globalization;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Units.Services.CurrencyQuotationServiceT
{
    public class GetQuotationTest
    {
        private ICurrencyQuotationService CurrencyQuotationService { get; set; }

        [Theory]
        [InlineData("USD", "BRL", 100, 1.000000, 5.198200, "519.82")]
        [InlineData("BTC", "USD", 50, 0.0000213035, 1.000000, "2347032.1778111577909733142442")]
        [InlineData("EUR", "BRL", 1000, 0.8459090000, 5.198200, "6145.1054427840346893105523171")]
        [InlineData("BRL", "CAD", 100.50, 5.198200, 1.2658600000, "24.473650494401908352891385475")]
        [InlineData("BTC", "BRL", 354, 0.0000213035, 5.198200, "86378426.0802215598375853733")]
        public void GetQuotation_WithSuccess(string from, string to, decimal amount,
            decimal dolarAmountFrom, decimal dolarAmountTo, string expectedAmountStr)
        {
            //Arrange
            Currency currencyFrom = new(from, dolarAmountFrom);
            Currency currencyTo = new(to, dolarAmountTo);

            decimal expectedAmount = Convert.ToDecimal(expectedAmountStr, CultureInfo.InvariantCulture);

            Mock<ILogger<CurrencyQuotationService>> loggerMock = new();
            Mock<ICurrencyQuotationDao> daoMock = new();
            Mock<IRedisCacheService> cacheMock = new();

            cacheMock.Setup(m => m.GetRedisCache(
                It.IsAny<Func<Currency>>(),
                It.Is<string>(key => from.Equals(key)),
                It.IsAny<TimeSpan>()))
                     .Returns(Task.FromResult(currencyFrom));

            cacheMock.Setup(m => m.GetRedisCache(
                It.IsAny<Func<Currency>>(),
                It.Is<string>(key => to.Equals(key)),
                It.IsAny<TimeSpan>()))
                     .Returns(Task.FromResult(currencyTo));

            //Act
            this.CurrencyQuotationService = new CurrencyQuotationService(loggerMock.Object, daoMock.Object, cacheMock.Object);
            Task<decimal> resultTask = this.CurrencyQuotationService.GetQuotation(from, to, amount);

            decimal resultAmount = resultTask.Result;

            //Assert
            Assert.Equal(expectedAmount, resultAmount);
        }
    }
}
