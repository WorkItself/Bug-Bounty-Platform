using Microsoft.AspNetCore.Mvc;
using Bug_Bounty_Platform.BusinessLogic;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Entities.User;

namespace Bug_Bounty_Platform.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUser _userBL;

        public UserController()
        {
            var bl = new BussinesLogic();
            _userBL = bl.GetUserBL();
        }

        // GET api/user
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_userBL.GetAll());
        }

        // GET api/user/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _userBL.GetById(id);
            if (user == null)
                return NotFound(new { message = "User not found." });
            return Ok(user);
        }

        // POST api/user
        [HttpPost]
        public IActionResult Create([FromBody] UCreateData data)
        {
            var result = _userBL.Create(data);
            if (!result.Status)
                return BadRequest(new { message = result.StatusMsg });
            return Ok(result);
        }

        // PUT api/user/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UUpdateData data)
        {
            var result = _userBL.Update(id, data);
            if (!result.Status)
                return NotFound(new { message = result.StatusMsg });
            return Ok(result);
        }

        // DELETE api/user/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _userBL.Delete(id);
            if (!result.Status)
                return NotFound(new { message = result.StatusMsg });
            return Ok(result);
        }
    }
}
