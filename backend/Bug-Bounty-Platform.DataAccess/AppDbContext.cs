using Bug_Bounty_Platform.Domain.Entities.User;
using Bug_Bounty_Platform.Domain.Entities.BountyProgram;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Microsoft.EntityFrameworkCore;

namespace Bug_Bounty_Platform.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<BountyProgram> BountyPrograms { get; set; }
        public DbSet<BugReport> BugReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Username).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Role).HasDefaultValue("user");
            });

            modelBuilder.Entity<BountyProgram>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Name).IsRequired().HasMaxLength(200);
                entity.Property(b => b.MinReward).HasColumnType("decimal(18,2)");
                entity.Property(b => b.MaxReward).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<BugReport>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Title).IsRequired().HasMaxLength(300);
                entity.Property(r => r.Severity).HasDefaultValue("Low");
                entity.Property(r => r.Status).HasDefaultValue("Pending");
            });
        }
    }
}
