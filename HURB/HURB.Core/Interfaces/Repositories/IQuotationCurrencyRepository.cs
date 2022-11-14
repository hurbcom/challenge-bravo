using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories.Base;
using Microsoft.EntityFrameworkCore.Query;

namespace HURB.Core.Interfaces.Repositories
{
    public interface IQuotationCurrencyRepository : IBaseRepository<QuotationCurrency>
    {
        Task<QuotationCurrency> GetCurrencyAsync(string country, string currency, Func<IQueryable<QuotationCurrency>, IIncludableQueryable<QuotationCurrency, object>>? include = null, bool useQuerySplit = false);
    }
}
