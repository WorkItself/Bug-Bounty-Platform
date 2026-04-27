using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/comment")]
    [ApiController]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly IBugReportCommentAction _comments;

        public CommentController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _comments = bl.BugReportCommentAction();
        }

        [HttpGet("{bugReportId}")]
        [Authorize(Roles = "User,Company,Admin")]
        public IActionResult GetByReport(int bugReportId)
        {
            return Ok(_comments.GetCommentsByReportAction(bugReportId));
        }

        [HttpPost]
        [Authorize(Roles = "User,Company,Admin")]
        public IActionResult Add([FromBody] BugReportCommentDto data)
        {
            var result = _comments.AddCommentAction(data);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return Ok(result);
        }

        [HttpDelete("{commentId}")]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Delete(int commentId)
        {
            var result = _comments.DeleteCommentAction(commentId);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return Ok(result);
        }
    }
}
