using Abp.Application.Services.Dto;

namespace ChallengeBravo.Roles.Dto
{
    public class PagedRoleResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}

