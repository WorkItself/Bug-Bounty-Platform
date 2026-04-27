using Bug_Bounty_Platform.BusinessLogic.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/leaderboard")]
    [ApiController]
    [AllowAnonymous]
    public class LeaderboardController : ControllerBase
    {
        private readonly LeaderboardActions _actions = new();

        [HttpGet]
        public IActionResult Get(
            [FromQuery] string sort = "submitted",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = _actions.GetLeaderboard(sort, page, pageSize);
            return Ok(result);
        }
    }
}
