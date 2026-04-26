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

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RewardCritical { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RewardHigh { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RewardMedium { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RewardLow { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RewardInformational { get; set; }

        public int OwnerId { get; set; }

        public bool IsActive { get; set; }

        public bool IsHidden { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; }

        [DataType(DataType.Date)]
        public DateTime? UpdatedAt { get; set; }
    }
}
