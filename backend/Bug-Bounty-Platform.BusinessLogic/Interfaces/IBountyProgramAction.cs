using Bug_Bounty_Platform.Domain.Models.BountyProgram;
using Bug_Bounty_Platform.Domain.Models.Responces;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IBountyProgramAction
    {
        List<BountyProgramDto> GetAllBountyProgramAction();
        BountyProgramDto? GetBountyProgramByIdAction(int id);
        ActionResponce CreateBountyProgramAction(BountyProgramDto data);
        ActionResponce UpdateBountyProgramAction(BountyProgramDto data);
        ActionResponce DeleteBountyProgramAction(int id);
    }
}
