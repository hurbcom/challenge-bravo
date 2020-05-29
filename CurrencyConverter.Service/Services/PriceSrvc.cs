using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace CurrencyConverter.Service.Services
{
    public class PriceSrvc : IPriceSrvc
    {
        public ICryptoComparer _cryptoComparer { get; }
        public IRepositoryBase<Configuration> _repoConfig { get; }
        public IRepositoryBase<Currency> _repoCurrency { get; }

        public PriceSrvc(ICryptoComparer cryptoComparer, IRepositoryBase<Configuration> repoConfig, IRepositoryBase<Currency> repoCurrency)
        {
            _cryptoComparer = cryptoComparer;
            _repoConfig = repoConfig;
            _repoCurrency = repoCurrency;
        }

        public float Convert(Currency from, Currency to, float amount)
        {
            var fromAmount = amount * from.rate;
            var toAmount = fromAmount / to.rate;

            return toAmount;
        }

        public bool UpdateRate(Currency currency)
        {
            var latestRate = _cryptoComparer.GetLastestRate(currency.name);
            currency.rate = latestRate;
            return _repoCurrency.Update<Currency>(currency);
        }
    }
}
