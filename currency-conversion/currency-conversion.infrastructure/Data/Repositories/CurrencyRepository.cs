using currency_conversion.Core.Interfaces.Repositories;

namespace currency_conversion.infrastructure.Data.Repositories
{
    public class CurrencyRepository : ICurrencyRepository
    {
        public CurrencyRepository(AppDbContext dbContext)
        {

        }
    }
}
