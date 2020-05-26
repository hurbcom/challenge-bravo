using CurrencyConverter.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Domain.Entities
{
    public class Currency : IEntity
    {
        public int id { get; set; }
        string name { get; set; }
        float rate { get; set; }
        string @base { get; set; }
    }
}
