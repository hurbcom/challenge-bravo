using Microsoft.VisualStudio.TestTools.UnitTesting;
using Project.Business.HttpConnector;
using System.Threading.Tasks;

namespace Project.Test.Business.HttpConnector
{
    [TestClass]
    public class TestExternalApiConnectionTest
    {
        [TestMethod]
        public async Task TestExternalApiConnection()
        {
            #region ' Arrange '

            var httpClient = new ExternalApiConnector("USD");

            #endregion

            #region ' Act '

            var currencyData = await httpClient.GetCurrencyQuotation();

            #endregion

            #region ' Assert '

            Assert.AreEqual("BTC", currencyData.Symbol);

            #endregion
        }
    }
}
