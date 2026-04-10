using Microsoft.AspNetCore.Mvc;
using Bug_Bounty_Platform.BusinessLogic;
using Bug_Bounty_Platform.Domain.Entities.User;
using System;

namespace Bug_Bounty_Platform.Web.Controllers
{
    public class UserLoginModel
    {
        public string Credential { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly Bug_Bounty_Platform.BusinessLogic.Interfaces.ISession _session;

        public LoginController()
        {
            var bl = new BussinesLogic();
            _session = bl.GetSessionBL();
        }

        // POST api/login
        [HttpPost]
        public IActionResult Login([FromBody] UserLoginModel login)
        {
            ULoginData data = new ULoginData
            {
                Credential = login.Credential,
                Password = login.Password,
                LoginIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "0.0.0.0",
                LoginDateTime = DateTime.Now
            };

            var result = _session.UserLogin(data);
            if (!result.Status)
                return Unauthorized(new { message = result.StatusMsg });

            return Ok(result);
        }
    }
}
