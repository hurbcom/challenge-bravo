using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
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

        public PriceSrvc(ICryptoComparer cryptoComparer, ICurrencySrvc currencySrvc, IRepositoryBase<Currency> repo)
        {
            _cryptoComparer = cryptoComparer;
            _currencySrvc = currencySrvc;
            _repo = repo;
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
            return _repo.Update<Currency>(currency);
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
