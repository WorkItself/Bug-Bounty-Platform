using Bug_Bounty_Platform.Domain.Models.BugReport;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IBugReportAction
    {
        List<BugReportDto> GetAllBugReportAction();
        BugReportDto? GetBugReportByIdAction(int id);
        ActionResponce CreateBugReportAction(BugReportDto data);
        ActionResponce UpdateBugReportAction(BugReportDto data);
        ActionResponce DeleteBugReportAction(int id);
    }
}
