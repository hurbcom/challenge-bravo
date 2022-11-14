using AspNetCore.IQueryable.Extensions.Pagination;

namespace HURB.Core.Interfaces.Filter
{
    public interface IQueryFilterRequest : IQueryPaging
    {
        int Page { get; set; }
    }
}
