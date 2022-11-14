using HURB.Core.Interfaces.Filter;

namespace HURB.Application.Model.Request.Filter
{
    public class QueryFilterRequest : IQueryFilterRequest
    {
        private int? _limit = 20;
        private int _page = 1;
        private int? _offset;

        public int? Limit
        {
            get => _limit;
            set => _limit = value == 0 ? ++value : value;
        }

        public int? Offset
        {
            get => this._offset.GetValueOrDefault() + ((this.Page - 1) * this.Limit);
            set => this._offset = value;
        }

        public int Page
        {
            get => _page;
            set => _page = value;
        }
    }
}
