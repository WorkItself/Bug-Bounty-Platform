namespace Bug_Bounty_Platform.Domain.Models.Contact
{
    public class ContactRequestDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Company { get; set; }
        public string JobTitle { get; set; }
        public string SecurityObjective { get; set; }
        public string Country { get; set; }
        public string Message { get; set; }
    }
}
