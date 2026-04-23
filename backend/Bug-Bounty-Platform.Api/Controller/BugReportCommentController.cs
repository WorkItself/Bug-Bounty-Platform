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
    public class BugReportCommentController : ControllerBase
    {
        private readonly IBugReportCommentAction _comments;

        public BugReportCommentController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _comments = bl.BugReportCommentAction();
        }

        // GET api/comment/{bugReportId}
        [HttpGet("{bugReportId}")]
        [Authorize(Roles = "User,Company,Admin")]
        public IActionResult GetByReport(int bugReportId)
        {
            var comments = _comments.GetCommentsByReportAction(bugReportId);
            return Ok(comments);
        }

        // POST api/comment
        [HttpPost]
        [Authorize(Roles = "User,Company,Admin")]
        public IActionResult Add([FromBody] BugReportCommentDto data)
        {
            var result = _comments.AddCommentAction(data);
            if (!result.IsSuccess)
                return BadRequest(new { message = result.Message });
            return Ok(result);
        }

        // DELETE api/comment/{commentId}
        [HttpDelete("{commentId}")]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Delete(int commentId)
        {
            var result = _comments.DeleteCommentAction(commentId);
            if (!result.IsSuccess)
                return NotFound(new { message = result.Message });
            return Ok(result);
        }
    }
}
