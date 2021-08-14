using System.Threading.Tasks;
using ChallengeBravo.Configuration.Dto;

namespace ChallengeBravo.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
