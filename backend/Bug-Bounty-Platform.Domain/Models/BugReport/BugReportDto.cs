using Bug_Bounty_Platform.Domain.Entities.BugReport;

namespace Bug_Bounty_Platform.Domain.Models.BugReport
{
    public class BugReportDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public BugSeverity Severity { get; set; }
        public BugStatus Status { get; set; }
        public int ProgramId { get; set; }
        public int ReporterId { get; set; }
    }
}
