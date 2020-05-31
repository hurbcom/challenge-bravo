using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using Hangfire;
using System;
using System.Linq;

namespace CurrencyConverter
{
    public class BackgroundJobsSrvc : IBackgroundJobsSrvc
    {
        public ICurrencySrvc _currencySrvc { get; }
        public IRepositoryBase<Configuration> _repo { get; }

        public BackgroundJobsSrvc(ICurrencySrvc currencySrvc, IRepositoryBase<Configuration> repo)
        {
            _currencySrvc = currencySrvc;
            _repo = repo;
        }

        public void callUpdateAllCurrencyRates()
        {
            try
            {
                Configuration config = _repo.GetAll<Configuration>().ToList().FirstOrDefault();
                BackgroundJob.Enqueue(() => _currencySrvc.SyncAllActiveCurrencyRates());
                RecurringJob.AddOrUpdate("upd-CurrenciesPrice", () => _currencySrvc.SyncAllActiveCurrencyRates(), Cron.MinuteInterval(config.refreshTime));
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating BackgroundJobs {ex.Message}");
            }
        }
    }
}
