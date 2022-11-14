using HURB.Core.Entities;
using HURB.Core.Interfaces.Filter;
using HURB.Core.Interfaces.Repositories.Base;
using HURB.Core.Model.Response.QuotationCurrency;
using Microsoft.EntityFrameworkCore.Query;

namespace HURB.Core.Interfaces.Repositories
{
    public interface IQuotationCurrencyRepository : IBaseRepository<QuotationCurrency>
    {
        Task<IQueryable<QuotationCurrencyResponse>> FilterAsync(IQueryFilterRequest filter,
        Func<IQueryable<QuotationCurrency>, IIncludableQueryable<QuotationCurrency, object>>? include = null, bool useQuerySplit = false);
        Task<QuotationCurrency> GetCurrencyAsync(string country, string currency, Func<IQueryable<QuotationCurrency>, IIncludableQueryable<QuotationCurrency, object>>? include = null, bool useQuerySplit = false);
    }
}
