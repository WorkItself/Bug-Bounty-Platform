namespace Bug_Bounty_Platform.Domain.Models.User
{
    public class CompanyProfileDto
    {
        public int UserId { get; set; }
        public string LegalName { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string LegalAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? PostalCode { get; set; }
        public string? TaxId { get; set; }
        public string? Website { get; set; }
        public string? Description { get; set; }
        public bool IsVerified { get; set; }
    }
}
