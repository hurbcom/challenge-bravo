using currency_conversion.Core.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace currency_conversion.Core.Interfaces.Repositories
{
    public interface ICurrencyRepository
    {
        public bool Create(Currency currency);

        public Currency? Read(string code);

        public bool Update(Currency currency);

        public bool Delete(string code);
    }
}
