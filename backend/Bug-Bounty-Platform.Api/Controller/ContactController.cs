using Bug_Bounty_Platform.Domain.Models.Contact;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bug_Bounty_Platform.Api.Controller
{
    [Route("api/contact")]
    [ApiController]
    [AllowAnonymous]
    public class ContactController : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] ContactRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.LastName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Company))
            {
                return BadRequest(new ActionResponce
                {
                    IsSuccess = false,
                    Message = "First name, last name, email, and company are required."
                });
            }

            return Ok(new ActionResponce
            {
                IsSuccess = true,
                Message = "Your request has been submitted. Our team will contact you shortly."
            });
        }
    }
}
