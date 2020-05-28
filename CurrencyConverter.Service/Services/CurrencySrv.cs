using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CurrencyConverter.Service.Services
{
    public class CurrencySrv : ICurrencySrv
    {
        private readonly IRepositoryBase<Currency> _repo;

        public CurrencySrv(IRepositoryBase<Currency> repo)
        {
            _repo = repo;
        }

        public int AddCurrency(Currency currency)
        {
            var item = _repo.Insert<Currency>(currency);
            return item;
        }

        public bool DeleteCurrency(int currencyId)
        {
            if (currencyId > 0)
            {
                var item = _repo.GetById<Currency>(currencyId);
                item.isActive = false;
                return _repo.Update<Currency>(item);
            }
            else
            {
                return false;
            }
        }

        public IEnumerable<Currency> GetAll()
        {
            return _repo.GetAll<Currency>();
        }

        public IEnumerable<Currency> GetAllActive()
        {
            return _repo.GetAll<Currency>(i => i.isActive == true);
        }

        public Currency GetById(int id)
        {
            if (id > 0)
            {
                return _repo.GetById<Currency>(id);
            }
            else
            {
                return null;
            }
        }

        public bool UpdateCurrency(int id, Currency currency)
        {
            if (id > 0)
            {
                currency.id = id;
                return _repo.Update<Currency>(currency);
            }
            else
            {
                return false;
            }
        }
    }
}
