using Bug_Bounty_Platform.DataAccess.Context;
using Bug_Bounty_Platform.Domain.Entities.BugReport;
using Bug_Bounty_Platform.Domain.Entities.User;

namespace Bug_Bounty_Platform.BusinessLogic.Core
{
    public class PublicProfileActions
    {
        public object? GetPublicHackerProfile(string username)
        {
            using var userDb = new UserContext();
            var user = userDb.Users.FirstOrDefault(u =>
                u.UserName == username && u.Role == UserRole.User);

            if (user == null) return null;

            List<BugReportData> userReports;
            using (var bugDb = new BugReportContext())
                userReports = bugDb.BugReports
                    .Where(r => r.ReporterId == user.Id && !r.IsHidden)
                    .Select(r => new BugReportData { Severity = r.Severity, Status = r.Status })
                    .ToList();

            var acceptedStatuses = new[] { BugStatus.Accepted, BugStatus.Fixed, BugStatus.Rewarded };

            return new
            {
                user.Id,
                user.UserName,
                user.FirstName,
                user.LastName,
                MemberSince     = user.RegisteredOn,
                SubmissionCount = userReports.Count,
                AcceptedCount   = userReports.Count(r => acceptedStatuses.Contains(r.Status)),
                CriticalCount   = userReports.Count(r => r.Severity == BugSeverity.Critical
                                                      && acceptedStatuses.Contains(r.Status)),
            };
        }

        public object? GetPublicCompanyPage(string handle)
        {
            CompanyProfile? profile;
            using (var profileDb = new CompanyProfileContext())
                profile = profileDb.CompanyProfiles.FirstOrDefault(p => p.Handle == handle);

            if (profile == null) return null;

            using var userDb = new UserContext();
            var company = userDb.Users.FirstOrDefault(u => u.Id == profile.UserId && u.IsApproved);
            if (company == null) return null;

            List<object> programs;
            using (var bpDb = new BountyProgramContext())
            {
                programs = bpDb.BountyPrograms
                    .Where(p => p.OwnerId == company.Id && p.IsActive && !p.IsHidden)
                    .Select(p => (object)new
                    {
                        p.Id, p.ProgramName, p.ProgramDescription, p.ProgramScope, p.Website,
                        p.RewardCritical, p.RewardHigh, p.RewardMedium, p.RewardLow, p.RewardInformational,
                        p.CreatedAt,
                    })
                    .ToList();
            }

            return new
            {
                profile.Handle,
                profile.DisplayName,
                profile.LegalName,
                profile.Description,
                profile.IsVerified,
                profile.CreatedAt,
                Programs = programs,
            };
        }

        public List<object> GetActivityFeed()
        {
            List<BugReportData> resolved;
            using (var bugDb = new BugReportContext())
            {
                resolved = bugDb.BugReports
                    .Where(r => !r.IsHidden && (int)r.Status == 3)
                    .OrderByDescending(r => r.UpdatedAt ?? r.SubmittedAt)
                    .ToList();
            }

            if (resolved.Count == 0) return new List<object>();

            var reporterIds = resolved.Select(r => r.ReporterId).Distinct().ToList();
            var programIds  = resolved.Select(r => r.ProgramId).Distinct().ToList();

            Dictionary<int, string> reporterNames;
            using (var userDb = new UserContext())
            {
                reporterNames = userDb.Users
                    .Where(u => reporterIds.Contains(u.Id))
                    .ToDictionary(u => u.Id, u => u.UserName);
            }

            Dictionary<int, string> programNames;
            using (var bpDb = new BountyProgramContext())
            {
                programNames = bpDb.BountyPrograms
                    .Where(p => programIds.Contains(p.Id))
                    .ToDictionary(p => p.Id, p => p.ProgramName);
            }

            return resolved.Select(r => (object)new
            {
                r.Id,
                r.Title,
                Description = r.IsPublic ? r.Description : null,
                r.Severity,
                r.Status,
                r.ProgramId,
                ProgramName = programNames.GetValueOrDefault(r.ProgramId, $"#{r.ProgramId}"),
                r.ReporterId,
                ReporterName = reporterNames.GetValueOrDefault(r.ReporterId, $"#{r.ReporterId}"),
                r.IsPublic,
                ResolvedAt = r.UpdatedAt ?? r.SubmittedAt,
            }).ToList();
        }
    }
}
