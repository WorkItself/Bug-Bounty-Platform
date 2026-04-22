using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class BugReportExecution : BugReportActions, IBugReportAction
    {
        public ActionResponce CreateBugReportAction(BugReportDto data)
        {
            return CreateBugReportActionExecution(data);
        }

        public ActionResponce DeleteBugReportAction(int id)
        {
            return DeleteBugReportActionExecution(id);
        }

        public List<BugReportDto> GetAllBugReportAction()
        {
            return GetAllBugReportActionExecution();
        }

        public BugReportDto? GetBugReportByIdAction(int id)
        {
            return GetBugReportByIdActionExecution(id);
        }

        public ActionResponce UpdateBugReportAction(BugReportDto data)
        {
            return UpdateBugReportActionExecution(data);
        }
    }
}
