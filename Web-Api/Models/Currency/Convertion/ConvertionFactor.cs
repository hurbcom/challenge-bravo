namespace Web_Api.Models.Currency.Convertion;

using Web_Api.Models.Currency;

public class ConvertionFactor
{
    public ICurrency Currency1 { get; set; }
    public ICurrency Currency2 { get; set;}
    public double Factor { get; set; }

    /// <summary>
    ///  Represents two currencies1 and 2 and theconvertion constations from 1 to 2
    /// (e.g value_currency2 = value_currency1 * factor)
    /// </summary>
    /// <param name="currency1"></param>
    /// <param name="currency2"></param>
    /// <param name="factor"></param>
    public ConvertionFactor(ICurrency currency1, ICurrency currency2, double factor)
    {
        Currency1 = currency1;
        Currency2 = currency2;
        Factor = Math.Abs(factor);
    }

    public ConvertionFactor(string currency1, string currency2, double factor)
    {
        Currency1 = new BaseCurrency {Coin= currency1};
        Currency2 = new BaseCurrency {Coin=currency2};
        Factor = Math.Abs(factor);
    }

    public Currency Direct(double currency1Value)
    {
        return new Currency(Currency2, (decimal) (currency1Value * Factor));
    }

    public Currency Direct(decimal currency1Value)
    {
        return new Currency(Currency2, (decimal) (currency1Value * (decimal) Factor));
    }

    public Currency Reverse(double currency2Value)
    {
        return new Currency(Currency1, (decimal) (currency2Value / Factor));
    }

    public Currency Reverse(decimal currency2Value)
    {
        return new Currency(Currency1, (decimal) (currency2Value / (decimal) Factor));
    }


}