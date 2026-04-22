using Bug_Bounty_Platform.BusinessLogic.Core;
using Bug_Bounty_Platform.BusinessLogic.Interfaces;
using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Structure
{
    public class BountyProgramExecution : BountyProgramActions, IBountyProgramAction
    {
        public ActionResponce CreateBountyProgramAction(BountyProgramDto data)
        {
            return CreateBountyProgramActionExecution(data);
        }

        public ActionResponce DeleteBountyProgramAction(int id)
        {
            return DeleteBountyProgramActionExecution(id);
        }

        public List<BountyProgramDto> GetAllBountyProgramAction()
        {
            return GetAllBountyProgramActionExecution();
        }

        public BountyProgramDto? GetBountyProgramByIdAction(int id)
        {
            return GetBountyProgramByIdActionExecution(id);
        }

        public ActionResponce UpdateBountyProgramAction(BountyProgramDto data)
        {
            return UpdateBountyProgramActionExecution(data);
        }
    }
}
