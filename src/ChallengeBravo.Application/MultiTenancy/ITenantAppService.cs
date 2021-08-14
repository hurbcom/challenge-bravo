using Abp.Application.Services;
using ChallengeBravo.MultiTenancy.Dto;

namespace ChallengeBravo.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

