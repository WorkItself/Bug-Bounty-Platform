using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/company")]
    [ApiController]
    public class CompanyApplyController : ControllerBase
    {
        private readonly ICompanyApplyAction _apply;

        public CompanyApplyController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _apply = bl.CompanyApplyAction();
        }

        [HttpPost("apply")]
        [AllowAnonymous]
        public IActionResult Apply([FromBody] CompanyApplyDto dto)
        {
            var result = _apply.ApplyAction(dto);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return StatusCode(201, new { message = result.Message });
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetPending()
        {
            return Ok(_apply.GetPendingAction());
        }

        [HttpPatch("approve/{userId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Approve(int userId)
        {
            var result = _apply.ApproveAction(userId);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpDelete("deny/{userId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Deny(int userId)
        {
            var result = _apply.DenyAction(userId);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
