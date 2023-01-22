using Cuco.Domain.Currencies.Models.Entities;

namespace Cuco.Application.UpdateCurrency.Models;

public class UpdateCurrencyOutput
{
    public bool Result { get; set; }
    public Currency Currency { get; set; }
}