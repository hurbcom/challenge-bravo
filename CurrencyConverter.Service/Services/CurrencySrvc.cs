using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CurrencyConverter.Service.Services
{
    public class CurrencySrvc : ICurrencySrvc
    {
        private readonly IRepositoryBase<Currency> _repoCurrency;
        private readonly Configuration _config;
        private readonly IPriceSrvc _price;

        public CurrencySrvc(IRepositoryBase<Currency> repoCurrency, IRepositoryBase<Configuration> repoConfig, IPriceSrvc price)
        {
            _repoCurrency = repoCurrency;
            _config = repoConfig.GetAll<Configuration>().ToList().FirstOrDefault();
            _price = price;
        }

        public int AddCurrency(string currencyName)
        {
            Currency currency = new Currency();
            currency.name = currencyName;
            currency.@base = _config.baseRate;
            if (_price.UpdateRate(currency))
            {
                return currency.id;
            }
            else
            {
                throw new Exception($"Cannot create currency {currencyName}");
            }
        }

        public bool DeleteCurrency(int currencyId)
        {
            if (currencyId > 0)
            {
                var item = _repoCurrency.GetById<Currency>(currencyId);
                item.isActive = false;
                return _repoCurrency.Update<Currency>(item);
            }
            else
            {
                return false;
            }
        }

        public IEnumerable<Currency> GetAll()
        {
            return _repoCurrency.GetAll<Currency>();
        }

        public IEnumerable<Currency> GetAllActive()
        {
            return _repoCurrency.GetAll<Currency>(i => i.isActive == true);
        }

        public Currency GetById(int id)
        {
            if (id > 0)
            {
                return _repoCurrency.GetById<Currency>(id);
            }
            else
            {
                return null;
            }
        }

        public bool SyncAllActiveCurrencyRates()
        {
            var allCurrencies = GetAllActive();

            foreach (var item in allCurrencies)
            {
                if (!_price.UpdateRate(item))
                    throw new Exception("Fail when updating all currency rates");
            };
            return true;
        }
    }
}
