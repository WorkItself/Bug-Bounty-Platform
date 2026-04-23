using Bug_Bounty_Platform.BusinessLogic.Structure;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/upload")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly FileUploadService _service;

        public FileUploadController(IWebHostEnvironment env)
        {
            _service = new FileUploadService(env.ContentRootPath);
        }

        // POST api/upload/{bugReportId}
        [HttpPost("{bugReportId}")]
        public async Task<IActionResult> Upload(int bugReportId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided." });

            var (result, attachment) = await _service.UploadAsync(
                bugReportId,
                file.OpenReadStream(),
                file.FileName,
                file.ContentType,
                file.Length);

            if (!result.IsSuccess)
                return BadRequest(new { message = result.Message });
            return Ok(attachment);
        }

        // GET api/upload/{bugReportId}
        [HttpGet("{bugReportId}")]
        public IActionResult GetAttachments(int bugReportId)
        {
            var attachments = _service.GetAttachmentsForReport(bugReportId);
            return Ok(attachments);
        }

        // DELETE api/upload/{attachmentId}
        [HttpDelete("{attachmentId}")]
        public IActionResult Delete(int attachmentId)
        {
            var result = _service.DeleteAttachment(attachmentId);
            if (!result.IsSuccess)
                return NotFound(new { message = result.Message });
            return Ok(new { message = result.Message });
        }
    }
}
