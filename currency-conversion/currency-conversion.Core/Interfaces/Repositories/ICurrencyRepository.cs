using currency_conversion.Core.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace currency_conversion.Core.Interfaces.Repositories
{
    public interface ICurrencyRepository
    {
        public EntityEntry<Currency> Create(Currency currency);

        public Currency? Read(string code);

        public EntityEntry<Currency> Update(Currency currency);

        public void Delete(string code);
    }
}
