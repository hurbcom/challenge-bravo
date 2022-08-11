using CurrencyConverterAPI.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Net.Http;
using System.Net.Http.Headers;

namespace CurrencyConverterAPI.Services.Implementation.Tests
{
    [TestClass()]
    public class ExchangeServiceTests
    {
        [TestMethod()]
        public void ConectionProviderPartnerTest()
        {
            //Arrange
            string baseUrl = "https://api.coinbase.com/v2";
            string currencyBallasty = "USD";
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/xml"));
            bool statusExpected = true;

            //Act
            var connectProviderPartner = httpClient.Send(
                    new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}/exchange-rates?currency={currencyBallasty}")
                ).IsSuccessStatusCode;

            //Assert
            Assert.AreEqual(statusExpected, connectProviderPartner);
        }
    }
}