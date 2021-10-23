using System;
using System.Collections.Generic;

namespace CurrencyAPI.Models
{
    public class CurrencyBaseRequestObject
    {
        public string Name          { get; set; }
    }

    public class CurrencyChangeObject : CurrencyBaseRequestObject
    {
        public double PriceValue     { get; set; }
        public string PriceCurrency  { get; set; }
        public bool AutoUpdatePrice  { get; set; }
    }
}
