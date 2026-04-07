using System.Collections.Generic;
using Bug_Bounty_Platform.Domain.Entities;
using Bug_Bounty_Platform.Domain.Entities.BountyProgram;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IBountyProgram
    {
        List<BountyProgram> GetAll();
        BountyProgram? GetById(int id);
        ActionResponse Create(BPCreateData data);
        ActionResponse Update(int id, BPUpdateData data);
        ActionResponse Delete(int id);
    }
}
