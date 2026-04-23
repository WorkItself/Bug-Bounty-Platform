using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bug_Bounty_Platform.Domain.Entities.BugReport
{
    public class BugReportComment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int BugReportId { get; set; }

        [Required]
        public int AuthorId { get; set; }

        [Required]
        [StringLength(2000)]
        public string Content { get; set; }

        public bool IsInternal { get; set; }

        public bool IsDeleted { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; }

        [DataType(DataType.Date)]
        public DateTime? UpdatedAt { get; set; }
    }
}
