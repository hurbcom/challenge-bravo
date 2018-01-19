using Microsoft.VisualStudio.TestTools.UnitTesting;
using Project.Business.Facades.Concrete;
using Project.Business.HttpConnector;
using System.Threading.Tasks;

namespace Project.Test
{
    [TestClass]
    public class TestsConversionFromUsdToAny
    {
        [TestMethod]
        public async Task TestConversionUsdInEur()
        {
            #region ' Arrange '

            var httpClient = new ExternalApiConnector("EUR");

            var currencyData = await httpClient.GetCurrencyQuotation();

            var amount = 10;
            var from = "USD";
            var to = "EUR";

            var usdPrice = currencyData.Price_usd;
            var eurPrice = currencyData.Price_eur;

            var unitPriceEurInUsd = eurPrice / usdPrice;

            var businessFacade = new CurrencyConversionBusinessFacade();

            #endregion

            #region ' Act '

            var valueConvertedExpected = amount * unitPriceEurInUsd;

            var result = await businessFacade.GetCurrencyConverted(from, to, amount);

            #endregion

            #region ' Assert '

            Assert.AreEqual(decimal.Round(valueConvertedExpected,2), result.Converted_Value);

            #endregion
        }
    }
}
