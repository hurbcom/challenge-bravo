using CurrencyConverterAPI.Domain.Models;

namespace CurrencyConverterAPI.Repositories
{
    public interface ICoinRepository
    {
        Task<IEnumerable<Coin>> GetCoins();
        Task<IEnumerable<string>> GetAcronymCoins();
        Task<Coin> GetCoin(long id);
        Task<decimal> GetPriceCoinByAcronym(string acronym);
        Task<Coin> CreateCoin(Coin coin);
        Task<bool> UpdateCoin(Coin coin);
        Task<bool> DeleteCoin(long id);
        Task<bool> IsExistCoinById(long id);
        Task<bool> IsExistCoinByAcronym(string acronym);
        Task<long> GetNextId();
    }
}
