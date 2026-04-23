using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Microsoft.EntityFrameworkCore;

namespace Bug_Bounty_Platform.DataAccess.Context
{
    public class BugReportContext : DbContext
    {
        public DbSet<BugReportData> BugReports { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
    }
}
