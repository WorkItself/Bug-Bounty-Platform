using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/users")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserListAction _userList;

        public UsersController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _userList = bl.UserListAction();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_userList.GetAllUsersAction());
        }
    }
}
