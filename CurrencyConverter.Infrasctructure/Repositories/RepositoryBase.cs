using CurrencyConverter.Domain.Interfaces;
using CurrencyConverter.Infrasctructure.Interfaces;
using CurrencyConverter.Infrastructure;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace CurrencyConverter.Infrasctructure.Repositories
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : IEntity
    {
        private readonly DatabaseContext _context;

        public RepositoryBase(DatabaseContext context)
        {
            _context = context;
        }

        public virtual IEnumerable<T> GetAll<T>(Expression<Func<T, bool>> filter = null) where T : class, IEntity
        {
            if (filter != null)
            {
                var items = _context.Set<T>().ToList().AsQueryable<T>().Where(filter);
                return items;
            }
            else
            {
                var items = _context.Set<T>().ToList();
                return items;
            }
        }

        public virtual int Insert<T>(T entity) where T : class, IEntity
        {
            _context.Add<T>(entity);
            _context.SaveChanges();

            return entity.id;
        }

        public virtual bool Update<T>(T entity) where T : class, IEntity
        {
            _context.Update<T>(entity);
            if (_context.SaveChanges() == 1)
                return true;
            else
                return false;
        }

        public virtual T GetById<T>(int id) where T : class, IEntity
        {
            var t = _context.Find<T>(id);
            if (t != null)
                return t;
            else
                return null;
        }
    }
}
