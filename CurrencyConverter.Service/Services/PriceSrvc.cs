using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CurrencyConverter.Service.Services
{
    public class PriceSrvc : IPriceSrvc
    {
        public ICryptoComparer _cryptoComparer { get; }
        public ICurrencySrvc _currencySrvc { get; }
        public IRepositoryBase<Currency> _repo { get; }
        public IDistributedCache _cache { get; }

        public PriceSrvc(ICryptoComparer cryptoComparer, ICurrencySrvc currencySrvc, IRepositoryBase<Currency> repo, IDistributedCache cache)
        {
            _cryptoComparer = cryptoComparer;
            _currencySrvc = currencySrvc;
            _repo = repo;
            _cache = cache;
        }

        public float Convert(string from, string to, float amount)
        {
            var fromRate = float.Parse(_cache.GetString(from));
            var toRate = float.Parse(_cache.GetString(to));

            var fromAmount = amount * fromRate;
            var toAmount = fromAmount / toRate;

            return toAmount;
        }

        public bool UpdateRate(Currency currency)
        {
            var latestRate = _cryptoComparer.GetLastestRate(currency.name);
            currency.rate = latestRate;
            if(_repo.Update<Currency>(currency))
            {
                _cache.SetString(currency.name, latestRate.ToString());
            }
            else
            {
                return false;
            }
            return true;
        }

        public bool UpdateAllActiveRates()
        {
            var allCurrencies = _currencySrvc.GetAllActive();

            foreach (var item in allCurrencies)
            {
                if (!UpdateRate(item))
                    throw new Exception("Fail when updating all currency rates");
            };
            return true;
        }
    }
}
