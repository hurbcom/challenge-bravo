using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CurrencyConverterAPI.Application.AppServices.Implementation.Tests
{
    [TestClass()]
    public class ExchangeAppServiceTests
    {
        [TestMethod()]
        public void CalculatesValueCurrencyBallastTest()
        {
            //Arrange
            decimal priceFrom = 5.16m; // 1 USD  ~= 5.16 BRL
            decimal priceExpect = 0.19379844961240310077519379844961m; // 1 BRL ~= 0.19 USD

            //Act
            decimal result = ExchangeAppService.CalculatesValueCurrencyBallast(priceFrom);

            //Assert
            Assert.AreEqual(priceExpect, result);
        }

        [TestMethod()]
        public void CalculateConversionTest()
        {
            //Arrange
            decimal priceBRL = 0.19379844961240310077519379844961m; // 1 BRL ~= 0.19 USD
            decimal priceEUR = 0.9691m; // 1 USD ~= 0.96 EUR
            decimal amount = 2m;
            decimal amountExpect = 0.3756m;
            //Act
            decimal result = ExchangeAppService.CalculateConversion(priceBRL, priceEUR, amount);

            //Assert
            Assert.AreEqual(amountExpect, result);
        }
    }
}