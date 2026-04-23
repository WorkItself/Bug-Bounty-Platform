namespace Bug_Bounty_Platform.Domain.Models.User
{
    public class UserLoginDto
    {
        public string Credential { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
