using CurrencyConverter.Domain.Interfaces;
using System;

namespace CurrencyConverter.Domain.Entities
{
    public class Currency : IEntity
    {
        public int id { get; set; }
        public string name { get; set; }
        public decimal rate { get; set; }
        public string @base { get; set; }
        public bool isActive { get; set; } = true;
        public DateTime lastUpdate { get; set; } = DateTime.Now;
    }
}
