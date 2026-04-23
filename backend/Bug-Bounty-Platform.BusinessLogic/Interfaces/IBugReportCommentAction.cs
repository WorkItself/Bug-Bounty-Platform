using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IBugReportCommentAction
    {
        List<BugReportCommentDto> GetCommentsByReportAction(int bugReportId);
        ActionResponce AddCommentAction(BugReportCommentDto data);
        ActionResponce DeleteCommentAction(int commentId);
    }
}
