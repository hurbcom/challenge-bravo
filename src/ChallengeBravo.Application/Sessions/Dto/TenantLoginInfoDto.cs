using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ChallengeBravo.MultiTenancy;

namespace ChallengeBravo.Sessions.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    public class TenantLoginInfoDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }
    }
}
