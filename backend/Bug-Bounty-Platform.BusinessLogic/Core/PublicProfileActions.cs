using Bug_Bounty_Platform.DataAccess.Context;
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

            int submissionCount;
            using (var bugDb = new BugReportContext())
                submissionCount = bugDb.BugReports.Count(r => r.ReporterId == user.Id && !r.IsHidden);

            return new
            {
                user.Id,
                user.UserName,
                user.FirstName,
                user.LastName,
                MemberSince = user.RegisteredOn,
                SubmissionCount = submissionCount,
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
    }
}
