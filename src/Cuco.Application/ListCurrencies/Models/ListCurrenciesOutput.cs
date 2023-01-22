using Cuco.Domain.Currencies.Models.Entities;

namespace Cuco.Application.ListCurrencies.Models;

public class ListCurrenciesOutput
{
    public IEnumerable<Currency> Currencies { get; set; }
}