using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/auth")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IUserLoginAction _login;
        private readonly IUserRegAction _register;

        public AuthController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _login    = bl.UserLoginAction();
            _register = bl.UserRegAction();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto udata)
        {
            var data = _login.UserLoginDataValidation(udata);
            if (data == null)
                return Unauthorized("Invalid credentials");
            if (data.ToString() == "PENDING_APPROVAL")
                return Unauthorized("Your application is pending admin approval.");
            return Ok(new { token = data, message = "Login successful" });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto uRegData)
        {
            var data = _register.UserRegDataValidation(uRegData);
            if (!data.IsSuccess)
                return BadRequest(new { message = data.Message });
            return StatusCode(201, new { message = data.Message });
        }
    }
}
