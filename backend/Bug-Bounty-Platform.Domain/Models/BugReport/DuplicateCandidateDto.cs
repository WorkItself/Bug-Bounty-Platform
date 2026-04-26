using Bug_Bounty_Platform.Domain.Entities.BugReport;

namespace Bug_Bounty_Platform.Domain.Models.BugReport
{
    public class DuplicateCandidateDto
    {
        public int ReportId { get; set; }
        public string Title { get; set; } = string.Empty;
        public BugStatus Status { get; set; }
        // 0–100 percentage
        public double ConfidenceScore { get; set; }
    }
}
