using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface IPriceIntegration
    {
        string GrabLastPrice(string currencyName);
    }
}
