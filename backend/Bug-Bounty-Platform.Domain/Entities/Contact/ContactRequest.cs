namespace Bug_Bounty_Platform.Domain.Entities.Contact
{
    public class ContactRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string SecurityObjective { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
