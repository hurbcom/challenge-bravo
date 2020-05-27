using CurrencyConverter.Domain.Entities;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Service.Interfaces;
using System;
using System.Collections.Generic;
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
            throw new NotImplementedException();
        }

        public IEnumerable<Currency> GetAll()
        {
            return _repo.GetAll<Currency>();
        }

        public IEnumerable<Currency> GetAllActive()
        {
            throw new NotImplementedException();
        }

        public Currency GetById(int id)
        {
            throw new NotImplementedException();
        }

        public bool UpdateCurrency(Currency currency)
        {
            throw new NotImplementedException();
        }
    }
}
