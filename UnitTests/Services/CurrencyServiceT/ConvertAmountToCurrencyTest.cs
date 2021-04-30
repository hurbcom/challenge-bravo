using CurrencyConverter.Model;
using CurrencyConverter.Model.Dto;
using CurrencyConverter.Repository;
using CurrencyConverter.Services;
using Moq;
using System;
using Xunit;

namespace UnitTests.Services.CurrencyServiceT
{
    public class ConvertAmountToCurrencyTest
    {
        ICurrencyService CurrencyService;

        public ConvertAmountToCurrencyTest()
        {
            DateTime now = DateTime.Now;

            Currency brlCurrency = new Currency("BRL", 5.3423990000m, now, now);
            Currency btcCurrency = new Currency("BTC", 0.0000183356m, now, now);

            Mock<ICurrencyRepository> currencyRepositoryMock = new Mock<ICurrencyRepository>();
            currencyRepositoryMock.Setup(p => p.GetCurrencyByName("BRL")).Returns(brlCurrency);
            currencyRepositoryMock.Setup(p => p.GetCurrencyByName("BTC")).Returns(btcCurrency);

            ICurrencyCache currencyCache = new CurrencyCache();

            Mock<ICurrencyExternalApi> currencyExternalApiMock = new Mock<ICurrencyExternalApi>();

            this.CurrencyService = new CurrencyService(currencyRepositoryMock.Object, currencyCache, currencyExternalApiMock.Object);
        }

        [Fact]
        public void SuccessfulConvert()
        {
            ICurrencyService currencyService = this.CurrencyService;

            CurrencyToConvertDto currencyToConvertDto = new CurrencyToConvertDto("BRL", "BTC", 50.00m);

            decimal amountConverted = currencyService.ConvertAmountToCurrency(currencyToConvertDto);
            decimal expectedResult = 0.0001716045544333173168084226m;

            Assert.Equal(expectedResult, amountConverted);
        }


        [Fact]
        public void InvalidCurrencyNameException()
        {
            ICurrencyService currencyService = this.CurrencyService;

            CurrencyToConvertDto currencyToConvertDto = new CurrencyToConvertDto("ABCD", "BTC", 50.00m);

            string errorMessage = Assert.Throws<ArgumentException>(() => currencyService.ConvertAmountToCurrency(currencyToConvertDto)).Message;

            string expectedErrorMessage = "Pelo menos uma das moedas recebidas está diferente do padrão de 3 letras.";

            Assert.Equal(expectedErrorMessage, errorMessage);
        }
    }
}
