using Microsoft.VisualStudio.TestTools.UnitTesting;
using Project.Business.DTOs;
using Project.Business.HttpConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project.Test.Business.HttpConnector
{
    [TestClass]
    public class Test1000RequestsToTheExternalAPI
    {
        [TestMethod]
        public async Task TestSendRequest()
        {
            #region ' Arrange '

            var httpClient = new ExternalApiConnector("USD");

            #endregion

            #region ' Act '

            var listResponseResult = new List<CurrencyDTO>();

            for (int i = 0; i < 1000; i++)
            {
                listResponseResult.Add(await httpClient.GetCurrencyQuotation());
            }

            #endregion

            #region ' Assert '

            Assert.AreEqual(listResponseResult.Count, 1000);

            #endregion
        }
    }
}
