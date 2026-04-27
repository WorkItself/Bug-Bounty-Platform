namespace Bug_Bounty_Platform.Domain.Models.BountyProgram
{
    public class BountyProgramDto
    {
        public int Id { get; set; }
        public string ProgramName { get; set; } = string.Empty;
        public string? ProgramDescription { get; set; }
        public string? ProgramScope { get; set; }
        public string? Website { get; set; }
        public decimal? RewardCritical { get; set; }
        public decimal? RewardHigh { get; set; }
        public decimal? RewardMedium { get; set; }
        public decimal? RewardLow { get; set; }
        public decimal? RewardInformational { get; set; }
        public int OwnerId { get; set; }
        public bool IsActive { get; set; }
        public string? OwnerDisplayName { get; set; }
        public string? OwnerHandle { get; set; }
    }
}
