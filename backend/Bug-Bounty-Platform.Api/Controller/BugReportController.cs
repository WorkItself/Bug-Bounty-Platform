using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/report")]
    [ApiController]
    [Authorize]
    public class BugReportController : ControllerBase
    {
        private IBugReportAction _report;
        public BugReportController(IConfiguration configuration)
        {
            var bl = new BusinessLogic.BusinessLogic(configuration);
            _report = bl.BugReportAction();
        }

        [HttpGet("getAll")]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult GetAll()
        {
            var reports = _report.GetAllBugReportAction();
            return Ok(reports);
        }

        [HttpGet]
        [Authorize(Roles = "User,Company,Admin")]
        public IActionResult Get(int id)
        {
            var report = _report.GetBugReportByIdAction(id);
            return Ok(report);
        }

        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public IActionResult Create([FromBody] BugReportDto data)
        {
            var responce = _report.CreateBugReportAction(data);
            return Ok(responce);
        }

        [HttpPut]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Update([FromBody] BugReportDto data)
        {
            var responce = _report.UpdateBugReportAction(data);
            return Ok(responce);
        }

        [HttpDelete]
        [Authorize(Roles = "Company,Admin")]
        public IActionResult Delete(int id)
        {
            var responce = _report.DeleteBugReportAction(id);
            return Ok(responce);
        }
    }
}
