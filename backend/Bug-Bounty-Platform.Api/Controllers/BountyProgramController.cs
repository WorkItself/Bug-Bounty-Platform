using Microsoft.AspNetCore.Mvc;
using Bug_Bounty_Platform.BusinessLogic;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Entities.BountyProgram;

namespace Bug_Bounty_Platform.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BountyProgramController : ControllerBase
    {
        private readonly IBountyProgram _bl;

        public BountyProgramController()
        {
            var bl = new BussinesLogic();
            _bl = bl.GetBountyProgramBL();
        }

        // GET api/bountyprogram
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_bl.GetAll());
        }

        // GET api/bountyprogram/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var program = _bl.GetById(id);
            if (program == null)
                return NotFound(new { message = "Program not found." });
            return Ok(program);
        }

        // POST api/bountyprogram
        [HttpPost]
        public IActionResult Create([FromBody] BPCreateData data)
        {
            var result = _bl.Create(data);
            if (!result.Status)
                return BadRequest(new { message = result.StatusMsg });
            return Ok(result);
        }

        // PUT api/bountyprogram/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] BPUpdateData data)
        {
            var result = _bl.Update(id, data);
            if (!result.Status)
                return NotFound(new { message = result.StatusMsg });
            return Ok(result);
        }

        // DELETE api/bountyprogram/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _bl.Delete(id);
            if (!result.Status)
                return NotFound(new { message = result.StatusMsg });
            return Ok(result);
        }
    }
}
