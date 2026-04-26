namespace Bug_Bounty_Platform.Domain.Models.BugReport
{
    public class BugReportCommentDto
    {
        public int Id { get; set; }
        public int BugReportId { get; set; }
        public int AuthorId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsInternal { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
