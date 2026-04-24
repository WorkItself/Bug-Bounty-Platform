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
            if (userId == null) return Unauthorized();

            var profile = _profile.GetProfileAction(userId.Value);
            if (profile == null) return NotFound("No company profile found.");
            return Ok(profile);
        }

        [HttpGet("profile/{userId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetProfileByUser(int userId)
        {
            var profile = _profile.GetProfileAction(userId);
            if (profile == null) return NotFound("No company profile found.");
            return Ok(profile);
        }

        [HttpPost("profile")]
        [Authorize(Roles = "Company")]
        public IActionResult CreateProfile([FromBody] CompanyProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            dto.UserId = userId.Value;
            var result = _profile.CreateProfileAction(dto);
            return Ok(result);
        }

        [HttpPut("profile")]
        [Authorize(Roles = "Company")]
        public IActionResult UpdateProfile([FromBody] CompanyProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            dto.UserId = userId.Value;
            var result = _profile.UpdateProfileAction(dto);
            return Ok(result);
        }

        [HttpPatch("profile/{userId}/verify")]
        [Authorize(Roles = "Admin")]
        public IActionResult VerifyCompany(int userId)
        {
            var result = _profile.VerifyCompanyAction(userId);
            return Ok(result);
        }

        private int? GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)
                        ?? User.FindFirst("sub");
            return claim != null && int.TryParse(claim.Value, out var id) ? id : null;
        }
    }
}
