using AutoMapper;
using HURB.Application.Interfaces;
using HURB.Application.Model.Request.Currency;
using HURB.Application.Model.Response.Currency;
using HURB.Core.Entities;
using HURB.Core.Interfaces.Repositories;
using HURB.Core.Interfaces.Services;

namespace HURB.Application.Services
{
    public class CurrencyAppService : ICurrencyAppService
    {
        private readonly ICurrencyService _service;
        private readonly ICurrencyRepository _repository;
        private readonly IMapper _mapper;

        public CurrencyAppService(ICurrencyService service, ICurrencyRepository repository, IMapper mapper)
        {
            _service = service;
            _repository = repository;
            _mapper = mapper;
        }

        public async Task AddAsync(AddCurrencyRequest model)
        {
            var currency = _mapper.Map<Currency>(model);
            await _service.AddAsync(currency);
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

        public async Task UpdateAsync(UpdateCurrencyRequest model)
        {
            var currency = _mapper.Map<Currency>(model);
            await _service.UpdateAsync(currency);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
            await _repository.CommitAsync();
        }
    }
}
