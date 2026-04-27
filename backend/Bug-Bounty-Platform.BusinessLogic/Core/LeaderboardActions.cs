using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Entities.User;
using Bug_Bounty_Platform.Domain.Models.BugReport;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class LeaderboardActions
    {
        private static readonly BugStatus[] AcceptedStatuses =
            { BugStatus.Accepted, BugStatus.Fixed, BugStatus.Rewarded };

        public LeaderboardResultDto GetLeaderboard(string sort, int page, int pageSize)
        {
            page     = Math.Max(1, page);
            pageSize = Math.Clamp(pageSize, 1, 50);

            using var db = new AppInitContext();

            var hackers = db.Users
                .Where(u => u.Role == UserRole.User)
                .Select(u => new { u.Id, u.UserName })
                .ToList();

            var reports = db.BugReports
                .Select(r => new { r.ReporterId, r.Severity, r.Status })
                .ToList();

            var entries = hackers
                .Select(u =>
                {
                    var mine = reports.Where(r => r.ReporterId == u.Id).ToList();
                    return new LeaderboardEntryDto
                    {
                        UserName       = u.UserName,
                        TotalSubmitted = mine.Count,
                        TotalAccepted  = mine.Count(r => AcceptedStatuses.Contains(r.Status)),
                        TotalCritical  = mine.Count(r => r.Severity == BugSeverity.Critical
                                                      && AcceptedStatuses.Contains(r.Status)),
                    };
                })
                .Where(e => e.TotalSubmitted > 0);

            IEnumerable<LeaderboardEntryDto> ordered = sort switch
            {
                "accepted" => entries.OrderByDescending(e => e.TotalAccepted).ThenByDescending(e => e.TotalSubmitted),
                "critical" => entries.OrderByDescending(e => e.TotalCritical).ThenByDescending(e => e.TotalAccepted),
                _          => entries.OrderByDescending(e => e.TotalSubmitted).ThenByDescending(e => e.TotalAccepted),
            };

            var all   = ordered.ToList();
            int total = all.Count;

            var paged = all
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select((e, i) =>
                {
                    e.Rank = (page - 1) * pageSize + i + 1;
                    return e;
                })
                .ToList();

            return new LeaderboardResultDto
            {
                Entries    = paged,
                TotalCount = total,
                Page       = page,
                PageSize   = pageSize,
            };
        }
    }
}
