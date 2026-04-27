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
    public class RegisterController : ControllerBase
    {
        private readonly IUserRegAction _userReg;

        public RegisterController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _userReg = bl.UserRegAction();
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto uRegData)
        {
            var data = _userReg.UserRegDataValidation(uRegData);
            if (!data.IsSuccess)
                return BadRequest(new { message = data.Message });
            return StatusCode(201, new { message = data.Message });
        }
    }
}
