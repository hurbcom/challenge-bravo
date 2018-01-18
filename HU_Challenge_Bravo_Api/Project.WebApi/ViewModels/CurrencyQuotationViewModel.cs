using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Project.WebApi.ViewModels
{
    /// <summary>
    /// 
    /// </summary>
    public class CurrencyQuotationViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public string Symbol { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string TargetCurrencySymbol { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double Last_updated { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public decimal Price_usd { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public decimal Price_btc { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public decimal Price_brl { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public decimal Price_eth { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public decimal Price_eur { get; set; }
    }
}