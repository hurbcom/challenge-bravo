using Data.Models.Currency;
using Data.Models.Currency.Convertion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test.Data
{
    public class ModelTests
    {
        [Fact]
        public void Instantiate_ConvertionFactor()
        {
            var l = new List<ConvertionFactor>();
            l.Add(new ConvertionFactor(new BaseCurrency { Coin = "USD" }, new BaseCurrency { Coin = "BRL" }, 1 / 5.0));
            l.Add(new ConvertionFactor(new BaseCurrency { Coin = "USD" }, new BaseCurrency { Coin = "EUR" }, 1 / 1.5));
            l.Add(new ConvertionFactor(new BaseCurrency { Coin = "EUR" }, new BaseCurrency { Coin = "BRL" }, 1 / 6.0));

            Assert.True(l[0].GetType() == typeof(ConvertionFactor));
            Assert.Equal(3, l.Count);
        }

    }
}
