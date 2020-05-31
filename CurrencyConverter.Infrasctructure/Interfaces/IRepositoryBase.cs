using CurrencyConverter.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace CurrencyConverter.Infrasctructure.Interfaces
{
    public interface IRepositoryBase<T> where T : IEntity
    {
        int Insert<T>(T entity) where T : class, IEntity;
        bool Update<T>(T entity) where T : class, IEntity;
        IEnumerable<T> GetAll<T>(Expression<Func<T, bool>> filter = null) where T : class, IEntity;
    }
}
