using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface ICompanyProfileAction
    {
        CompanyProfileDto? GetProfileAction(int userId);
        ActionResponce CreateProfileAction(CompanyProfileDto dto);
        ActionResponce UpdateProfileAction(CompanyProfileDto dto);
        ActionResponce VerifyCompanyAction(int userId);
        bool IsVerifiedAction(int userId);
    }
}
