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

        public bool DeleteCurrency(Currency currency)
        {
            currency.isActive = false;
            return _repo.Update<Currency>(currency);
        }

        public IEnumerable<Currency> GetAll()
        {
            return _repo.GetAll<Currency>();
        }

        public IEnumerable<Currency> GetAllActive()
        {
            return _repo.GetAll<Currency>().Where(i => i.isActive = true);
        }

        public Currency GetById(int id)
        {
            return _repo.GetById<Currency>(id);
        }

        public bool UpdateCurrency(Currency currency)
        {
            return _repo.Update<Currency>(currency);
        }
    }
}
