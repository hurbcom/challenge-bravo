using CurrencyConverter.Service.Interfaces;
using Hangfire;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter
{
    public class BackgroundJobsSrvc : IBackgroundJobsSrvc
    {
        public IPriceSrvc PriceSrvc { get; }

        public BackgroundJobsSrvc(IPriceSrvc priceSrvc)
        {
            PriceSrvc = priceSrvc;
        }

        public void callRevalidateCache()
        {
            throw new NotImplementedException();
        }

        public void callUpdateAllCurrencyRates()
        {
            BackgroundJob.Enqueue(() => PriceSrvc.UpdateAllActiveRates());
            RecurringJob.AddOrUpdate("upd-CurrenciesPrice", () => PriceSrvc.UpdateAllActiveRates(), Cron.MinuteInterval(1));
        }
    }
}
