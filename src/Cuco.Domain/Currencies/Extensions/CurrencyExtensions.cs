using Cuco.Domain.Currencies.Models.DTOs;
using Cuco.Domain.Currencies.Models.Entities;

namespace Cuco.Domain.Currencies.Extensions;

public static class CurrencyExtensions
{
    public static CurrencyDto ToDto(this Currency currency)
    {
        return new()
        {
            Name = currency.Name,
            Symbol = currency.Symbol,
            ValueInDollar = currency.ValueInDollar,
            LastUpdateAt = currency.LastUpdateAt,
            Available = currency.Available
        };
    }
}