using System.Security.Claims;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/program")]
    [ApiController]
    [Authorize]
    public class BountyProgramController : ControllerBase
    {
        private readonly IBountyProgramAction _program;
        private readonly ICompanyProfileAction _companyProfile;

        public BountyProgramController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _program = bl.BountyProgramAction();
            _companyProfile = bl.CompanyProfileAction();
        }

        [HttpGet("getAll")]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            return Ok(_program.GetAllBountyProgramAction());
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get(int id)
        {
            var program = _program.GetBountyProgramByIdAction(id);
            if (program == null) return NotFound(new { message = "Program not found." });
            return Ok(program);
        }

        [HttpPost]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Create([FromBody] BountyProgramDto data)
        {
            if (!IsAdminOrVerified()) return Forbid();
            var result = _program.CreateBountyProgramAction(data);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return StatusCode(201, new { message = result.Message });
        }

        [HttpPut]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Update([FromBody] BountyProgramDto data)
        {
            if (!IsAdminOrVerified()) return Forbid();
            var result = _program.UpdateBountyProgramAction(data);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpDelete]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Delete(int id)
        {
            if (!IsAdminOrVerified()) return Forbid();
            var result = _program.DeleteBountyProgramAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }

        private bool IsAdminOrVerified()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Admin") return true;

            var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            return claim != null && int.TryParse(claim.Value, out var id) && _companyProfile.IsVerifiedAction(id);
        }
    }
}
