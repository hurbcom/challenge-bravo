using CurrencyConverter.Domain.Entities;

namespace CurrencyConverter.Service.Interfaces
{
    public interface IPriceSrvc
    {
        float Convert(string from, string to, float amount);
        bool UpdateRate(Currency currency);
    }
}