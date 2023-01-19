namespace Cuco.Domain.CurrenciesData.Models.Entities;
public class CurrencyData
{
    public CurrencyData(
        string name,
        string symbol,
        decimal valueInDollar,
        DateTime lastUpdateAt)
    {
        Name = name;
        Symbol = symbol;
        ValueInDollar = valueInDollar;
        LastUpdateAt = lastUpdateAt;
    }

    protected CurrencyData() { }

    public string Name { get; private set; }
    public string Symbol { get; private set; }
    public decimal ValueInDollar { get; private set; }
    public DateTime LastUpdateAt { get; private set; }
    public bool Available { get; private set; }

    public void SetSymbol(string symbol)
        => Symbol = symbol;

    public void UpdatedNow()
        => LastUpdateAt = DateTime.Now;

    public void SetValueInDollar(decimal valueInDollar)
        => ValueInDollar = valueInDollar;
}
