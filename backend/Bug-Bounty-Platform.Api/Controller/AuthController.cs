using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/session")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        internal IUserLoginAction _userAction;
        public AuthController()
        {
            var bl = new BusinessLogic.BusinessLogic();
            _userAction = bl.UserLoginAction();
        }

        [HttpPost("auth")]
        public IActionResult Auth([FromBody] UserLoginDto udata)
        {
            var data = _userAction.UserLoginDataValidation(udata);
            if (data == null)
            {
                return Unauthorized("Invalid credentials");
            }
            return Ok(new { token = data, message = "Login successful" });
        }
    }
}
