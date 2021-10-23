using System;
using System.Collections.Generic;

namespace CurrencyAPI.Models
{
    public class ConversionRequestObject
    {
        public string From      { get; set; }
        public string To        { get; set; }
        public double Amount    { get; set; }
    }
}
