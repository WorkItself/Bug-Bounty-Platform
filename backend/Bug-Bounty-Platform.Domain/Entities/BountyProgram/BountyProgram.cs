using System;

namespace Bug_Bounty_Platform.Domain.Entities.BountyProgram
{
    public class BountyProgram
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Scope { get; set; } = string.Empty;
        public decimal MinReward { get; set; }
        public decimal MaxReward { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int OwnerId { get; set; }
    }
}
