namespace Bug_Bounty_Platform.Domain.Entities.BountyProgram
{
    public class BPUpdateData
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Scope { get; set; }
        public decimal? MinReward { get; set; }
        public decimal? MaxReward { get; set; }
        public bool? IsActive { get; set; }
    }
}
