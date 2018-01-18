using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Project.WebApi.ViewModels
{
    /// <summary>
    /// 
    /// </summary>
    public class CurrencyDataViewModel
    {
        /// <summary>
        /// 
        /// </summary>
        public string BaseCurrencySymbol { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string TargetCurrencySymbol { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public double last_updated;

        /// <summary>
        /// 
        /// </summary>
        public string Last_updated_converted
        {
            get {

                double timestamp = last_updated;
                var date = new DateTime(1970, 1, 1, 0, 0, 0, 0);

                date = date.AddSeconds(timestamp).ToLocalTime();

                return date.ToString("dd/MM/yyyy HH:mm:ss");
            }
        }

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

        #region ' dollar unit '

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Usd_in_Brl { get { return Price_brl / Price_usd; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Usd_in_Eth { get { return Price_eth / Price_usd; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Usd_in_Btc { get { return Price_btc / Price_usd; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Usd_in_Eur { get { return Price_eur / Price_usd; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Usd_in_Usd { get { return 1M; } }

        #endregion

        #region ' real (brl) unit '

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Brl_in_Brl { get { return 1M; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Brl_in_Usd { get { return Price_usd / Price_brl; } }

        #endregion

        #region ' euro unit '

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Eur_in_Eur { get { return 1M; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Eur_in_Usd { get { return Price_usd / Price_eur; } }

        #endregion

        #region ' bitcoin unit (satoshi) '

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Btc_in_Btc { get { return 1M; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Btc_in_Usd { get { return Price_usd / Price_btc; } }

        #endregion

        #region ' ethereum unit (ether) '

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Eth_in_Eth { get { return 1M; } }

        /// <summary>
        /// 
        /// </summary>
        public decimal UnitPrice_Eth_in_Usd { get { return Price_usd / Price_eth; } }

        #endregion
    }
}