using currency_conversion.Core.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace currency_conversion.Core.Interfaces.Repositories
{
    public interface ICurrencyRepository
    {
        public bool Create(Currency currency);

        public void CreateMany(IEnumerable<Currency> currencies);

        public Currency? Read(string code);

        public List<Currency> ReadAll();

        public List<Currency> ReadAllNotCustom();

        public bool Update(Currency currency);

        public void UpdateMany(IEnumerable<Currency> currencies);

        public bool Delete(string code);
    }
}
