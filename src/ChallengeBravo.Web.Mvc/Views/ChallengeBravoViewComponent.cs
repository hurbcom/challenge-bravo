using Abp.AspNetCore.Mvc.ViewComponents;

namespace ChallengeBravo.Web.Views
{
    public abstract class ChallengeBravoViewComponent : AbpViewComponent
    {
        protected ChallengeBravoViewComponent()
        {
            LocalizationSourceName = ChallengeBravoConsts.LocalizationSourceName;
        }
    }
}
