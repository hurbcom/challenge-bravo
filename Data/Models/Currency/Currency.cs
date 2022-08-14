namespace Data.Models.Currency;

public class BaseCurrency : ICurrency
{
    public  string Coin { get; set; }
    public string? Label { get; set; }

    public override bool Equals(object? obj)
    {
        if(obj == null || obj.GetType() is ICurrency)
        {
            return false;
        }

        ICurrency f = (ICurrency) obj;
        return this.Coin == f.Coin;
    }
}

public class Currency : BaseCurrency
{
    public decimal Value { get; set; }
    
    public Currency(string coin, decimal value = 0)
    {
        this.Coin = coin;
        Value = value;
    }

    public Currency(ICurrency currency, decimal value = 0)
    {
        this.Coin = currency.Coin;
        Value = value;
    }


    public string ToString(string? format)
    {
        return String.Format("{0} {1}", Coin, Value.ToString(format).Substring(1));
    }

    public override string ToString()
    {
        return ToString("C");
    }
}