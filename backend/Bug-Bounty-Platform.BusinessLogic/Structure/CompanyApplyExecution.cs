using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class CompanyApplyExecution : CompanyApplyActions, ICompanyApplyAction
    {
        public ActionResponce ApplyAction(CompanyApplyDto dto) => ApplyExecution(dto);
        public List<object> GetPendingAction() => GetPendingExecution();
        public ActionResponce ApproveAction(int userId) => ApproveExecution(userId);
    }
}
