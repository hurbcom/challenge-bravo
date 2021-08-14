using Abp.Authorization;
using ChallengeBravo.Authorization.Roles;
using ChallengeBravo.Authorization.Users;

namespace ChallengeBravo.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
