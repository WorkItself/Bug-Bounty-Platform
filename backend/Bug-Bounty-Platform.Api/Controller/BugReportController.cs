using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/report")]
    [ApiController]
    public class BugReportController : ControllerBase
    {
        private IBugReportAction _report;
        public BugReportController()
        {
            var bl = new BusinessLogic.BusinessLogic();
            _report = bl.BugReportAction();
        }

        [HttpGet("getAll")]
        public IActionResult GetAll()
        {
            var reports = _report.GetAllBugReportAction();
            return Ok(reports);
        }

        [HttpGet]
        public IActionResult Get(int id)
        {
            var report = _report.GetBugReportByIdAction(id);
            return Ok(report);
        }

        [HttpPost]
        public IActionResult Create([FromBody] BugReportDto data)
        {
            var responce = _report.CreateBugReportAction(data);
            return Ok(responce);
        }

        [HttpPut]
        public IActionResult Update([FromBody] BugReportDto data)
        {
            var responce = _report.UpdateBugReportAction(data);
            return Ok(responce);
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var responce = _report.DeleteBugReportAction(id);
            return Ok(responce);
        }
    }
}
