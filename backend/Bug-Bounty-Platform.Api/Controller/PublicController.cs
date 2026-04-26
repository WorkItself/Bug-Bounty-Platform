using Bug_Bounty_Platform.BusinessLogic.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/public")]
    [ApiController]
    [AllowAnonymous]
    public class PublicController : ControllerBase
    {
        private readonly PublicProfileActions _actions = new();

        [HttpGet("hacker/{username}")]
        public IActionResult GetHackerProfile(string username)
        {
            var result = _actions.GetPublicHackerProfile(username);
            if (result == null) return NotFound(new { message = "User not found." });
            return Ok(result);
        }

        [HttpGet("company/{handle}")]
        public IActionResult GetCompanyPage(string handle)
        {
            var result = _actions.GetPublicCompanyPage(handle);
            if (result == null) return NotFound(new { message = "Company not found." });
            return Ok(result);
        }
    }
}
