using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface ICryptoComparer
    {
        float GetLastestRate(string currency);
    }
}
