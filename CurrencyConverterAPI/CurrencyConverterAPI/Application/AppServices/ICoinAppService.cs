using CurrencyConverterAPI.Domain.DTO;
using CurrencyConverterAPI.Domain.Models;

namespace CurrencyConverterAPI.Application.AppServices
{
    public interface ICoinAppService
    {
        Task<IEnumerable<Coin>> GetCoins();
        Task<Coin> GetCoin(long id);
        Task<Coin> CreateCoin(CoinInput coin);
        Task<bool> UpdateCoin(long id, CoinInput coinInput);
        Task<bool> DeleteCoin(long id);
        Task<bool> IsExistCoinById(long id);
        Task<bool> IsExistCoinByAcronym(string acronym);
    }
}
