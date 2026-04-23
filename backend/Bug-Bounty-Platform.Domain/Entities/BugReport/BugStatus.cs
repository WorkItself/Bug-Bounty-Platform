namespace Bug_Bounty_Platform.Domain.Entities.BugReport
{
    public enum BugStatus
    {
        New = 1,
        Triaged = 2,
        Accepted = 3,
        Fixed = 4,
        Rewarded = 5,
        Rejected = 6
    }
}
