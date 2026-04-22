using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/program")]
    [ApiController]
    public class BountyProgramController : ControllerBase
    {
        private IBountyProgramAction _program;
        public BountyProgramController()
        {
            var bl = new BusinessLogic.BusinessLogic();
            _program = bl.BountyProgramAction();
        }

        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var programs = _program.GetAllBountyProgramAction();
            return Ok(programs);
        }

        [HttpGet]
        public IActionResult Get(int id)
        {
            var program = _program.GetBountyProgramByIdAction(id);
            return Ok(program);
        }

        [HttpPost]
        public IActionResult Create([FromBody] BountyProgramDto data)
        {
            var responce = _program.CreateBountyProgramAction(data);
            return Ok(responce);
        }

        [HttpPut]
        public IActionResult Update([FromBody] BountyProgramDto data)
        {
            var responce = _program.UpdateBountyProgramAction(data);
            return Ok(responce);
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var responce = _program.DeleteBountyProgramAction(id);
            return Ok(responce);
        }
    }
}
