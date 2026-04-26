using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bug_Bounty_Platform.Domain.Entities.BountyProgram
{
    public class BountyProgramData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string ProgramName { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ProgramDescription { get; set; }

        [StringLength(500)]
        public string? ProgramScope { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MinReward { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MaxReward { get; set; }

        public int OwnerId { get; set; }

        public bool IsActive { get; set; }

        public bool IsDeleted { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; }

        [DataType(DataType.Date)]
        public DateTime? UpdatedAt { get; set; }
    }
}
