using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bug_Bounty_Platform.Domain.Entities.User
{
    public class UserData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(30)]
        public string? FirstName { get; set; }

        [StringLength(30)]
        public string? LastName { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 4)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [StringLength(60)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(64, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [StringLength(15)]
        public string? Phone { get; set; }

        public UserRole Role { get; set; }

        public bool IsApproved { get; set; } = true;

        [DataType(DataType.Date)]
        public DateTime RegisteredOn { get; set; }
    }
}
