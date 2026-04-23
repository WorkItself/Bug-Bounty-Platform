using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class BugReportCommentExecution : BugReportCommentActions, IBugReportCommentAction
    {
        public List<BugReportCommentDto> GetCommentsByReportAction(int bugReportId)
            => GetCommentsByReportExecution(bugReportId);

        public ActionResponce AddCommentAction(BugReportCommentDto data)
            => AddCommentExecution(data);

        public ActionResponce DeleteCommentAction(int commentId)
            => DeleteCommentExecution(commentId);
    }
}
