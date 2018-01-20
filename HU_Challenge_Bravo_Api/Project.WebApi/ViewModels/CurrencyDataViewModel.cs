using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Project.WebApi.ViewModels
{
    /// <summary>
    /// This class is used to get converted currency data. This data is provided by its API, not from the external.
    /// </summary>
    public class CurrencyDataViewModel
    {
        #region ' Currency Data '

        /// <summary>
        /// This property represents the base currency symbol. e.g: USD, BRL, EUR, etc.
        /// </summary>
        public string BaseCurrencySymbol { get; set; }

        /// <summary>
        /// This property represents the target currency symbol. e.g: USD, BRL, EUR, etc.
        /// </summary>
        public string TargetCurrencySymbol { get; set; }

        /// <summary>
        /// This property represents the last datetime that the quotation was updated 
        /// on the server (external API).
        /// </summary>
        public double last_updated;

        /// <summary>
        /// This property is used to convert the timestamp given by the external API (as last updated date)
        /// in a legible date time format.
        /// </summary>
        public string Last_updated_converted
        {
            get
            {

                double timestamp = last_updated;
                var date = new DateTime(1970, 1, 1, 0, 0, 0, 0);

                date = date.AddSeconds(timestamp).ToLocalTime();

                return date.ToString("dd/MM/yyyy HH:mm:ss");
            }
        }

        /// <summary>
        /// This property represents the USD unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_usd { get; set; }

        /// <summary>
        /// This property represents the BTC unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_btc { get; set; }

        /// <summary>
        /// This property represents the BRL unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_brl { get; set; }

        /// <summary>
        /// This property represents the ETH unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_eth { get; set; }

        /// <summary>
        /// This property represents the EUR unit price based on Bitcoin and it's provided by the external API.
        /// </summary>
        public decimal Price_eur { get; set; }

        #endregion

        #region ' dollar (usd) unit price '

        /// <summary>
        /// This property represents the unit price for USD in BRL currency.
        /// </summary>
        public decimal UnitPrice_Usd_in_Brl { get { return Price_brl / Price_usd; } }

        /// <summary>
        /// This property represents the unit price for USD in ETH currency.
        /// </summary>
        public decimal UnitPrice_Usd_in_Eth { get { return Price_eth / Price_usd; } }

        /// <summary>
        /// This property represents the unit price for USD in BTC currency.
        /// </summary>
        public decimal UnitPrice_Usd_in_Btc { get { return Price_btc / Price_usd; } }

        /// <summary>
        /// This property represents the unit price for USD in EUR currency.
        /// </summary>
        public decimal UnitPrice_Usd_in_Eur { get { return Price_eur / Price_usd; } }

        /// <summary>
        /// This property represents the unit price for USD in USD currency.
        /// </summary>
        public decimal UnitPrice_Usd_in_Usd { get { return 1M; } }

        #endregion

        #region ' real (brl) unit price '

        /// <summary>
        /// This property represents the unit price for BRL in BRL currency.
        /// </summary>
        public decimal UnitPrice_Brl_in_Brl { get { return 1M; } }

        /// <summary>
        /// This property represents the unit price for BRL in USD currency.
        /// </summary>
        public decimal UnitPrice_Brl_in_Usd { get { return Price_usd / Price_brl; } }

        #endregion

        #region ' euro (eur) unit price '

        /// <summary>
        /// This property represents the unit price for EUR in EUR currency.
        /// </summary>
        public decimal UnitPrice_Eur_in_Eur { get { return 1M; } }

        /// <summary>
        /// This property represents the unit price for EUR in USD currency.
        /// </summary>
        public decimal UnitPrice_Eur_in_Usd { get { return Price_usd / Price_eur; } }

        #endregion

        #region ' bitcoin (btc) unit (satoshi) price '

        /// <summary>
        /// This property represents the unit price for BTC in BTC currency.
        /// </summary>
        public decimal UnitPrice_Btc_in_Btc { get { return 1M; } }

        /// <summary>
        /// This property represents the unit price for BTC in USD currency.
        /// </summary>
        public decimal UnitPrice_Btc_in_Usd { get { return Price_usd / Price_btc; } }

        #endregion

        #region ' ethereum (eth) unit (ether) price '

        /// <summary>
        /// This property represents the unit price for ETH in ETH currency.
        /// </summary>
        public decimal UnitPrice_Eth_in_Eth { get { return 1M; } }

        /// <summary>
        /// This property represents the unit price for ETH in USD currency.
        /// </summary>
        public decimal UnitPrice_Eth_in_Usd { get { return Price_usd / Price_eth; } }

        #endregion
    }
}