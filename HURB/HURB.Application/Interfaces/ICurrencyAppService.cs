using HURB.Application.Model.Request.Currency;
using HURB.Application.Model.Response.Currency;

namespace HURB.Application.Interfaces
{
    public interface ICurrencyAppService
    {
        Task<ICollection<GetCurrencyResponse>> GetAllAsync();
        Task<GetCurrencyResponse> GetByIdAsync(Guid id);
        Task AddAsync(AddCurrencyRequest model);
        Task UpdateAsync(UpdateCurrencyRequest model);
        Task DeleteAsync(Guid id);
    }
}
