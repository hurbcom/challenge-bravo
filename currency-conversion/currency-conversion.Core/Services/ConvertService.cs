using currency_conversion.Core.Interfaces.Repositories;
using currency_conversion.Core.Interfaces.Services;

namespace currency_conversion.Core.Services
{
    public class ConvertService : IConvertService
    {
        private readonly ICurrencyRepository _currencyRepository;
        public ConvertService(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }
        public double Convert(string from, string to, double amount)
        {
            var fromRate = _currencyRepository.Read(from).Rate;
            var toRate = _currencyRepository.Read(to).Rate;
            return amount * (fromRate / toRate);
        }
    }
}
