using Microsoft.EntityFrameworkCore;
using SharedLibrary.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SharedLibrary
{
    // Class to improve access to local database
    public class SQLLiteDbContext : DbContext
    {
        private DbSet<CurrencyObject> _currencies { get; set; }
        public SQLLiteDbContext(DbContextOptions<SQLLiteDbContext> options) : base(options)
        {
        }

        public async Task<IEnumerable<CurrencyObject>> FindAll()
        {
            return await _currencies.ToListAsync(); 
        }

        public async Task<CurrencyObject> FindOne(string name)
        {
            return await _currencies.FindAsync(name);
        }

        public async Task<bool> Insert(CurrencyObject newCurrency)
        {
            await _currencies.AddAsync(newCurrency);
            await this.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Update(CurrencyObject updatedCurrency)
        {
            CurrencyObject obj  = await _currencies.FindAsync(updatedCurrency.Name);
            obj                 = updatedCurrency;
            await this.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(string name)
        {
            CurrencyObject obj = await _currencies.FindAsync(name);
            _currencies.Remove(obj);
            await this.SaveChangesAsync();
            return true;
        }
    }
}
