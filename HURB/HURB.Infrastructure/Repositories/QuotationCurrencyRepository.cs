using AspNetCore.IQueryable.Extensions.Filter;
using HURB.Core.Entities;
using HURB.Core.Interfaces.Filter;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Model.Response.QuotationCurrency;
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

        public async Task<IQueryable<QuotationCurrencyResponse>> FilterAsync(IQueryFilterRequest filter,
        Func<IQueryable<QuotationCurrency>, IIncludableQueryable<QuotationCurrency, object>>? include = null, bool useQuerySplit = false)
        {
            var query = await base.FilterAsNoTrackingAsync(include);

            var queryResult = query.Select(x => new QuotationCurrencyResponse
            {
                Id = x.Id,
                Country = x.Country.DisplayName,
                Currency = x.Currency.ISOCurrencySymbol,
                Amount = $"{(x.Currency.CurrencySymbol)} {x.Value.ToString().PadLeft(8, '0')}"
            });

            queryResult = queryResult.Filter(filter)
                                     .OrderBy(x => x.Country)
                                     .ThenBy(x => x.Currency);
            return queryResult;
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
