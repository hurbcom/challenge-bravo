using AspNetCore.IQueryable.Extensions.Attributes;
using AspNetCore.IQueryable.Extensions.Filter;
using HURB.Application.Model.Request.Filter;

namespace HURB.Application.Model.QueryFilter
{
    public class QuotationCurrencyFilterQuery : QueryFilterRequest
    {
        [QueryOperator(Operator = WhereOperator.Contains, CaseSensitive = false)]
        public string? Country { get; set; }
    }
}
