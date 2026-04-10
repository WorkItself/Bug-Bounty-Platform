using Bug_Bounty_Platform.Domain.Entities;
using Bug_Bounty_Platform.Domain.Entities.Contact;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        // POST api/contact
        [HttpPost]
        public IActionResult Post([FromBody] ContactRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.LastName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Company))
            {
                return BadRequest(new ActionResponse
                {
                    Status = false,
                    StatusMsg = "First name, last name, email, and company are required."
                });
            }

            // TODO: persist to database or send notification email
            return Ok(new ActionResponse
            {
                Status = true,
                StatusMsg = "Your request has been submitted. Our team will contact you shortly."
            });
        }
    }
}
