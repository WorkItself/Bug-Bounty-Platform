namespace Bug_Bounty_Platform.Domain.Models.BountyProgram
{
    public class BountyProgramDto
    {
        public int Id { get; set; }
        public string ProgramName { get; set; } = string.Empty;
        public string? ProgramDescription { get; set; }
        public string? ProgramScope { get; set; }
        public decimal MinReward { get; set; }
        public decimal MaxReward { get; set; }
        public int OwnerId { get; set; }
        public bool IsActive { get; set; }
    }
}
