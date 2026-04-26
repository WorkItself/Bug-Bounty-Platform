using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class FileUploadService
    {
        private static readonly HashSet<string> AllowedContentTypes = new()
        {
            "image/png", "image/jpeg", "image/gif", "image/webp",
            "application/pdf",
            "text/plain", "text/html",
            "video/mp4", "video/webm"
        };

        private const long MaxFileSizeBytes = 20 * 1024 * 1024; // 20 MB

        private readonly string _storageRoot;

        public FileUploadService(string storageRoot)
        {
            _storageRoot = storageRoot;
        }

        public async Task<(ActionResponce Result, BugReportAttachmentDto? Attachment)> UploadAsync(
            int bugReportId, Stream fileStream, string originalFileName, string contentType, long fileSize)
        {
            if (fileStream == null || fileSize == 0)
                return (Fail("No file provided."), null);

            if (fileSize > MaxFileSizeBytes)
                return (Fail($"File exceeds maximum allowed size of {MaxFileSizeBytes / 1024 / 1024} MB."), null);

            if (!AllowedContentTypes.Contains(contentType))
                return (Fail($"File type '{contentType}' is not allowed."), null);

            string safeFileName = SanitizeFileName(originalFileName);
            string reportFolder  = Path.Combine(_storageRoot, "uploads", bugReportId.ToString());
            Directory.CreateDirectory(reportFolder);

            // Prefix with timestamp to avoid collisions
            string storedName = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{safeFileName}";
            string fullPath   = Path.Combine(reportFolder, storedName);
            string storagePath = Path.Combine("uploads", bugReportId.ToString(), storedName);

            using (var dest = new FileStream(fullPath, FileMode.Create))
            {
                await fileStream.CopyToAsync(dest);
            }

            var entity = new BugReportAttachment
            {
                BugReportId   = bugReportId,
                FileName      = originalFileName,
                StoragePath   = storagePath,
                ContentType   = contentType,
                FileSizeBytes = fileSize,
                UploadedAt    = DateTime.UtcNow
            };

            using (var db = new BugReportAttachmentContext())
            {
                db.BugReportAttachments.Add(entity);
                db.SaveChanges();
            }

            var dto = new BugReportAttachmentDto
            {
                Id           = entity.Id,
                BugReportId  = entity.BugReportId,
                FileName     = entity.FileName,
                ContentType  = entity.ContentType,
                FileSizeBytes = entity.FileSizeBytes,
                UploadedAt   = entity.UploadedAt
            };

            return (new ActionResponce { IsSuccess = true, Message = "File uploaded." }, dto);
        }

        public List<BugReportAttachmentDto> GetAttachmentsForReport(int bugReportId)
        {
            using var db = new BugReportAttachmentContext();
            return db.BugReportAttachments
                .Where(x => x.BugReportId == bugReportId && !x.IsHidden)
                .Select(x => new BugReportAttachmentDto
                {
                    Id            = x.Id,
                    BugReportId   = x.BugReportId,
                    FileName      = x.FileName,
                    ContentType   = x.ContentType,
                    FileSizeBytes = x.FileSizeBytes,
                    UploadedAt    = x.UploadedAt
                })
                .ToList();
        }

        public ActionResponce DeleteAttachment(int attachmentId)
        {
            using var db = new BugReportAttachmentContext();
            var entity = db.BugReportAttachments.FirstOrDefault(x => x.Id == attachmentId);
            if (entity == null)
                return Fail("Attachment not found.");

            entity.IsHidden = true;
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Attachment removed." };
        }

        private static string SanitizeFileName(string fileName)
        {
            string name = Path.GetFileNameWithoutExtension(fileName);
            string ext  = Path.GetExtension(fileName);

            // Strip characters that are unsafe in file paths
            string safe = new string(name
                .Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_')
                .ToArray());

            return string.IsNullOrEmpty(safe) ? $"file{ext}" : $"{safe}{ext}";
        }

        private static ActionResponce Fail(string msg) =>
            new ActionResponce { IsSuccess = false, Message = msg };
    }
}
