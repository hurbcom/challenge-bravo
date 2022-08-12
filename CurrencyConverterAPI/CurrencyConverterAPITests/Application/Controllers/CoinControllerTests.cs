using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CurrencyConverterAPI.Application.Controllers.Tests
{
    [TestClass()]
    public class CoinControllerTests
    {
        [TestMethod()]
        public void IsFromEmptyInputParamsTest()
        {
            //Arrange
            string from = string.Empty;
            string to = string.Empty;
            string amount = string.Empty;
            string resultExpect = HandlerErrorResponseMessage.BadRequestParamFromIsRequired;

            //Act
            string result = CoinController.IsEmptyInputParams(from, to, amount);

            //Assert
            StringAssert.Contains(result, resultExpect);
        }

        [TestMethod()]
        public void IsToEmptyInputParamsTest()
        {
            //Arrange
            string from = string.Empty;
            string to = string.Empty;
            string amount = string.Empty;
            string resultExpect = HandlerErrorResponseMessage.BadRequestParamToIsRequired;

            //Act
            string result = CoinController.IsEmptyInputParams(from, to, amount);

            //Assert
            StringAssert.Contains(result, resultExpect);
        }

        [TestMethod()]
        public void IsAmountEmptyInputParamsTest()
        {
            //Arrange
            string from = string.Empty;
            string to = string.Empty;
            string amount = string.Empty;
            string resultExpect = HandlerErrorResponseMessage.BadRequestParamAmountIsRequired;

            //Act
            string result = CoinController.IsEmptyInputParams(from, to, amount);

            //Assert
            StringAssert.Contains(result, resultExpect);
        }

        [TestMethod()]
        public void IsAmountNotDecimalInputParamsTest()
        {
            //Arrange
            string from = string.Empty;
            string to = string.Empty;
            string amount = "HI";
            string resultExpect = HandlerErrorResponseMessage.BadRequestAmountInvalid(amount);

            //Act
            string result = CoinController.IsDecimalAmountInputParams( amount);

            //Assert
            StringAssert.Contains(result, resultExpect);
        }

    }
}