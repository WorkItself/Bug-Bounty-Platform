using System.Security.Claims;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/report")]
    [ApiController]
    [Authorize]
    public class BugReportController : ControllerBase
    {
        private IBugReportAction _report;
        public BugReportController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _report = bl.BugReportAction();
        }

        [HttpGet("my")]
        [Authorize(Roles = "User,Admin")]
        public IActionResult GetMine()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            if (claim == null || !int.TryParse(claim.Value, out var userId))
                return Unauthorized(new { message = "Invalid token." });
            return Ok(_report.GetByReporterAction(userId));
        }

        [HttpGet("program/{programId}")]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult GetByProgram(int programId)
        {
            return Ok(_report.GetByProgramAction(programId));
        }

        [HttpGet("getAll")]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult GetAll()
        {
            return Ok(_report.GetAllBugReportAction());
        }

        [HttpGet]
        [Authorize(Roles = "User,Company,Admin")]
        public IActionResult Get(int id)
        {
            var report = _report.GetBugReportByIdAction(id);
            if (report == null) return NotFound(new { message = "Report not found." });
            return Ok(report);
        }

        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public IActionResult Create([FromBody] BugReportDto data)
        {
            var result = _report.CreateBugReportAction(data);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return StatusCode(201, new { message = result.Message, id = result.Id });
        }

        [HttpPut]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Update([FromBody] BugReportDto data)
        {
            var result = _report.UpdateBugReportAction(data);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpDelete]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Delete(int id)
        {
            var result = _report.DeleteBugReportAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
