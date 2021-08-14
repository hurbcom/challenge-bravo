using System.Threading.Tasks;
using Abp.Application.Services;
using ChallengeBravo.Authorization.Accounts.Dto;

namespace ChallengeBravo.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
