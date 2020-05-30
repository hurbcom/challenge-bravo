using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter
{
    public interface IBackgroundJobsSrvc
    {
        void callUpdateAllCurrencyRates();
        void callRevalidateCache();
    }
}
