using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/program")]
    [ApiController]
    [Authorize]
    public class BountyProgramController : ControllerBase
    {
        private IBountyProgramAction _program;
        public BountyProgramController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _program = bl.BountyProgramAction();
        }

        [HttpGet("getAll")]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            var programs = _program.GetAllBountyProgramAction();
            return Ok(programs);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Get(int id)
        {
            var program = _program.GetBountyProgramByIdAction(id);
            return Ok(program);
        }

        [HttpPost]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Create([FromBody] BountyProgramDto data)
        {
            var responce = _program.CreateBountyProgramAction(data);
            return Ok(responce);
        }

        [HttpPut]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Update([FromBody] BountyProgramDto data)
        {
            var responce = _program.UpdateBountyProgramAction(data);
            return Ok(responce);
        }

        [HttpDelete]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Delete(int id)
        {
            var responce = _program.DeleteBountyProgramAction(id);
            return Ok(responce);
        }
    }
}
