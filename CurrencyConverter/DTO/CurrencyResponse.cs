using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CurrencyConverter.API.DTO
{
    public class CurrencyResponse
    {
        public string name { get; set; }
        public float rate { get; set; }
        public string @base { get; set; }
        public DateTime lastUpdate { get; set; } = DateTime.Now;
    }
}
