using System.Collections.Generic;
using Bug_Bounty_Platform.Domain.Entities;
using Bug_Bounty_Platform.Domain.Entities.BugReport;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IBugReport
    {
        List<BugReport> GetAll();
        BugReport? GetById(int id);
        ActionResponse Create(BRCreateData data);
        ActionResponse Update(int id, BRUpdateData data);
        ActionResponse Delete(int id);
    }
}
