using System;

namespace Bug_Bounty_Platform.Domain.Entities.User
{
    public class ULoginData
    {
        public string Credential { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string LoginIp { get; set; } = string.Empty;
        public DateTime LoginDateTime { get; set; }
    }
}
