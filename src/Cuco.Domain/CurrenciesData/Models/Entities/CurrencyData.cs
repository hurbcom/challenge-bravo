using Cuco.Domain.Base;

namespace Cuco.Domain.CurrenciesData.Models.Entities;
public class CurrencyData : Entity
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
}
