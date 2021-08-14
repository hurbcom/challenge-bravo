using System.Collections.Generic;
using ChallengeBravo.Roles.Dto;

namespace ChallengeBravo.Web.Models.Users
{
    public class UserListViewModel
    {
        public IReadOnlyList<RoleDto> Roles { get; set; }
    }
}
