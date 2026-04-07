namespace Bug_Bounty_Platform.Domain.Entities.BugReport
{
    public class BRCreateData
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = "Low";
        public int ProgramId { get; set; }
        public int ReporterId { get; set; }
    }
}
