using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace ChallengeBravo.Web.Views
{
    public abstract class ChallengeBravoRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected ChallengeBravoRazorPage()
        {
            LocalizationSourceName = ChallengeBravoConsts.LocalizationSourceName;
        }
    }
}
