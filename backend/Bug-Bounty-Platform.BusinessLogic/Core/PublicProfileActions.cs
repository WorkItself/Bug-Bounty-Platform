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
                    .ToList();

            var acceptedStatuses = new[] { BugStatus.Accepted, BugStatus.Fixed, BugStatus.Rewarded };

            var recentReportData = userReports
                .Where(r => acceptedStatuses.Contains(r.Status))
                .OrderByDescending(r => r.UpdatedAt ?? r.SubmittedAt)
                .Take(8)
                .ToList();

            var programIds = recentReportData.Select(r => r.ProgramId).Distinct().ToList();
            Dictionary<int, string> programNames;
            using (var bpDb = new BountyProgramContext())
                programNames = bpDb.BountyPrograms
                    .Where(p => programIds.Contains(p.Id))
                    .ToDictionary(p => p.Id, p => p.ProgramName);

            var recentReports = recentReportData.Select(r => new
            {
                r.Id,
                r.Title,
                r.Severity,
                r.Status,
                r.IsPublic,
                r.ProgramId,
                ProgramName = programNames.GetValueOrDefault(r.ProgramId, $"#{r.ProgramId}"),
                ResolvedAt  = r.UpdatedAt ?? r.SubmittedAt,
            }).ToList<object>();

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
                RecentReports   = recentReports,
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
                    .Where(r => !r.IsHidden && r.Status != BugStatus.New && r.Status != BugStatus.Triaged)
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
            Dictionary<int, int>    programOwnerIds;
            using (var bpDb = new BountyProgramContext())
            {
                var programs = bpDb.BountyPrograms
                    .Where(p => programIds.Contains(p.Id))
                    .Select(p => new { p.Id, p.ProgramName, p.OwnerId })
                    .ToList();
                programNames    = programs.ToDictionary(p => p.Id, p => p.ProgramName);
                programOwnerIds = programs.ToDictionary(p => p.Id, p => p.OwnerId);
            }

            var ownerIds = programOwnerIds.Values.Distinct().ToList();
            Dictionary<int, string> ownerHandles;
            using (var profileDb = new CompanyProfileContext())
            {
                ownerHandles = profileDb.CompanyProfiles
                    .Where(cp => ownerIds.Contains(cp.UserId))
                    .ToDictionary(cp => cp.UserId, cp => cp.Handle);
            }

            return resolved.Select(r =>
            {
                var ownerId = programOwnerIds.GetValueOrDefault(r.ProgramId);
                return (object)new
                {
                    r.Id,
                    r.Title,
                    Description    = r.IsPublic ? r.Description : null,
                    r.Severity,
                    r.Status,
                    r.ProgramId,
                    ProgramName    = programNames.GetValueOrDefault(r.ProgramId, $"#{r.ProgramId}"),
                    ProgramHandle  = ownerId != 0 ? ownerHandles.GetValueOrDefault(ownerId) : null,
                    r.ReporterId,
                    ReporterName   = reporterNames.GetValueOrDefault(r.ReporterId, $"#{r.ReporterId}"),
                    r.IsPublic,
                    ResolvedAt     = r.UpdatedAt ?? r.SubmittedAt,
                };
            }).ToList();
        }
    }
}
