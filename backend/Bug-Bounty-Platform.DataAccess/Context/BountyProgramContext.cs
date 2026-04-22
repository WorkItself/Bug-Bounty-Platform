using Bug_Bounty_Platform.Domain.Entities.BountyProgram;
using Microsoft.EntityFrameworkCore;

namespace Bug_Bounty_Platform.DataAccess.Context
{
    public class BountyProgramContext : DbContext
    {
        public DbSet<BountyProgramData> BountyPrograms { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
