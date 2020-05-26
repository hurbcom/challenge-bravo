using CurrencyConverter.Domain.Helpers;
using CurrencyConverter.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Domain.Entities
{
    public class Currency : IEntity
    {
        public int id { get; set; }
        public string name { get; set; }
        public float rate { get; set; }
        public string @base { get; set; }
        public currencyType type { get; set; }
    }
}
