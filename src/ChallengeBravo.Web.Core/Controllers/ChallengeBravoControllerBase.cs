using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace ChallengeBravo.Controllers
{
    public abstract class ChallengeBravoControllerBase: AbpController
    {
        protected ChallengeBravoControllerBase()
        {
            LocalizationSourceName = ChallengeBravoConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
