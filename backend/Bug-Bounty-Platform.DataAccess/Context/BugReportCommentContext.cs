using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Microsoft.EntityFrameworkCore;

namespace Bug_Bounty_Platform.DataAccess.Context
{
    public class BugReportCommentContext : DbContext
    {
        public DbSet<BugReportComment> BugReportComments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
