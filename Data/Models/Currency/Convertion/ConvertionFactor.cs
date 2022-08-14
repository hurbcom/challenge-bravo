namespace Data.Models.Currency.Convertion;

using Data.Models.Currency;

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

    public Currency Calculate(double currency1Value)
    {
        return new Currency(Currency2, (decimal) (currency1Value * Factor));
    }

    public Currency Calculate(decimal currency1Value)
    {
        return new Currency(Currency2, (decimal) (currency1Value * (decimal) Factor));
    }

    public ConvertionFactor Reverse()
    {
        return new ConvertionFactor(Currency2, Currency1, 1/this.Factor);
    }

    public bool IsCurrencyPair(ICurrency curr1, ICurrency curr2)
    {
        return 
            (curr1.Coin != curr2.Coin)  && 
            (Currency1.Coin != Currency2.Coin)  && 
            (curr1.Coin == Currency1.Coin || curr1.Coin == Currency2.Coin) &&
            (curr2.Coin == Currency1.Coin || curr2.Coin == Currency2.Coin);
    }

    public bool IsReversed(string from, string to)
    {
        var cf = IsCurrencyPair(
            this.Currency1, 
            this.Currency2
        ) ? this : null;
        if (cf == null)
            return false;
        else {
            return this.Currency1.Coin != from;
        }
    }

    public bool IsReversed(ICurrency from, ICurrency to)
    {
        return IsReversed(from.Coin, to.Coin);
    }

    public override bool Equals(object? obj)
    {
        if(obj == null || obj.GetType() != typeof(ConvertionFactor))
        {
            return false;
        }

        ConvertionFactor f = (ConvertionFactor) obj;
        return this.Currency1.Equals(f.Currency1) && this.Currency2.Equals(f.Currency2);
    }
}

public class ConvertionFactorDto
{
    public BaseCurrency Currency1 { get; set; }
    public BaseCurrency Currency2 { get; set;}
    public double Factor { get; set; }
}