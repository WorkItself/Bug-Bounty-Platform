namespace Bug_Bounty_Platform.Domain.Models.BugReport
{
    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int TotalSubmitted { get; set; }
        public int TotalAccepted { get; set; }
        public int TotalCritical { get; set; }
    }

    public class LeaderboardResultDto
    {
        public List<LeaderboardEntryDto> Entries { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
