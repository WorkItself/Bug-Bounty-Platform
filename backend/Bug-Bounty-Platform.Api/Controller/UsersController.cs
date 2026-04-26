using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserListAction _userList;
        private readonly IUserProfileAction _userProfile;

        public UsersController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _userList = bl.UserListAction();
            _userProfile = bl.UserProfileAction();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            return Ok(_userList.GetAllUsersAction());
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetMe()
        {
            if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value, out var userId))
                return Unauthorized();

            var profile = _userProfile.GetMyProfile(userId);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpPut("me")]
        [Authorize]
        public IActionResult UpdateMe([FromBody] UserUpdateDto dto)
        {
            if (!int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value, out var userId))
                return Unauthorized();

            var (response, token) = _userProfile.UpdateMyProfile(userId, dto);
            if (!response.IsSuccess)
                return BadRequest(response);

            return Ok(new { isSuccess = true, message = response.Message, token });
        }
    }
}
