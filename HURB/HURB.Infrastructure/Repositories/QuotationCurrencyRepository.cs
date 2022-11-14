using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Infrastructure.Data;
using HURB.Infrastructure.Repositories.Base;
using Microsoft.EntityFrameworkCore.Query;

namespace HURB.Infrastructure.Repositories
{
    public class QuotationCurrencyRepository : BaseRepository<QuotationCurrency>, IQuotationCurrencyRepository
    {
        public QuotationCurrencyRepository(HURBContext context) : base(context)
        {
        }

        public async Task<QuotationCurrency> GetCurrencyAsync(string country, string currency,
        Func<IQueryable<QuotationCurrency>, IIncludableQueryable<QuotationCurrency, object>>? include = null, bool useQuerySplit = false)
        {
            var query = await base.FilterAsNoTrackingAsync(include);
            var result = query.SingleOrDefault(x => x.Country.ThreeLetterISORegionName.ToUpper() == country.ToUpper() &&
                                                    x.Currency.ISOCurrencySymbol.ToUpper() == currency.ToUpper());
            return result;
        }
    }
}
