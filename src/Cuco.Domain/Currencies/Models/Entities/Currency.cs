using Cuco.Commons.Base;

namespace Cuco.Domain.Currencies.Models.Entities;
public class Currency : Entity
{
    public Currency(
        string name,
        string symbol,
        decimal valueInDollar,
        DateTime lastUpdateAt,
        bool available)
    {
        Name = name;
        Symbol = symbol;
        ValueInDollar = valueInDollar;
        LastUpdateAt = lastUpdateAt;
        Available = available;
    }

    protected Currency() { }

    public string Symbol { get; }
    public string Name { get; private set; }
    public decimal ValueInDollar { get; private set; }
    public DateTime? LastUpdateAt { get; private set; }
    public bool Available { get; }

    public void SetValueInDollar(decimal valueInDollar)
        => ValueInDollar = valueInDollar;

    public void SetUpdatedAtUnix(long unixTimestamp)
        => LastUpdateAt = DateTimeOffset.FromUnixTimeSeconds(unixTimestamp).DateTime;
}
