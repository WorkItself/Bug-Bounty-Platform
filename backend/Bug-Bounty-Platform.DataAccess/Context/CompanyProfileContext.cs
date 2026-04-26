using Bug_Bounty_Platform.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace Bug_Bounty_Platform.DataAccess.Context
{
    public class CompanyProfileContext : DbContext
    {
        public DbSet<CompanyProfile> CompanyProfiles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
    }
}
