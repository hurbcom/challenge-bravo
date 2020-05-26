using CurrencyConverter.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Domain.Entities
{
    public class Configuration : IEntity
    {
        public int id { get; set; }
        public int refreshTime { get; set; }
        public string baseRate { get; set; }
        public int minRefresh { get; set; }
        public int maxRefresh { get; set; }
    }
}
