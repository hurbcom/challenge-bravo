using CurrencyConverter.Api.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;

namespace CurrencyConverter.Api.Data
{
    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly CurrencyDbContext _currencyDbContext;

        public CurrencyRepository(CurrencyDbContext currencyDbContext)
        {
            _currencyDbContext = currencyDbContext;
        }

        public async Task<Currency?> CreateAsync(Currency newCurrency)
        {
            newCurrency.Id = ObjectId.GenerateNewId();
            var response = _currencyDbContext.Currencies.Add(newCurrency);

            _currencyDbContext.ChangeTracker.DetectChanges();
            Console.WriteLine(_currencyDbContext.ChangeTracker.DebugView.LongView);

            _currencyDbContext.SaveChanges();

            return response.Entity;
        }

        public async Task<List<Currency>> GetAsync()
        {
            return await _currencyDbContext.Currencies.ToListAsync();
        }

        public async Task<Currency?> GetAsync(string id)
        {
            return await _currencyDbContext.Currencies.Where(x => x.Id == new ObjectId(id)).FirstOrDefaultAsync();
        }

        public async Task<List<Currency>> GetByCodes(List<string> codes)
        {
            return await _currencyDbContext.Currencies.Where(x => codes.Contains(x.Code)).ToListAsync();
        }

        public async Task RemoveAsync(string code)
        {
            var currencyToDelete = _currencyDbContext.Currencies.FirstOrDefault(c => c.Code == code);

            if (currencyToDelete != null)
            {
                _currencyDbContext.Currencies.Remove(currencyToDelete);
                _currencyDbContext.ChangeTracker.DetectChanges();
                Console.WriteLine(_currencyDbContext.ChangeTracker.DebugView.LongView);
                _currencyDbContext.SaveChanges();
            }
            else
            {
                throw new ArgumentException("The currency to delete cannot be found.");
            }
        }

        public async Task UpdateAsync(string id, Currency entity)
        {
            var currencyToUpdate = _currencyDbContext.Currencies.FirstOrDefault(c => c.Id == new ObjectId(id));

            if (currencyToUpdate != null)
            {
                _currencyDbContext.Currencies.Update(currencyToUpdate);
                _currencyDbContext.ChangeTracker.DetectChanges();
                Console.WriteLine(_currencyDbContext.ChangeTracker.DebugView.LongView);
                _currencyDbContext.SaveChanges();
            }
            else
            {
                throw new ArgumentException("The currency to update cannot be found. ");
            }
        }
    }
}
