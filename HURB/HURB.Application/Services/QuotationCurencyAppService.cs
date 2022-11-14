using AspNetCore.IQueryable.Extensions;
using AutoMapper;
using HURB.Application.Interfaces;
using HURB.Application.Model.QueryFilter;
using HURB.Application.Model.Response;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Model.Response.QuotationCurrency;
using Microsoft.EntityFrameworkCore;

namespace HURB.Application.Services
{
    public class QuotationCurencyAppService : IQuotationCurencyAppService
    {
        private readonly IQuotationCurrencyRepository _repository;
        private readonly IMapper _mapper;

        public QuotationCurencyAppService(IQuotationCurrencyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PagedResponse<QuotationCurrencyResponse>> FilterAsync(QuotationCurrencyFilterQuery filter)
        {
            IQueryable<QuotationCurrencyResponse> results = await _repository.FilterAsync(filter);
            var totalResults = await results.CountAsync();

            var pagedResults = await results.Apply(filter).ToListAsync();

            var resultsList = _mapper.Map<ICollection<QuotationCurrencyResponse>>(pagedResults);

            return resultsList.ToPagedItems(filter, totalResults);
        }
    }
}
