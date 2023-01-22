namespace Cuco.Domain.Currencies.Models.Values;

public class CacheCurrencyValue
{
    public decimal ValueInDollar { get; set; }
    public bool IsReal { get; set; }

    public CacheCurrencyValue(decimal valueInDollar, bool isReal)
    {
        ValueInDollar = valueInDollar;
        isReal = IsReal;
    }

    private CacheCurrencyValue() { }

    public string CacheValue => $"{ValueInDollar}:{IsReal}";

    public static CacheCurrencyValue CreateFromCache(string cacheCurrencyValue)
    {
        var parts = cacheCurrencyValue.Split(':');
        if (parts.Length != 2)
            return null;
        return new ()
        {
            ValueInDollar = decimal.Parse(parts[0]),
            IsReal = bool.Parse(parts[1])
        };
    }
}