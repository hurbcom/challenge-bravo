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
        public IRepositoryBase<Currency> _repo { get; }
        public IDistributedCache _cache { get; }

        public PriceSrvc(ICryptoComparer cryptoComparer, IRepositoryBase<Currency> repo, IDistributedCache cache)
        {
            _cryptoComparer = cryptoComparer;
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
                try
                {
                    _cache.SetString(currency.name, latestRate.ToString());
                }
                catch (Exception)
                {
                    //Logger pro Redis
                }
                
            }
            else
            {
                return false;
            }
            return true;
        }
    }
}
