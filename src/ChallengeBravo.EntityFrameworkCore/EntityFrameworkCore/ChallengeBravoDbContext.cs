using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using ChallengeBravo.Authorization.Roles;
using ChallengeBravo.Authorization.Users;
using ChallengeBravo.MultiTenancy;
using Abp.Localization;
using ChallengeBravo.Moedas;

namespace ChallengeBravo.EntityFrameworkCore
{
    public class ChallengeBravoDbContext : AbpZeroDbContext<Tenant, Role, User, ChallengeBravoDbContext>
    {
        /* Define a DbSet for each entity of the application */

        public virtual DbSet<Moeda> Moeda { get; set; }


        public ChallengeBravoDbContext(DbContextOptions<ChallengeBravoDbContext> options)
            : base(options)
        {
           
        }

        // add these lines to override max length of property
        // we should set max length smaller than the PostgreSQL allowed size (10485760)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Moeda>().HasKey(e => new { e.Id });

            modelBuilder.Entity<ApplicationLanguageText>()
                .Property(p => p.Value)
                .HasMaxLength(100); // any integer that is smaller than 10485760
        }
    }
}
