using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace challenge_bravo.Models
{
    public class ApiCurrency
    {
        public string Date{ get; set; }
        public virtual ApiCurrencies Usd { get; set; }    
    }

    public class ApiCurrencies
    {
        public decimal eur { get; set; }
        public decimal brl { get; set; }
        public decimal btc { get; set; }
        public decimal eth { get; set; }
        
    }
}