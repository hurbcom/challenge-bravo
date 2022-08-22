using Data.Models.Currency;
using Data.Models.Currency.Convertion;

namespace Web_Api._Mock
{

    public interface IConvertionFactorsMock : IEnumerable<ConvertionFactor>
    {}

    public class ConvertionFactorsMock : List<ConvertionFactor>, IConvertionFactorsMock
    {

        public ConvertionFactorsMock() :base()
        {
            
            this.Add(new ConvertionFactor (new BaseCurrency{Coin= "USD"}, new BaseCurrency {Coin= "BRL"}, 1/5.0));
            this.Add(new ConvertionFactor (new BaseCurrency{Coin= "USD"}, new BaseCurrency {Coin= "EUR"}, 1/1.5));
            this.Add(new ConvertionFactor (new BaseCurrency{Coin= "EUR"}, new BaseCurrency {Coin= "BRL"}, 1/6.0));
        }
    }
}
