using System;

namespace Project.Business.DTOs
{
    public class CurrencyDTO
    {
        public string Symbol { get; set; }
        public string TargetCurrencySymbol { get; set; }

        public decimal Last_updated { get; set; }

        public decimal Price_usd { get; set; }
        public decimal Price_btc { get; set; }
        public decimal Price_brl { get; set; }
        public decimal Price_eth { get; set; }
        public decimal Price_eur { get; set; }

        #region ' dollar unit '

        public decimal UnitPrice_Usd_in_Brl { get { return Price_brl / Price_usd; } }
        public decimal UnitPrice_Usd_in_Eth { get { return Price_eth / Price_usd; } }
        public decimal UnitPrice_Usd_in_Btc { get { return Price_btc / Price_usd; } }
        public decimal UnitPrice_Usd_in_Eur { get { return Price_eur / Price_usd; } }
        public decimal UnitPrice_Usd_in_Usd { get { return 1M; } }

        #endregion

        #region ' real (brl) unit '

        public decimal UnitPrice_Brl_in_Brl { get { return 1M; } }
        //public decimal UnitPrice_Brl_Eth { get { return Price_eth / Price_brl; } }
        //public decimal UnitPrice_Brl_Btc { get { return Price_btc / Price_brl; } }
        //public decimal UnitPrice_Brl_Eur { get { return Price_eur / Price_brl; } }
        public decimal UnitPrice_Brl_in_Usd { get { return Price_usd / Price_brl; } }

        #endregion

        #region ' euro unit '

        //public decimal UnitPrice_Eur_Brl { get { return Price_brl / Price_eur; } }
        //public decimal UnitPrice_Eur_Eth { get { return Price_eth / Price_eur; } }
        //public decimal UnitPrice_Eur_Btc { get { return Price_btc / Price_eur; } }
        public decimal UnitPrice_Eur_in_Eur { get { return 1M; } }
        public decimal UnitPrice_Eur_in_Usd { get { return Price_usd / Price_eur; } }

        #endregion

        #region ' bitcoin unit (satoshi) '

        //public decimal UnitPrice_Btc_Brl { get { return Price_brl / Price_btc; } }
        //public decimal UnitPrice_Btc_Eth { get { return Price_eth / Price_btc; } }
        public decimal UnitPrice_Btc_in_Btc { get { return 1M; } }
        //public decimal UnitPrice_Btc_Eur { get { return Price_eur / Price_btc; } }
        public decimal UnitPrice_Btc_in_Usd { get { return Price_usd / Price_btc; } }

        #endregion

        #region ' ethereum unit (ether) '

        //public decimal UnitPrice_Eth_Brl { get { return Price_brl / Price_eth; } }
        public decimal UnitPrice_Eth_in_Eth { get { return 1M; } }
        //public decimal UnitPrice_Eth_Btc { get { return Price_btc / Price_eth; } }
        //public decimal UnitPrice_Eth_Eur { get { return Price_eur / Price_eth; } }
        public decimal UnitPrice_Eth_in_Usd { get { return Price_usd / Price_eth; } }

        #endregion
    }
}
