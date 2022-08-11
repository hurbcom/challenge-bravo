using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CurrencyConverterAPI.Domain.Models.Tests
{
    [TestClass()]
    public class CoinTests
    {
        [TestMethod()]
        public void NameUpperInFillData()
        {
            //Arrange
            var name = "jedi coin";
            var nameExpected = "JEDI COIN";
            var coin = new Coin();

            //Act
            coin.FillData(name, "jdi", 0.50m);

            //Assert
            Assert.AreEqual(nameExpected, coin.Name);
        }

        [TestMethod()]
        public void NameUpperAndWithotSpaceCharacterInFillData()
        {
            //Arrange
            var name = "jedi coin ";
            var nameExpected = "JEDI COIN";
            var coin = new Coin();

            //Act
            coin.FillData(name, "jdi", 0.50m);

            //Assert
            Assert.AreEqual(nameExpected, coin.Name);
        }

        [TestMethod()]
        public void AcronymUpperInFillData()
        {
            //Arrange
            var acronym = "jdi";
            var acronymExpected = "JDI";
            var coin = new Coin();

            //Act
            coin.FillData("Jedi Coin", acronym, 0.50m);

            //Assert
            Assert.AreEqual(acronymExpected, coin.Acronym);
        }

        [TestMethod()]
        public void AcronymUpperAndWithotSpaceCharacterInFillData()
        {
            //Arrange
            var acronym = "jdi ";
            var acronymExpected = "JDI";
            var coin = new Coin();

            //Act
            coin.FillData("Jedi Coin", acronym, 0.50m);

            //Assert
            Assert.AreEqual(acronymExpected, coin.Acronym);
        }

        [TestMethod()]
        public void PriceInFillData()
        {
            //Arrange
            var price = 0.83m;
            var priceExpected = 0.83m; ;
            var coin = new Coin();

            //Act
            coin.FillData("Jedi Coin", "JDI", price);

            //Assert
            Assert.AreEqual(priceExpected, coin.Price);
        }

        [TestMethod()]
        public void NameUpperInNormalize()
        {
            //Arrange
            var nameExpected = "JEDI COIN";
            var coin = new Coin();
            coin.Name = "jedi coin";
            coin.Acronym = "jdi";

            //Act
            coin.NormalizeStrings();

            //Assert
            Assert.AreEqual(nameExpected, coin.Name);
        }

        [TestMethod()]
        public void NameUpperAndWithotSpaceCharacterInNormalize()
        {
            //Arrange
            var nameExpected = "JEDI COIN";
            var coin = new Coin();
            coin.Name = "jedi coin ";
            coin.Acronym = "jdi";

            //Act
            coin.NormalizeStrings();

            //Assert
            Assert.AreEqual(nameExpected, coin.Name);
        }

        [TestMethod()]
        public void AcronymUpperInNormalize()
        {
            //Arrange
            var acronymExpected = "JDI";
            var coin = new Coin();
            coin.Name = "jedi coin";
            coin.Acronym = "jdi";

            //Act
            coin.NormalizeStrings();

            //Assert
            Assert.AreEqual(acronymExpected, coin.Acronym);
        }

        [TestMethod()]
        public void AcronymUpperAndWithotSpaceCharacterInNormalize()
        {
            //Arrange
            var acronymExpected = "JDI";
            var coin = new Coin();
            coin.Name = "jedi coin";
            coin.Acronym = "jdi ";

            //Act
            coin.NormalizeStrings();

            //Assert
            Assert.AreEqual(acronymExpected, coin.Acronym);
        }
    }
}