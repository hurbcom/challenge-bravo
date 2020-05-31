using CurrencyConverter.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Service.Interfaces
{
    public interface IPriceSrvc
    {
        float Convert(string from, string to, float amount);
        bool UpdateRate(Currency currency);
    }
}