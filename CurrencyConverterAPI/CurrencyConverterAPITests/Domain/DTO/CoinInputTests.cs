using CurrencyConverterAPI.CrossCutting.HandlerErrorMessage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace CurrencyConverterAPI.Domain.DTO.Tests
{
    [TestClass()]
    public class CoinInputTests
    {
        [TestMethod()]
        public void NameIsEmpty()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = String.Empty;
            coinInput.Acronym = "JDI";
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestNameCoinInputRequiredField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void NameWithSpaceCharacter()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = " ";
            coinInput.Acronym = "JDI";
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestNameCoinInputRequiredField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void NameWithLessThan4Characters()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jed";
            coinInput.Acronym = "JDI";
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestNameCoinInputRangeLenghtField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void NameWithMoreThan64Characters()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Far far away, behind the word mountains, far from the countries Vokali";
            coinInput.Acronym = "JDI";
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestNameCoinInputRangeLenghtField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void AcronymIsEmpty()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jedi Coin";
            coinInput.Acronym = String.Empty;
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestAcronymCoinInputRequiredField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void AcronymWithSpaceCharacter()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jedi Coin";
            coinInput.Acronym = " ";
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestAcronymCoinInputRequiredField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void AcronymWithLessThan3Characters()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jedi Coin";
            coinInput.Acronym = "JD";
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestAcronymCoinInputLenghtField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void AcronymWithMoreThan5Characters()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jedi Coin";
            coinInput.Acronym = "JDICOIN";
            coinInput.Price = 0.83m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestAcronymCoinInputLenghtField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void PriceIsEqual0()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jedi Coin";
            coinInput.Acronym = "JDI";
            coinInput.Price = 0m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestPriceCoinInputLenghtField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void PriceLessThan0()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jedi Coin";
            coinInput.Acronym = "JDI";
            coinInput.Price = -1m;
            var expectedMessage = HandlerErrorResponseMessage.BadRequestPriceCoinInputLenghtField;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }

        [TestMethod()]
        public void InputCoinIsOk()
        {
            //Arrange
            var coinInput = new CoinInput();
            coinInput.Name = "Jedi Coin";
            coinInput.Acronym = "JDI";
            coinInput.Price = 0.83m;
            var expectedMessage = string.Empty;

            //Act
            var isvalid = coinInput.IsValid();

            //Assert
            Assert.AreEqual(expectedMessage, isvalid);
        }
    }
}