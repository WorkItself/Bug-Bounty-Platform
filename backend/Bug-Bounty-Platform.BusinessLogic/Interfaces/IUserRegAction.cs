using Bug_Bounty_Platform.Domain.Models.Responces;
using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IUserRegAction
    {
        public ActionResponce UserRegDataValidation(UserRegisterDto uReg);
    }
}
