using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CurrencyConverter.Service.Interfaces
{
    public interface IConverterSrvc
    {
        Task<decimal> convertCurrencyAsync(string from, string to, decimal amount);
    }
}
