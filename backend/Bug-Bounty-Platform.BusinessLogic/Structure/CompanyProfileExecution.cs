using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class CompanyProfileExecution : CompanyProfileActions, ICompanyProfileAction
    {
        public CompanyProfileDto? GetProfileAction(int userId) => GetProfileExecution(userId);
        public ActionResponce CreateProfileAction(CompanyProfileDto dto) => CreateProfileExecution(dto);
        public ActionResponce UpdateProfileAction(CompanyProfileDto dto) => UpdateProfileExecution(dto);
        public ActionResponce VerifyCompanyAction(int userId) => VerifyCompanyExecution(userId);
        public ActionResponce RevokeVerificationAction(int userId) => RevokeVerificationExecution(userId);
        public bool IsVerifiedAction(int userId) => IsVerifiedExecution(userId);
    }
}
