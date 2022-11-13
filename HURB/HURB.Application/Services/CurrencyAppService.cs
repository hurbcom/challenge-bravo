using AutoMapper;
using HURB.Application.Interfaces;
using HURB.Application.Model.Request.Currency;
using HURB.Application.Model.Response.Currency;
using HURB.Core.Interfaces.Repositories;

namespace HURB.Application.Services
{
    public class CurrencyAppService : ICurrencyAppService
    {
        private readonly ICurrencyRepository _repository;
        private readonly IMapper _mapper;

        public CurrencyAppService(ICurrencyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public Task AddAsync(AddCurrencyRequest model)
        {
            throw new NotImplementedException();
        }

        public async Task<ICollection<GetCurrencyResponse>> GetAllAsync()
        {
            var results = await _repository.FilterAsNoTrackingAsync();
            return _mapper.Map<ICollection<GetCurrencyResponse>>(results.OrderBy(x => x.ISOCurrencySymbol).ToList());
        }

        public async Task<GetCurrencyResponse> GetByIdAsync(Guid id)
        {
            var result = await _repository.GetByIdAsync(id);
            return _mapper.Map<GetCurrencyResponse>(result);
        }

        public Task<UpdateCurrencyRequest> UpdateAsync(UpdateCurrencyRequest model)
        {
            throw new NotImplementedException();
        }
    }
}
