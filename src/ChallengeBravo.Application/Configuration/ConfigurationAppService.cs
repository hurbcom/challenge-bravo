using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using ChallengeBravo.Configuration.Dto;

namespace ChallengeBravo.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : ChallengeBravoAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
