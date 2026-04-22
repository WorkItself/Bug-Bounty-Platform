using Microsoft.AspNetCore.Mvc;
using Bug_Bounty_Platform.BusinessLogic;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Entities.BugReport;

namespace Bug_Bounty_Platform.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BugReportController : ControllerBase
    {
        private readonly IBugReport _bl;

        public BugReportController()
        {
            var bl = new BussinesLogic();
            _bl = bl.GetBugReportBL();
        }

        // GET api/bugreport
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_bl.GetAll());
        }

        // GET api/bugreport/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var report = _bl.GetById(id);
            if (report == null)
                return NotFound(new { message = "Report not found." });
            return Ok(report);
        }

        // POST api/bugreport
        [HttpPost]
        public IActionResult Create([FromBody] BRCreateData data)
        {
            var result = _bl.Create(data);
            if (!result.Status)
                return BadRequest(new { message = result.StatusMsg });
            return Ok(result);
        }

        // PUT api/bugreport/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] BRUpdateData data)
        {
            var result = _bl.Update(id, data);
            if (!result.Status)
                return NotFound(new { message = result.StatusMsg });
            return Ok(result);
        }

        // DELETE api/bugreport/5
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
