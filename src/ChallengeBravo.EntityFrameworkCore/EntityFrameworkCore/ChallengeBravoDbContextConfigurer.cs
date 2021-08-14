using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace ChallengeBravo.EntityFrameworkCore
{
    public static class ChallengeBravoDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<ChallengeBravoDbContext> builder, string connectionString)
        {
            builder.UseNpgsql(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<ChallengeBravoDbContext> builder, DbConnection connection)
        {
            builder.UseNpgsql(connection);
        }
    }
}
