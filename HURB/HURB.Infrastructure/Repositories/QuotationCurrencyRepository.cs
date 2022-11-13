using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Infrastructure.Data;
using HURB.Infrastructure.Repositories.Base;

namespace HURB.Infrastructure.Repositories
{
    public class QuotationCurrencyRepository : BaseRepository<QuotationCurrency>, IQuotationCurrencyRepository
    {
        public QuotationCurrencyRepository(HURBContext context) : base(context)
        {
        }
    }
}
