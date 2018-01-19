using Microsoft.VisualStudio.TestTools.UnitTesting;
using Project.Business.Facades.Concrete;
using Project.Business.HttpConnector;
using System.Threading.Tasks;

namespace Project.Test
{
    [TestClass]
    public class TestCurrenciesUnitPriceBasedInUsd
    {
        [TestMethod]
        public async Task TestBrlUnitPriceInUSD()
        {
            #region ' Arrange '

            var httpClient = new ExternalApiConnector("BRL");

            var currencyData = await httpClient.GetCurrencyQuotation();

            #endregion

            #region ' Act '

            var usdPrice = currencyData.Price_usd;
            var brlPrice = currencyData.Price_brl;

            var unitPriceBRLinUSDExpected = brlPrice / usdPrice;

            #endregion

            #region ' Assert '

            Assert.AreEqual(unitPriceBRLinUSDExpected, currencyData.UnitPrice_Brl_in_Usd);

            #endregion
        }
    }
}
