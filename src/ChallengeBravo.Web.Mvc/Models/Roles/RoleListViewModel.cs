using System.Collections.Generic;
using ChallengeBravo.Roles.Dto;

namespace ChallengeBravo.Web.Models.Roles
{
    public class RoleListViewModel
    {
        public IReadOnlyList<PermissionDto> Permissions { get; set; }
    }
}
