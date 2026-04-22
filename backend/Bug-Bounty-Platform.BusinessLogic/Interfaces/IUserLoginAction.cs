using Bug_Bounty_Platform.Domain.Models.User;

namespace Bug_Bounty_Platform.BusinessLogic.Interfaces
{
    public interface IUserLoginAction
    {
        public object UserLoginDataValidation(UserLoginDto udata);
    }
}
