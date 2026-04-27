using Bug_Bounty_Platform.Domain.Entities.BountyProgram;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace Bug_Bounty_Platform.DataAccess.Context
{
    // Aggregated context used only at startup to create the full schema in one call.
    // Per-entity contexts (UserContext, BountyProgramContext, BugReportContext) stay as the
    // sole access points for CRUD so the BusinessLogic layer keeps its antohi-style separation.
    public class AppInitContext : DbContext
    {
        public DbSet<UserData> Users { get; set; }
        public DbSet<BountyProgramData> BountyPrograms { get; set; }
        public DbSet<BugReportData> BugReports { get; set; }
        public DbSet<BugReportComment> BugReportComments { get; set; }
        public DbSet<BugReportAttachment> BugReportAttachments { get; set; }
        public DbSet<CompanyProfile> CompanyProfiles { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CompanyProfile>()
                .HasIndex(p => p.Handle)
                .IsUnique();
        }
    }
}
