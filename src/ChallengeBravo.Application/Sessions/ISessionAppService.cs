using System.Threading.Tasks;
using Abp.Application.Services;
using ChallengeBravo.Sessions.Dto;

namespace ChallengeBravo.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
