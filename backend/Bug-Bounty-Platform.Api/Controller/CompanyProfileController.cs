using System.Security.Claims;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/company")]
    [ApiController]
    [Authorize]
    public class CompanyProfileController : ControllerBase
    {
        private readonly ICompanyProfileAction _profile;

        public CompanyProfileController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _profile = bl.CompanyProfileAction();
        }

        [HttpGet("profile")]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult GetProfile()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Invalid token." });

            var profile = _profile.GetProfileAction(userId.Value);
            if (profile == null) return NotFound(new { message = "No company profile found." });
            return Ok(profile);
        }

        [HttpGet("profile/{userId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetProfileByUser(int userId)
        {
            var profile = _profile.GetProfileAction(userId);
            if (profile == null) return NotFound(new { message = "No company profile found." });
            return Ok(profile);
        }

        [HttpPost("profile")]
        [Authorize(Roles = "Company")]
        public IActionResult CreateProfile([FromBody] CompanyProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Invalid token." });

            dto.UserId = userId.Value;
            var result = _profile.CreateProfileAction(dto);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return StatusCode(201, new { message = result.Message });
        }

        [HttpPut("profile")]
        [Authorize(Roles = "Company")]
        public IActionResult UpdateProfile([FromBody] CompanyProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Invalid token." });

            dto.UserId = userId.Value;
            var result = _profile.UpdateProfileAction(dto);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpPatch("profile/{userId}/verify")]
        [Authorize(Roles = "Admin")]
        public IActionResult VerifyCompany(int userId)
        {
            var result = _profile.VerifyCompanyAction(userId);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpPatch("profile/{userId}/revoke")]
        [Authorize(Roles = "Admin")]
        public IActionResult RevokeVerification(int userId)
        {
            var result = _profile.RevokeVerificationAction(userId);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)
                        ?? User.FindFirst("sub");
            return claim != null && int.TryParse(claim.Value, out var id) ? id : null;
        }
    }
}
