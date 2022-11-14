using HURB.Core.Interfaces.Filter;

namespace HURB.Application.Model.Response
{
    public class PagedResponse<TModel> where TModel : class
    {
        private readonly IQueryFilterRequest _filter;

        public PagedResponse(
            ICollection<TModel> items,
            IQueryFilterRequest filter,
            int maxFound
        )
        {
            this.Items = items;
            this._filter = filter;
            this.MaxFound = maxFound;
        }

        public ICollection<TModel> Items { get; private set; }
        public int TotalPages { get => getTotalPages(); }
        public int? NextPage { get => this.getNextPage(this._filter.Page); }
        public int? PreviousPage { get => this.getPreviousPage(this._filter.Page); }
        public int Page { get => this._filter.Page; }
        public int MaxFound { get; private set; }

        private int? getNextPage(int page)
            => page >= TotalPages ? null : page + 1;

        private int? getPreviousPage(int page)
            => page == 1 || page > this.TotalPages ? null : page - 1;

        private int getTotalPages()
        {
            double pageNumberAsDecimal = (double)this.MaxFound / (double)this._filter.Limit.GetValueOrDefault();
            return (int)Math.Ceiling(pageNumberAsDecimal);
        }
    }

    public static class ToPagedGenericExtension
    {
        public static PagedResponse<T> ToPagedItems<T>(
          this ICollection<T> items,
          IQueryFilterRequest filter,
          int totalFound
      ) where T : class
        {
            if (items == null) return null;

            return new PagedResponse<T>(
                items: items,
                filter: filter,
                maxFound: totalFound
            );
        }
    }
}
