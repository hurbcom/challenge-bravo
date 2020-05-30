using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using Hangfire;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CurrencyConverter
{
    public class BackgroundJobsSrvc : IBackgroundJobsSrvc
    {
        public IPriceSrvc PriceSrvc { get; }
        public IRepositoryBase<Configuration> _repo { get; }

        public BackgroundJobsSrvc(IPriceSrvc priceSrvc, IRepositoryBase<Configuration> repo)
        {
            PriceSrvc = priceSrvc;
            _repo = repo;
        }

        public void callRevalidateCache()
        {
            throw new NotImplementedException();
        }

        public void callUpdateAllCurrencyRates()
        {
            Configuration config = _repo.GetAll<Configuration>().ToList().FirstOrDefault();
            BackgroundJob.Enqueue(() => PriceSrvc.UpdateAllActiveRates());
            RecurringJob.AddOrUpdate("upd-CurrenciesPrice", () => PriceSrvc.UpdateAllActiveRates(), Cron.MinuteInterval(config.refreshTime));
        }
    }
}
