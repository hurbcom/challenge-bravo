using CurrencyConverter.Domain.Entities;

namespace CurrencyConverter.Service.Interfaces
{
    public interface IPriceSrvc
    {
        bool UpdateRate(Currency currency);
    }
}