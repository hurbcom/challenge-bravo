using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ChallengeBravo.Configuration;
using ChallengeBravo.Web;

namespace ChallengeBravo.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class ChallengeBravoDbContextFactory : IDesignTimeDbContextFactory<ChallengeBravoDbContext>
    {
        public ChallengeBravoDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<ChallengeBravoDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            ChallengeBravoDbContextConfigurer.Configure(builder, configuration.GetConnectionString(ChallengeBravoConsts.ConnectionStringName));

            return new ChallengeBravoDbContext(builder.Options);
        }
    }
}
