using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface ICompanyApplyAction
    {
        ActionResponce ApplyAction(CompanyApplyDto dto);
        List<object> GetPendingAction();
        ActionResponce ApproveAction(int userId);
        ActionResponce DenyAction(int userId);
    }
}
