using System.ComponentModel.DataAnnotations;

namespace Bug_Bounty_Platform.Domain.Models.User
{
    public class CompanyApplyDto
    {
        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Handle { get; set; } = string.Empty;

        [Required]
        public string LegalName { get; set; } = string.Empty;

        [Required]
        public string DisplayName { get; set; } = string.Empty;

        [Required]
        public string LegalAddress { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        public string? PostalCode { get; set; }

        public string? Description { get; set; }
    }
}
