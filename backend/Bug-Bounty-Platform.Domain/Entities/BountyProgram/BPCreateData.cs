namespace Bug_Bounty_Platform.Domain.Entities.BountyProgram
{
    public class BPCreateData
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Scope { get; set; } = string.Empty;
        public decimal MinReward { get; set; }
        public decimal MaxReward { get; set; }
        public int OwnerId { get; set; }
    }
}
