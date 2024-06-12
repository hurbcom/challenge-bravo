using AutoMapper;
using CurrencyConverter.Api.Data;
using CurrencyConverter.Api.Helpers;
using CurrencyConverter.Api.Models;

namespace CurrencyConverter.Api.Services
{
    public class CurrencyService: ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;
        private readonly IFiatConvertService _fiatConvertService;
        private readonly IBitCoinConvertService _bitcoinConvertService;
        private readonly IFictionCurrencyService _fictionCurrencyService;
        private readonly IMapper _mapper;

        public CurrencyService(ICurrencyRepository currencyRepository,
            IBitCoinConvertService bitcoinConvertService,
            IFiatConvertService fiatConvertService,
            IFictionCurrencyService fictionCurrencyService,
            IMapper mapper)
        {
            _fiatConvertService = fiatConvertService;
            _bitcoinConvertService = bitcoinConvertService;
            _fictionCurrencyService = fictionCurrencyService;
            _currencyRepository = currencyRepository;
            _mapper = mapper;
        }

        public async Task<double> ConvertCurrency(string from, string to, double amount)
        {
            var fictionsCurrencies = await _fictionCurrencyService.GetFictionsCurrencies(new List<string> { from, to });

            if (CheckCurrencyType.IsBitCoinCurrency(from) || CheckCurrencyType.IsBitCoinCurrency(to))
            {
                return await _bitcoinConvertService.ConvertBitCoin(from, to, amount, fictionsCurrencies);
            }

            if (fictionsCurrencies != null && fictionsCurrencies.Count > 0)
            {
                return await _fictionCurrencyService.ConvertFictionCurrency(from, to, amount, fictionsCurrencies);
            }

            return _fiatConvertService.ConvertFiatToFiat(from, to, amount);
        }

        public async Task<List<CurrencyViewModel>> GetAsync()
        {
           var currenciesModel = await _currencyRepository.GetAsync();
            return _mapper.Map<List<CurrencyViewModel>>(currenciesModel);
        }
       
        public async Task<CurrencyViewModel?> GetAsync(string id)
        {
            var currencyModel = await _currencyRepository.GetAsync(id);
            return _mapper.Map<CurrencyViewModel>(currencyModel);
        }

        public async Task<List<CurrencyViewModel>> GetByCodesAsync(List<string> codes)
        {
            var currencyModel = await _currencyRepository.GetByCodes(codes);
            return _mapper.Map<List<CurrencyViewModel>>(currencyModel);
        }

        public async Task<Currency> CreateAsync(CurrencyViewModel newCurrency)
        {
            var currencyModel = _mapper.Map<Currency>(newCurrency);
            return await _currencyRepository.CreateAsync(currencyModel);
        }
            
        public async Task UpdateAsync(string id, CurrencyViewModel updatedCurrency)
        {
            var updateCurrencyModel = _mapper.Map<Currency>(updatedCurrency);
            await _currencyRepository.UpdateAsync(id, updateCurrencyModel);
        }
          
        public async Task RemoveAsync(string code) =>
            await _currencyRepository.RemoveAsync(code);
    }
}
