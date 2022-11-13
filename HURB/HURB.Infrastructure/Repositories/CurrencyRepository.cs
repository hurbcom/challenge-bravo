using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Infrastructure.Data;
using HURB.Infrastructure.Repositories.Base;

namespace HURB.Infrastructure.Repositories
{
    public class CurrencyRepository : BaseRepository<Currency>, ICurrencyRepository
    {
        public CurrencyRepository(HURBContext context) : base(context)
        {
        }
    }
}
