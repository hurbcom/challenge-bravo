using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ChallengeBravo.Configuration;

namespace ChallengeBravo.Web.Host.Startup
{
    [DependsOn(
       typeof(ChallengeBravoWebCoreModule))]
    public class ChallengeBravoWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public ChallengeBravoWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ChallengeBravoWebHostModule).GetAssembly());
        }
    }
}
