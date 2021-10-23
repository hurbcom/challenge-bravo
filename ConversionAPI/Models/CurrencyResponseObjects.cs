using System;
using System.Collections.Generic;

namespace CurrencyAPI.Models
{
    public class CurrencyResponseObject : BaseResponseObject
    {
        public string Name          { get; set; }    
        public double PriceValue    { get; set; }
        public bool AutoUpdateValue  { get; set; }
    }

    public class ListCurrenciesResponseObject : BaseResponseObject
    {
        public List<ListCurrencyObject> Currencies { get; set; }
    }

    public class ListCurrencyObject
    {
        public string Name              { get; set; }
        public double PriceValue        { get; set; }
        public bool AutoUpdateValue     { get; set; }
    }

}
