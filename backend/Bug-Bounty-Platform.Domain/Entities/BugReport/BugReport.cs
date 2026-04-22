using System;

namespace Bug_Bounty_Platform.Domain.Entities.BugReport
{
    public class BugReport
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = "Low"; // Low, Medium, High, Critical
        public string Status { get; set; } = "Pending"; // Pending, Triaged, Resolved, Rejected
        public int ProgramId { get; set; }
        public int ReporterId { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
