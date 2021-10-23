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
        public double RateValue     { get; set; }
        public string RateCurrency  { get; set; }
        public bool AutoUpdateRate  { get; set; }
    }
}
