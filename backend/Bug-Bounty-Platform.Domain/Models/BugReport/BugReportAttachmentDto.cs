namespace Bug_Bounty_Platform.Domain.Models.BugReport
{
    public class BugReportAttachmentDto
    {
        public int Id { get; set; }
        public int BugReportId { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public long FileSizeBytes { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
