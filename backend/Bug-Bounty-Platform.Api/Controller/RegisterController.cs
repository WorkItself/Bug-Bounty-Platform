using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/reg")]
    [ApiController]
    [AllowAnonymous]
    public class RegisterController : ControllerBase
    {
        internal IUserRegAction _userReg;
        public RegisterController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _userReg = bl.UserRegAction();
        }

        [HttpPost]
        public IActionResult Register([FromBody] UserRegisterDto uRegData)
        {
            var data = _userReg.UserRegDataValidation(uRegData);
            if (data.IsSuccess)
            {
                return Ok(data.Message);
            }

            return Ok(data.Message);
        }
    }
}
