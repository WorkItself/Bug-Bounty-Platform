using System;

namespace Bug_Bounty_Platform.Domain.Entities.User
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "user";
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
