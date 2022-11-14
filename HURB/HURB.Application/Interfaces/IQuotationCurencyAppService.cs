using HURB.Application.Model.QueryFilter;
using HURB.Application.Model.Response;
using HURB.Core.Model.Response.QuotationCurrency;

namespace HURB.Application.Interfaces
{
    public interface IQuotationCurencyAppService
    {
        Task<PagedResponse<QuotationCurrencyResponse>> FilterAsync(QuotationCurrencyFilterQuery filter);
    }
}
